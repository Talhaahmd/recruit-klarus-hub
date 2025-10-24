-- Create the linkedin_profiles table
CREATE TABLE IF NOT EXISTS linkedin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_image TEXT,
    header_image TEXT,
    full_name TEXT NOT NULL,
    headline TEXT,
    current_position TEXT,
    company TEXT,
    bio TEXT,
    follower_count INTEGER DEFAULT 0,
    connection_count INTEGER DEFAULT 0,
    profile_url TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own LinkedIn profile" ON linkedin_profiles;
DROP POLICY IF EXISTS "Users can insert their own LinkedIn profile" ON linkedin_profiles;
DROP POLICY IF EXISTS "Users can update their own LinkedIn profile" ON linkedin_profiles;

-- Create policies
CREATE POLICY "Users can view their own LinkedIn profile"
    ON linkedin_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own LinkedIn profile"
    ON linkedin_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own LinkedIn profile"
    ON linkedin_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_linkedin_profiles_user_id ON linkedin_profiles(user_id);
CREATE INDEX idx_linkedin_profiles_last_updated ON linkedin_profiles(last_updated); 