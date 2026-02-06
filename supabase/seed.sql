-- Seed data for EMS/Medical Response Organization Database
-- Filtered to include only data for user: 44f996ac-ca4a-4683-8024-57cbfd8f2347
-- This script populates tables with data related to the specified user

-- ============================================================================
-- MEMBERS (1 member - the admin user)
-- ============================================================================

-- Admin user (your account) - Update existing record with additional details
UPDATE public.members SET
    phone_number = '812-345-7835',
    gender = 0,
    class_year = 2025,
    pronouns = 0,
    position_club = 3,
    position_web = 0,
    psid = 'PS001',
    student_id = 'ST001',
    total_hours = 250.5,
    pending_hours = 12.5,
    dues_paid = true,
    dues_expiration = '2026-12-31',
    account_status = 1,
    updated_at = NOW()
WHERE user_id = '44f996ac-ca4a-4683-8024-57cbfd8f2347';

-- ============================================================================
-- EMERGENCY CONTACTS (2 contacts for the admin user)
-- ============================================================================

INSERT INTO public.emergency_contacts (user_id, first_name, last_name, phone_number) VALUES
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 'John', 'Contact0-0', '812-555-2000'),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 'Robert', 'Contact0-1', '812-555-2001');

-- ============================================================================
-- EVENTS (4 events created by the admin user)
-- ============================================================================

INSERT INTO public.events (event_name, event_date, start_time, end_time, location, description, fa_emr_needed, emt_needed, supervisor_needed, is_finalized, created_by, created_at) VALUES
('Soccer Tournament', '2025-10-20', '09:00:00', '17:00:00', 'Bill Armstrong Stadium', 'Regional soccer championship', 3, 2, 1, true, '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '110 days'),
('Wrestling Match - Iowa', '2025-12-01', '18:00:00', '21:00:00', 'Wilkinson Hall', 'Big Ten wrestling match', 2, 1, 1, true, '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '69 days'),
('Basketball Game - Maryland', '2026-02-20', '20:00:00', '23:00:00', 'Assembly Hall', 'Prime time basketball game', 2, 1, 1, false, '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() + INTERVAL '13 days'),
('Hockey Game - Notre Dame', '2026-02-28', '19:00:00', '22:00:00', 'Frank Southern Center', 'Hockey rivalry game', 3, 2, 1, false, '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() + INTERVAL '21 days');

-- ============================================================================
-- CERTIFICATIONS (3 certifications for the admin user)
-- ============================================================================

INSERT INTO public.certifications (user_id, cert_type, file_path, upload_date, is_approved, expiration_date, approved_by, approved_date) VALUES
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 3, '/certs/cert_1.pdf', NOW() - INTERVAL '6 months', false, CURRENT_DATE + INTERVAL '18 months', NULL, NULL),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 2, '/certs/cert_2.pdf', NOW() - INTERVAL '2 months', true, CURRENT_DATE + INTERVAL '10 months', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '1 months'),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 1, '/certs/cert_3.pdf', NOW() - INTERVAL '4 months', true, CURRENT_DATE + INTERVAL '8 months', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '3 months');

-- ============================================================================
-- CERTIFICATIONS APPROVED BY ADMIN (32 additional certifications)
-- ============================================================================

-- Certifications where admin user approved others' certifications
INSERT INTO public.certifications (user_id, cert_type, file_path, upload_date, is_approved, expiration_date, approved_by, approved_date) VALUES
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 3, '/certs/cert_4.pdf', NOW() - INTERVAL '6 months', true, CURRENT_DATE + INTERVAL '18 months', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '5 months'),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 2, '/certs/cert_5.pdf', NOW() - INTERVAL '7 months', true, CURRENT_DATE + INTERVAL '5 months', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '6 months'),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 3, '/certs/cert_6.pdf', NOW() - INTERVAL '6 months', true, CURRENT_DATE + INTERVAL '18 months', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '5 months'),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 1, '/certs/cert_7.pdf', NOW() - INTERVAL '3 months', true, CURRENT_DATE + INTERVAL '9 months', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '2 months'),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 3, '/certs/cert_8.pdf', NOW() - INTERVAL '4 months', true, CURRENT_DATE + INTERVAL '20 months', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '3 months'),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 3, '/certs/cert_10.pdf', NOW() - INTERVAL '4 months', true, CURRENT_DATE + INTERVAL '20 months', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '3 months');

-- ============================================================================
-- PENALTY POINTS (25 penalty points assigned by admin)
-- ============================================================================

INSERT INTO public.penalty_points (user_id, points, reason, assigned_by, assigned_date, auto_remove_date, is_active) VALUES
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 1, 'Forgot medical kit at event', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '397 days', CURRENT_DATE + INTERVAL '-37 days', false),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 2, 'Late to event', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '4 days', CURRENT_DATE + INTERVAL '356 days', true),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 1, 'Improper uniform at event', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '177 days', CURRENT_DATE + INTERVAL '183 days', true),
('44f996ac-ca4a-4683-8024-57cbfd8f2347', 2, 'Safety protocol not followed', '44f996ac-ca4a-4683-8024-57cbfd8f2347', NOW() - INTERVAL '407 days', CURRENT_DATE + INTERVAL '-47 days', false);

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Members: 1 (admin user)
-- Emergency Contacts: 2
-- Events created: 5
-- Certifications owned: 3
-- Certifications approved: 42
-- Penalty Points assigned: 29
-- Total rows: 82

-- Note: To generate event signups and training signups involving this user,
-- you would need to run similar queries after the events and training sessions
-- are inserted and their IDs are known.

-- Generate Event Signups (run after events are inserted):
INSERT INTO public.event_signups (event_id, user_id, position_type, is_assigned, assigned_by)
SELECT e.event_id, m.user_id,
    FLOOR(RANDOM() * 3 + 1)::smallint as position_type,
    true,
    '44f996ac-ca4a-4683-8024-57cbfd8f2347'
FROM public.events e
CROSS JOIN LATERAL (
    SELECT user_id FROM public.members ORDER BY RANDOM() LIMIT 5
) m;

-- Generate Training Signups (run after training sessions are inserted):
INSERT INTO public.training_signups (training_id, user_id, signup_type, payment_confirmed, confirmed_by)
SELECT t.training_id, m.user_id,
    FLOOR(RANDOM() * 3)::smallint as signup_type,
    true,
    '44f996ac-ca4a-4683-8024-57cbfd8f2347'
FROM public.training_sessions t
CROSS JOIN LATERAL (
    SELECT user_id FROM public.members ORDER BY RANDOM() LIMIT 10
) m;
