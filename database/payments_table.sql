-- Create payments table for managing payment screenshot reviews and transactions
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    views_limit INTEGER NOT NULL DEFAULT 0,
    ss_url TEXT NULL,
    rejection_reason TEXT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending'::text,
    package_type TEXT NOT NULL DEFAULT 'basic'::text,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    reviewed_by UUID NULL,
    amount NUMERIC(10,2) NULL,
    currency CHARACTER VARYING(3) NULL DEFAULT 'PKR'::character varying,
    payment_method TEXT NULL,
    notes TEXT NULL,
    CONSTRAINT payment_reviews_pkey PRIMARY KEY (id),
    CONSTRAINT payment_reviews_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users (id),
    CONSTRAINT payment_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles (user_id) ON DELETE CASCADE,
    CONSTRAINT payment_reviews_payment_status_check CHECK (
        payment_status = ANY (
            ARRAY[
                'pending'::text,
                'under_review'::text,
                'accepted'::text,
                'rejected'::text
            ]
        )
    )
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_reviews_user_id ON public.payments USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_payment_reviews_status ON public.payments USING btree (payment_status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_payment_reviews_created_at ON public.payments USING btree (created_at) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own payment reviews
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (
        user_id IN (
            SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
        )
    );

-- Policy for users to insert their own payment reviews
CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
        )
    );

-- Policy for users to update their own payment reviews (only ss_url when status is pending)
CREATE POLICY "Users can update their own pending payments" ON payments
    FOR UPDATE USING (
        user_id IN (
            SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
        ) AND 
        payment_status IN ('pending', 'under_review')
    ) WITH CHECK (
        user_id IN (
            SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
        ) AND 
        payment_status IN ('pending', 'under_review')
    );

-- Policy for admins to view all payment reviews
CREATE POLICY "Admins can view all payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Policy for admins to update all payment reviews
CREATE POLICY "Admins can update all payments" ON payments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = true
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_updated_at();

-- Function to handle payment acceptance and update user_subscriptions
CREATE OR REPLACE FUNCTION handle_payment_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if payment status changed to 'accepted'
    IF NEW.payment_status = 'accepted' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'accepted') THEN
        -- Update or insert user subscription with the views_limit from payment
        INSERT INTO user_subscriptions (user_id, views_limit, subscription_status, updated_at)
        VALUES (NEW.user_id, NEW.views_limit, 'active', NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
            views_limit = user_subscriptions.views_limit + NEW.views_limit,
            subscription_status = 'active',
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment acceptance
CREATE TRIGGER trigger_handle_payment_acceptance
    AFTER UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION handle_payment_acceptance();