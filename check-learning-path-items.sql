-- Check if learning path items exist for the latest learning path
-- Run this in your Supabase SQL Editor

-- First, let's see all learning paths
SELECT 
    id, 
    title, 
    user_id, 
    created_at,
    estimated_duration_weeks,
    total_hours
FROM learning_paths 
ORDER BY created_at DESC 
LIMIT 5;

-- Then check if there are any learning path items
SELECT 
    lpi.id,
    lpi.path_id,
    lpi.title,
    lpi.item_type,
    lpi.order_index,
    lpi.estimated_hours,
    lp.title as path_title
FROM learning_path_items lpi
JOIN learning_paths lp ON lpi.path_id = lp.id
ORDER BY lp.created_at DESC, lpi.order_index;

-- Check if the tables exist and have the right structure
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('learning_paths', 'learning_path_items')
ORDER BY table_name, ordinal_position;
