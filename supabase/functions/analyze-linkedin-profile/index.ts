import { serve, createClient } from './deps.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Analyze LinkedIn profile function called');
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the JWT token and get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Invalid user token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('User verified:', user.id);

    // Get the LinkedIn profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching LinkedIn profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'LinkedIn profile not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare profile data for analysis
    const profileData = {
      name: profile.full_name,
      headline: profile.headline,
      currentPosition: profile.current_position,
      company: profile.company,
      bio: profile.bio,
      followerCount: profile.follower_count,
      connectionCount: profile.connection_count,
      skills: profile.skills || [],
      industry: profile.industry,
      experienceYears: profile.experience_years
    };

    // Generate analysis prompt
    const analysisPrompt = `As an expert LinkedIn profile analyzer and career coach, analyze this professional's profile and provide detailed insights and suggestions. The profile belongs to a professional in the tech industry.

Profile Data:
${JSON.stringify(profileData, null, 2)}

Provide a comprehensive analysis including:
1. Overall profile strength and professional brand
2. Career trajectory and potential
3. Network analysis and engagement potential
4. Skills assessment and gaps
5. Industry positioning
6. Specific suggestions for improvement

Format your response as a JSON object with the following structure:
{
  "summary": "Brief overall analysis",
  "insights": {
    "profileStrength": "Analysis of profile completeness and impact",
    "careerTrajectory": "Analysis of career path and potential",
    "networkAnalysis": "Analysis of professional network",
    "skillsAssessment": "Analysis of skills and expertise",
    "industryPosition": "Analysis of industry standing"
  },
  "suggestions": {
    "profile": ["List of profile improvement suggestions"],
    "content": ["List of content strategy suggestions"],
    "networking": ["List of networking suggestions"],
    "skills": ["List of skill development suggestions"]
  }
}`;

    // Call OpenAI API for analysis
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert LinkedIn profile analyzer and career coach. Provide detailed, actionable insights.'
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', await openAIResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to analyze profile' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIData = await openAIResponse.json();
    const analysis = JSON.parse(openAIData.choices[0].message.content);

    // Calculate engagement score based on profile completeness and network metrics
    const engagementScore = Math.min(100, Math.floor(
      (profile.profile_strength_score * 0.4) + 
      (profile.network_score * 0.6)
    ));

    // Update profile with analysis results
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ai_summary: analysis.summary,
        ai_insights: analysis.insights,
        ai_suggestions: analysis.suggestions,
        engagement_score: engagementScore,
        last_analysis_date: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile with analysis:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis results' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Profile analyzed successfully',
        data: {
          summary: analysis.summary,
          insights: analysis.insights,
          suggestions: analysis.suggestions,
          scores: {
            engagement: engagementScore,
            profile_strength: profile.profile_strength_score,
            network: profile.network_score
          }
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}); 