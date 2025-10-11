-- ============================================================
-- TEMPLE MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================
--
-- This schema supports both:
-- 1. Donation Management Module
-- 2. Pooja Booking Management Module
--
-- Database: PostgreSQL 14+
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS TABLE (Shared between both modules)
-- ============================================================

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Authentication
    google_id VARCHAR(255) UNIQUE,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,

    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),

    -- WhatsApp Group Management
    whatsapp_group_added BOOLEAN DEFAULT FALSE,
    whatsapp_group_added_at TIMESTAMP,
    whatsapp_opt_in BOOLEAN DEFAULT TRUE,

    -- Statistics
    total_donations DECIMAL(10,2) DEFAULT 0.00,
    donation_count INT DEFAULT 0,
    booking_count INT DEFAULT 0,
    first_activity_date TIMESTAMP,
    last_activity_date TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_whatsapp_pending ON users(whatsapp_group_added) WHERE whatsapp_group_added = FALSE;

-- ============================================================
-- 2. DONATIONS MODULE
-- ============================================================

-- 2.1 Donations Table
CREATE TABLE donations (
    donation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,  -- TMPL/FY/2024-25/00001
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,

    -- Donation Details
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    donation_type VARCHAR(50) DEFAULT 'General',
    donation_purpose TEXT,

    -- Payment Details
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED')),
    payment_method VARCHAR(20) NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),

    -- Bank Transfer Details (if applicable)
    bank_name VARCHAR(255),
    bank_account_last4 VARCHAR(4),
    transaction_reference VARCHAR(100),

    -- Receipt & Delivery
    receipt_pdf_url TEXT,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    whatsapp_sent_at TIMESTAMP,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_donations_receipt ON donations(receipt_number);
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_date ON donations(created_at DESC);
CREATE INDEX idx_donations_amount ON donations(amount);

-- 2.2 Receipt Sequence Table
CREATE TABLE receipt_sequence (
    fiscal_year VARCHAR(7) PRIMARY KEY,  -- "2024-25"
    last_sequence INT DEFAULT 0
);

-- ============================================================
-- 3. POOJA BOOKING MODULE
-- ============================================================

