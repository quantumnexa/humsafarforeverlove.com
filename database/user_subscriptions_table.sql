-- Create user_subscriptions table for managing user subscription data
CREATE TABLE public.user_subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    subscription_status TEXT NOT NULL DEFAULT 'active'::text,
    profile_status TEXT NOT NULL DEFAULT 'pending'::text,
    views_limit INTEGER NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    verified_badge BOOLEAN NULL DEFAULT false,
    boost_profile BOOLEAN NULL DEFAULT false,
    CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id),
    CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles (user_id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(subscription_status);
CREATE INDEX idx_user_subscriptions_profile_status ON user_subscriptions(profile_status);
CREATE INDEX idx_user_subscriptions_created_at ON user_subscriptions(created_at);

-- Enable Row Level Security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own subscription
CREATE POLICY "Users can view their own subscription" ON user_subscriptions
    FOR SELECT USING (
        user_id IN (
            SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
        )
    );

-- Policy for users to update their own subscription (limited fields)
CREATE POLICY "Users can update their own subscription" ON user_subscriptions
    FOR UPDATE USING (
        user_id IN (
            SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
        )
    ) WITH CHECK (
        user_id IN (
            SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
        )
    );

-- Policy for admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Policy for admins to update all subscriptions
CREATE POLICY "Admins can update all subscriptions" ON user_subscriptions
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

-- Policy for system to insert subscriptions
CREATE POLICY "System can insert subscriptions" ON user_subscriptions
    FOR INSERT WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_subscriptions_updated_at();