-- Create linkedin_profiles table
CREATE TABLE IF NOT EXISTS public.linkedin_profiles (
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
    UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own LinkedIn profile"
    ON public.linkedin_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own LinkedIn profile"
    ON public.linkedin_profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own LinkedIn profile"
    ON public.linkedin_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id); 