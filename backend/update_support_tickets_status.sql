-- Update support_tickets table to use 'pending' as in-progress status
-- Note: No database changes needed, 'pending' already exists and means "in progress"

USE tourconnect;

-- Check current enum values
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'tourconnect' 
  AND TABLE_NAME = 'support_tickets' 
  AND COLUMN_NAME = 'status';

-- Current status values should be: 'open', 'pending', 'closed', 'resolved'
-- Where 'pending' = "in progress" (đang xử lý)
