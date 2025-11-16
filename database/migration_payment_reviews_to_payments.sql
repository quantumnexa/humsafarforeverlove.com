-- Migration script to rename payment_reviews table to payments and add new fields
-- Run these commands in your Supabase SQL Editor

-- Step 1: Rename the table from payment_reviews to payments
ALTER TABLE payment_reviews RENAME TO payments;

-- Step 2: Add new required fields to the payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'PKR';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS notes TEXT;

-- Step 3: Update existing records to have default values for new fields
UPDATE payments 
SET 
    amount = CASE 
        WHEN package_type = 'basic' THEN 500.00
        WHEN package_type = 'premium' THEN 1000.00
        WHEN package_type = 'premium_plus' THEN 1500.00
        ELSE 500.00
    END,
    currency = 'PKR',
    payment_method = 'bank_transfer'
WHERE amount IS NULL;

-- Step 4: Make amount and payment_method NOT NULL after setting default values
ALTER TABLE payments ALTER COLUMN amount SET NOT NULL;
ALTER TABLE payments ALTER COLUMN payment_method SET NOT NULL;

-- Step 5: Add CHECK constraint for payment_method
ALTER TABLE payments ADD CONSTRAINT check_payment_method 
CHECK (payment_method IN ('bank_transfer', 'jazzcash', 'easypaisa', 'card'));

-- Step 6: Drop old indexes and create new ones with updated names
DROP INDEX IF EXISTS idx_payment_reviews_user_id;
DROP INDEX IF EXISTS idx_payment_reviews_status;
DROP INDEX IF EXISTS idx_payment_reviews_created_at;

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_amount ON payments(amount);
CREATE INDEX idx_payments_payment_method ON payments(payment_method);

-- Step 7: Drop old policies and create new ones
DROP POLICY IF EXISTS "Users can view their own payment reviews" ON payments;
DROP POLICY IF EXISTS "Users can insert their own payment reviews" ON payments;
DROP POLICY IF EXISTS "Users can update their own pending payment reviews" ON payments;
DROP POLICY IF EXISTS "Admins can view all payment reviews" ON payments;
DROP POLICY IF EXISTS "Admins can update payment reviews" ON payments;

-- Create new policies with updated names
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending payments" ON payments
    FOR UPDATE USING (
        auth.uid() = user_id AND 
        payment_status IN ('pending', 'under_review')
    ) WITH CHECK (
        auth.uid() = user_id AND 
        payment_status IN ('pending', 'under_review')
    );

CREATE POLICY "Admins can view all payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

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

-- Step 8: Drop old functions and triggers, then create new ones
DROP TRIGGER IF EXISTS trigger_update_payment_reviews_updated_at ON payments;
DROP FUNCTION IF EXISTS update_payment_reviews_updated_at();

-- Create updated function
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    
    -- Set reviewed_at when status changes to accepted or rejected
    IF NEW.payment_status IN ('accepted', 'rejected') AND OLD.payment_status != NEW.payment_status THEN
        NEW.reviewed_at = NOW();
        NEW.reviewed_by = auth.uid();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER trigger_update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_updated_at();

-- Step 9: Update the payment acceptance trigger to work with new table name
DROP TRIGGER IF EXISTS trigger_handle_payment_acceptance ON payments;

CREATE TRIGGER trigger_handle_payment_acceptance
    AFTER UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION handle_payment_acceptance();

-- Migration completed successfully
-- The payment_reviews table has been renamed to payments with all necessary fields and constraints