-- 3.1 Pooja Services Table (Master data)
CREATE TABLE pooja_services (
    pooja_id SERIAL PRIMARY KEY,
    pooja_name VARCHAR(255) NOT NULL,
    pooja_name_kannada VARCHAR(255),
    pooja_name_hindi VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    duration_minutes INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populate with services from the image
INSERT INTO pooja_services (pooja_name, price, display_order, description) VALUES
('Nithya Pooja', 201.00, 1, 'Daily worship service'),
('Padha Pooja', 201.00, 2, 'Foot worship ceremony'),
('Panchmrutha Abhisheka', 201.00, 3, 'Five sacred substances abhishekam'),
('Madhu Abhisheka', 251.00, 4, 'Honey ablution ceremony'),
('Sarva Seva', 501.00, 5, 'Complete worship service'),
('Vishesha Alankara Seva', 1001.00, 6, 'Special decoration service'),
('Belli Kavachadharane', 1001.00, 7, 'Silver armor adornment'),
('Sahasranama Archane', 251.00, 8, 'Thousand names archana'),
('Vayusthuthi Punascharne', 501.00, 9, 'Vayu stuti repeated chanting'),
('Kanakabhisheka', 501.00, 10, 'Gold ablution ceremony'),
('Vastra Arpane Seva', 2001.00, 11, 'Cloth offering service');

-- Index
CREATE INDEX idx_pooja_active ON pooja_services(is_active, display_order);

-- 3.2 Pooja Bookings Table
CREATE TABLE pooja_bookings (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,  -- PJB/FY/2024-25/00001
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,

    -- User Information (denormalized for easy access)
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(15) NOT NULL,
    user_email VARCHAR(255),
    nakshatra VARCHAR(100) NOT NULL,

    -- Pooja Details
    pooja_id INT REFERENCES pooja_services(pooja_id),
    pooja_name VARCHAR(255) NOT NULL,
    pooja_price DECIMAL(10,2) NOT NULL CHECK (pooja_price > 0),

    -- Scheduling
    preferred_date DATE,
    preferred_time TIME,
    confirmed_date DATE,
    confirmed_time TIME,
    special_instructions TEXT,

    -- Payment Details
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED')),
    payment_method VARCHAR(20),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    transaction_id VARCHAR(100),

    -- Booking Status & Workflow
    booking_status VARCHAR(20) DEFAULT 'PENDING' CHECK (booking_status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    user_confirmation_sent BOOLEAN DEFAULT FALSE,
    user_confirmation_sent_at TIMESTAMP,
    admin_notification_sent BOOLEAN DEFAULT FALSE,
    admin_notification_sent_at TIMESTAMP,
    confirmed_by_admin_id UUID REFERENCES admin_users(admin_id),
    confirmed_by_admin_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_bookings_number ON pooja_bookings(booking_number);
CREATE INDEX idx_bookings_user ON pooja_bookings(user_id);
CREATE INDEX idx_bookings_phone ON pooja_bookings(user_phone);
CREATE INDEX idx_bookings_status ON pooja_bookings(booking_status);
CREATE INDEX idx_bookings_payment ON pooja_bookings(payment_status);
CREATE INDEX idx_bookings_pref_date ON pooja_bookings(preferred_date);
CREATE INDEX idx_bookings_conf_date ON pooja_bookings(confirmed_date);
CREATE INDEX idx_bookings_created ON pooja_bookings(created_at DESC);

-- 3.3 Booking Sequence Table
CREATE TABLE booking_sequence (
    fiscal_year VARCHAR(7) PRIMARY KEY,  -- "2024-25"
    last_sequence INT DEFAULT 0
);

-- ============================================================
-- 4. WHATSAPP GROUP MANAGEMENT
-- ============================================================

-- 4.1 WhatsApp Groups Table
CREATE TABLE whatsapp_groups (
    group_id VARCHAR(100) PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    group_invite_link TEXT,
    participant_count INT DEFAULT 0,
    max_participants INT DEFAULT 1000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4.2 WhatsApp Group Members Table
CREATE TABLE whatsapp_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id VARCHAR(100) REFERENCES whatsapp_groups(group_id),
    user_id UUID REFERENCES users(user_id),
    phone_number VARCHAR(15),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'left', 'removed')),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    removed_at TIMESTAMP,
    UNIQUE(group_id, user_id)
);

-- Index
CREATE INDEX idx_group_members_user ON whatsapp_group_members(user_id);
CREATE INDEX idx_group_members_status ON whatsapp_group_members(status);

-- 4.3 Failed WhatsApp Additions Table
CREATE TABLE whatsapp_failed_additions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    phone_number VARCHAR(15),
    error_message TEXT,
    retry_count INT DEFAULT 0,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_retry_at TIMESTAMP
);

-- Index
CREATE INDEX idx_failed_additions_resolved ON whatsapp_failed_additions(resolved);

-- ============================================================
-- 5. ADMIN MODULE
-- ============================================================

-- 5.1 Admin Users Table
CREATE TABLE admin_users (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(15),
    role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'viewer', 'priest')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX idx_admin_email ON admin_users(email);
CREATE INDEX idx_admin_active ON admin_users(is_active);

