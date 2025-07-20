-- Fix password column to allow NULL for OAuth users
-- Run this in DBeaver on your AWS RDS database

-- Make password column nullable for OAuth users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'password';
