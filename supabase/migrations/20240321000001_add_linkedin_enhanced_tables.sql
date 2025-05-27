-- Create linkedin_organizations table
CREATE TABLE IF NOT EXISTS public.linkedin_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    vanity_name TEXT,
    website TEXT,
    description TEXT,
    logo_url TEXT,
    follower_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

-- Create linkedin_ad_accounts table
CREATE TABLE IF NOT EXISTS public.linkedin_ad_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id TEXT NOT NULL,
    organization_id UUID REFERENCES public.linkedin_organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    type TEXT NOT NULL,
    reference TEXT,
    currency TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, account_id)
);

-- Create linkedin_ad_analytics table
CREATE TABLE IF NOT EXISTS public.linkedin_ad_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_account_id UUID NOT NULL REFERENCES public.linkedin_ad_accounts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ad_account_id, date)
);

-- Create linkedin_organization_analytics table
CREATE TABLE IF NOT EXISTS public.linkedin_organization_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.linkedin_organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    follower_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    post_impressions INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.linkedin_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_ad_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_organization_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own LinkedIn organizations"
    ON public.linkedin_organizations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own LinkedIn organizations"
    ON public.linkedin_organizations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own LinkedIn organizations"
    ON public.linkedin_organizations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own LinkedIn ad accounts"
    ON public.linkedin_ad_accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own LinkedIn ad accounts"
    ON public.linkedin_ad_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own LinkedIn ad accounts"
    ON public.linkedin_ad_accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own LinkedIn ad analytics"
    ON public.linkedin_ad_analytics FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.linkedin_ad_accounts
        WHERE id = linkedin_ad_analytics.ad_account_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own LinkedIn ad analytics"
    ON public.linkedin_ad_analytics FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.linkedin_ad_accounts
        WHERE id = linkedin_ad_analytics.ad_account_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own LinkedIn organization analytics"
    ON public.linkedin_organization_analytics FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.linkedin_organizations
        WHERE id = linkedin_organization_analytics.organization_id
        AND user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own LinkedIn organization analytics"
    ON public.linkedin_organization_analytics FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.linkedin_organizations
        WHERE id = linkedin_organization_analytics.organization_id
        AND user_id = auth.uid()
    ));

-- Create indexes
CREATE INDEX idx_linkedin_organizations_user_id ON public.linkedin_organizations(user_id);
CREATE INDEX idx_linkedin_organizations_org_id ON public.linkedin_organizations(organization_id);
CREATE INDEX idx_linkedin_ad_accounts_user_id ON public.linkedin_ad_accounts(user_id);
CREATE INDEX idx_linkedin_ad_accounts_org_id ON public.linkedin_ad_accounts(organization_id);
CREATE INDEX idx_linkedin_ad_analytics_account_id ON public.linkedin_ad_analytics(ad_account_id);
CREATE INDEX idx_linkedin_ad_analytics_date ON public.linkedin_ad_analytics(date);
CREATE INDEX idx_linkedin_org_analytics_org_id ON public.linkedin_organization_analytics(organization_id);
CREATE INDEX idx_linkedin_org_analytics_date ON public.linkedin_organization_analytics(date); 