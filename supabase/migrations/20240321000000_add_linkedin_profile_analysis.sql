-- Add analysis fields to linkedin_profiles table
ALTER TABLE public.linkedin_profiles
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS ai_insights JSONB,
ADD COLUMN IF NOT EXISTS ai_suggestions JSONB,
ADD COLUMN IF NOT EXISTS last_analysis_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS engagement_score INTEGER,
ADD COLUMN IF NOT EXISTS profile_strength_score INTEGER,
ADD COLUMN IF NOT EXISTS network_score INTEGER;

-- Create a function to update analysis scores
CREATE OR REPLACE FUNCTION update_profile_scores()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate profile strength score based on completeness
    NEW.profile_strength_score := (
        CASE WHEN NEW.full_name IS NOT NULL THEN 10 ELSE 0 END +
        CASE WHEN NEW.headline IS NOT NULL THEN 10 ELSE 0 END +
        CASE WHEN NEW.bio IS NOT NULL THEN 20 ELSE 0 END +
        CASE WHEN NEW.profile_image IS NOT NULL THEN 10 ELSE 0 END +
        CASE WHEN NEW.header_image IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN NEW.current_position IS NOT NULL THEN 15 ELSE 0 END +
        CASE WHEN NEW.company IS NOT NULL THEN 10 ELSE 0 END +
        CASE WHEN array_length(NEW.skills, 1) > 0 THEN 20 ELSE 0 END
    );

    -- Calculate network score based on connections and followers
    NEW.network_score := (
        CASE 
            WHEN NEW.connection_count >= 500 THEN 50
            WHEN NEW.connection_count >= 300 THEN 40
            WHEN NEW.connection_count >= 100 THEN 30
            ELSE (NEW.connection_count / 10)::integer
        END +
        CASE 
            WHEN NEW.follower_count >= 1000 THEN 50
            WHEN NEW.follower_count >= 500 THEN 40
            WHEN NEW.follower_count >= 100 THEN 30
            ELSE (NEW.follower_count / 10)::integer
        END
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic score updates
DROP TRIGGER IF EXISTS profile_scores_trigger ON public.linkedin_profiles;
CREATE TRIGGER profile_scores_trigger
    BEFORE INSERT OR UPDATE ON public.linkedin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_scores();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_skills ON public.linkedin_profiles USING gin(skills);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_industry ON public.linkedin_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_scores ON public.linkedin_profiles(profile_strength_score, network_score, engagement_score); 