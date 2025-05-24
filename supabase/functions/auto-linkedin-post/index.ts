
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Auto LinkedIn post function called');
    
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

    // Get the job ID from request body
    const { jobId } = await req.json();
    
    if (!jobId) {
      console.error('Missing job ID');
      return new Response(
        JSON.stringify({ error: 'Missing job ID' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing job:', jobId);

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', user.id)
      .single();

    if (jobError || !job) {
      console.error('Job not found:', jobError);
      return new Response(
        JSON.stringify({ error: 'Job not found or access denied' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Job found:', job.title);

    // Check if user has LinkedIn token
    const { data: linkedinToken, error: tokenError } = await supabase
      .from('linkedin_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tokenError || !linkedinToken) {
      console.error('LinkedIn token not found:', tokenError);
      return new Response(
        JSON.stringify({ error: 'LinkedIn not connected. Please connect your LinkedIn account first.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if token is expired
    const expiresAt = new Date(linkedinToken.expires_at);
    const now = new Date();
    if (expiresAt <= now) {
      console.error('LinkedIn token expired');
      return new Response(
        JSON.stringify({ error: 'LinkedIn token expired. Please reconnect your LinkedIn account.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('LinkedIn token valid, generating post content...');

    // Generate LinkedIn post content using ChatGPT
    const postPrompt = `Create a professional LinkedIn job posting for the following position. Make it engaging and include relevant hashtags. Keep it under 280 characters for optimal engagement.

Job Details:
- Title: ${job.title}
- Location: ${job.location}
- Job Type: ${job.type}
- Workplace Type: ${job.workplace_type}
- Technologies: ${job.technologies?.join(', ') || 'Not specified'}
- Description: ${job.description}

Make the post sound professional, exciting, and include a call to action. Include 3-5 relevant hashtags.`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional HR specialist who creates engaging LinkedIn job posts. Keep posts concise, professional, and include relevant hashtags.' 
          },
          { role: 'user', content: postPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate post content' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIData = await openAIResponse.json();
    const postContent = openAIData.choices[0].message.content;
    
    console.log('Generated post content:', postContent);

    // Post to LinkedIn
    const linkedinPostData = {
      author: `urn:li:person:${linkedinToken.linkedin_id}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postContent
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    console.log('Posting to LinkedIn...');

    const linkedinResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${linkedinToken.access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(linkedinPostData),
    });

    console.log('LinkedIn response status:', linkedinResponse.status);

    if (!linkedinResponse.ok) {
      const errorText = await linkedinResponse.text();
      console.error('LinkedIn posting failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to post to LinkedIn', details: errorText }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const linkedinResult = await linkedinResponse.json();
    console.log('LinkedIn post successful:', linkedinResult.id);

    // Store the generated post in linkedin_posts table for reference
    const { error: postSaveError } = await supabase
      .from('linkedin_posts')
      .insert({
        content: postContent,
        posted: true,
        niche: 'Job Posting',
        tone: 'Professional',
        user_id: user.id,
        created_by: user.id
      });

    if (postSaveError) {
      console.error('Failed to save post record:', postSaveError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Job posted to LinkedIn successfully',
        postContent: postContent,
        linkedinPostId: linkedinResult.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in auto LinkedIn post function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
