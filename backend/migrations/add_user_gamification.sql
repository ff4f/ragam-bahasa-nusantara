-- Migration: Add gamification fields to users table
-- Date: 2025-11-26
-- Description: Add points, coins, level, and badges columns to support user progression system

-- Add points column
ALTER TABLE users 
ADD COLUMN points INT NOT NULL DEFAULT 0 
COMMENT 'User points for contributions and activities';

-- Add coins column  
ALTER TABLE users
ADD COLUMN coins INT NOT NULL DEFAULT 0
COMMENT 'Virtual currency for rewards';

-- Add level column
ALTER TABLE users
ADD COLUMN level INT NOT NULL DEFAULT 1
COMMENT 'User level based on XP/points';

-- Add badges column (JSON array)
ALTER TABLE users
ADD COLUMN badges JSON NOT NULL DEFAULT (JSON_ARRAY())
COMMENT 'Array of earned badges';

-- Verify the changes
SELECT 
    id, 
    email, 
    name, 
    role,
    points, 
    coins, 
    level, 
    JSON_LENGTH(badges) as badge_count,
    created_at
FROM users 
LIMIT 5;
