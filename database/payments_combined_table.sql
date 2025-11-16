-- Create combined payments table for managing all payment transactions and reviews
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL, -- Payment amount in PKR
    currency VARCHAR(3) NOT NULL DEFAULT 'PKR',
    views_limit INTEGER NOT NULL DEFAULT 0, -- Number of profile views purchased
    package_type TEXT NOT NULL DEFAULT 'basic', -- Package type (basic, premium, premium_plus)
    payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'jazzcash', 'easypaisa', 'card')),
    ss_url TEXT, -- Payment screenshot URL
    rejection_reason TEXT, -- Reason for rejection (from payment_reviews)
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'under_review', 'accepted', 'rejected', 'completed', 'failed', 'cancelled', 'refunded')),
    notes TEXT, -- Additional notes or comments
    reviewed_at TIMESTAMP WITH TIME ZONE, -- When payment was reviewed (from payment_reviews)
    reviewed_by UUID REFERENCES auth.users(id), -- Admin who reviewed the payment
    processed_by UUID REFERENCES auth.users(id), -- Admin who processed the payment
    processed_at TIMESTAMP WITH TIME ZONE, -- When payment was processed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_amount ON payments(amount);
CREATE INDEX idx_payments_payment_method ON payments(payment_method);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own payments
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own payments
CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own pending payments (only ss_url when status is pending/under_review)
CREATE POLICY "Users can update their own pending payments" ON payments
    FOR UPDATE USING (
        auth.uid() = user_id AND 
        payment_status IN ('pending', 'under_review')
    ) WITH CHECK (
        auth.uid() = user_id AND 
        payment_status IN ('pending', 'under_review')
    );

-- Policy for admins to view all payments
CREATE POLICY "Admins can view all payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Policy for admins to update payments (for approval/rejection/processing)
CREATE POLICY "Admins can update payments" ON payments
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

-- Function to automatically update updated_at timestamp and handle status changes
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    
    -- Set reviewed_at when status changes to accepted or rejected
    IF NEW.payment_status IN ('accepted', 'rejected') AND OLD.payment_status != NEW.payment_status THEN
        NEW.reviewed_at = NOW();
        NEW.reviewed_by = auth.uid();
    END IF;
    
    -- Set processed_at when status changes to completed
    IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
        NEW.processed_at = NOW();
        NEW.processed_by = auth.uid();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at and status changes
CREATE TRIGGER trigger_update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_updated_at();

-- Function to transfer views_limit to user_subscriptions when payment is accepted
CREATE OR REPLACE FUNCTION handle_payment_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if status changed to 'accepted'
    IF NEW.payment_status = 'accepted' AND OLD.payment_status != 'accepted' THEN
        -- Update or insert into user_subscriptions
        INSERT INTO user_subscriptions (
            user_id, 
            views_limit, 
            payment_status,
            subscription_status,
            updated_at
        ) VALUES (
            NEW.user_id,
            NEW.views_limit,
            'approved',
            CASE 
                WHEN NEW.package_type = 'basic' THEN 'Basic Package'
                WHEN NEW.package_type = 'premium' THEN 'Premium Package'
                WHEN NEW.package_type = 'premium_plus' THEN 'Premium Plus Package'
                ELSE 'Basic Package'
            END,
            NOW()
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET
            views_limit = EXCLUDED.views_limit,
            payment_status = 'approved',
            subscription_status = EXCLUDED.subscription_status,
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