-- 5.2 Admin Activity Log Table
CREATE TABLE admin_activity_log (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admin_users(admin_id),
    action_type VARCHAR(50) NOT NULL,
    action_description TEXT,
    entity_type VARCHAR(50),  -- 'donation', 'booking', 'user', etc.
    entity_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX idx_activity_admin ON admin_activity_log(admin_id);
CREATE INDEX idx_activity_date ON admin_activity_log(created_at DESC);

-- ============================================================
-- 6. SYSTEM CONFIGURATION
-- ============================================================

CREATE TABLE system_config (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT,
    config_type VARCHAR(20) DEFAULT 'string',  -- string, number, boolean, json
    description TEXT,
    updated_by UUID REFERENCES admin_users(admin_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('temple_name', 'Sri Raghavendra Swamy Temple', 'Temple name for receipts and certificates'),
('temple_address', 'Damodar Modaliar Road, Ulsoor', 'Temple address line 1'),
('temple_city', 'Bangalore', 'City'),
('temple_state', 'Karnataka', 'State'),
('temple_pincode', '560008', 'Pincode'),
('temple_phone_1', '9945594845', 'Primary contact number'),
('temple_phone_2', '9902520105', 'Secondary contact number'),
('temple_email', 'contact@temple.org', 'Contact email'),
('razorpay_enabled', 'true', 'Enable Razorpay payments'),
('whatsapp_enabled', 'true', 'Enable WhatsApp notifications'),
('fiscal_year_start_month', '4', 'Fiscal year starts in April');

-- ============================================================
-- 7. TRIGGERS FOR AUTO-UPDATE
-- ============================================================

-- Trigger function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON pooja_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pooja_services_updated_at BEFORE UPDATE ON pooja_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 8. USEFUL VIEWS
-- ============================================================

-- View: User complete profile with statistics
CREATE VIEW user_profiles AS
SELECT
    u.*,
    COUNT(DISTINCT d.donation_id) as total_donations_count,
    COALESCE(SUM(d.amount), 0) as total_donated_amount,
    COUNT(DISTINCT b.booking_id) as total_bookings_count,
    MAX(d.created_at) as last_donation_date,
    MAX(b.created_at) as last_booking_date
FROM users u
LEFT JOIN donations d ON u.user_id = d.user_id AND d.payment_status = 'SUCCESS'
LEFT JOIN pooja_bookings b ON u.user_id = b.user_id AND b.payment_status = 'SUCCESS'
GROUP BY u.user_id;

-- View: Today's donations summary
CREATE VIEW todays_donations AS
SELECT
    COUNT(*) as donation_count,
    COALESCE(SUM(amount), 0) as total_amount,
    COUNT(DISTINCT user_id) as unique_donors
FROM donations
WHERE DATE(created_at) = CURRENT_DATE
AND payment_status = 'SUCCESS';

-- View: Today's bookings summary
CREATE VIEW todays_bookings AS
SELECT
    COUNT(*) as booking_count,
    COALESCE(SUM(pooja_price), 0) as total_amount,
    COUNT(DISTINCT user_id) as unique_devotees,
    SUM(CASE WHEN booking_status = 'PENDING' THEN 1 ELSE 0 END) as pending_confirmations
FROM pooja_bookings
WHERE DATE(created_at) = CURRENT_DATE
AND payment_status = 'SUCCESS';

-- View: Pending bookings that need admin action
CREATE VIEW pending_bookings_admin AS
SELECT
    b.*,
    p.pooja_name as service_name,
    p.duration_minutes
FROM pooja_bookings b
JOIN pooja_services p ON b.pooja_id = p.pooja_id
WHERE b.booking_status = 'PENDING'
AND b.payment_status = 'SUCCESS'
ORDER BY b.created_at ASC;

-- ============================================================
-- 9. SAMPLE QUERIES (FOR REFERENCE)
-- ============================================================

-- Get fiscal year for current date
CREATE OR REPLACE FUNCTION get_fiscal_year()
RETURNS VARCHAR AS $$
DECLARE
    current_month INT;
    current_year INT;
    fiscal_year VARCHAR;
BEGIN
    current_month := EXTRACT(MONTH FROM CURRENT_DATE);
    current_year := EXTRACT(YEAR FROM CURRENT_DATE);

    IF current_month >= 4 THEN
        fiscal_year := current_year || '-' || (current_year + 1) % 100;
    ELSE
        fiscal_year := (current_year - 1) || '-' || current_year % 100;
    END IF;

    RETURN fiscal_year;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 10. INDEXES FOR REPORTING
-- ============================================================

-- Composite indexes for common queries
CREATE INDEX idx_donations_user_status ON donations(user_id, payment_status);
CREATE INDEX idx_bookings_user_status ON pooja_bookings(user_id, booking_status);
CREATE INDEX idx_donations_date_status ON donations(created_at, payment_status);
CREATE INDEX idx_bookings_date_status ON pooja_bookings(created_at, booking_status);

-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================

-- To check all tables created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- To check all indexes:
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';

-- To get table statistics:
-- SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
