import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log('[GLP] Function Invoked', { method: req.method });
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[GLP] Attempting to get Authorization header.');
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[GLP] Error: Missing or invalid Authorization header.');
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const token = authHeader.replace('Bearer ', '');
    console.log('[GLP] Auth token retrieved.');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;
    console.log('[GLP] Environment variables loaded.');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('[GLP] Supabase admin client initialized.');

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('[GLP] Error: Invalid user token.', { userError });
      return new Response(JSON.stringify({ error: 'Invalid user token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    console.log('[GLP] User verified:', { userId: user.id });

    const { niche, tone, contentPrompt, scheduleDate, scheduleTime } = await req.json();
    console.log('[GLP] Request body parsed:', { niche, tone, contentPromptPresent: !!contentPrompt, scheduleDate, scheduleTime });

    if (!niche || !tone || !contentPrompt) {
      console.error('[GLP] Error: Missing required fields.', { niche, tone, contentPromptPresent: !!contentPrompt });
      return new Response(JSON.stringify({ error: 'Missing required fields: niche, tone, and contentPrompt are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('[GLP] Fetching LinkedIn token for user:', user.id);
    const { data: linkedinTokenData, error: tokenError } = await supabase
      .from('linkedin_tokens')
      .select('access_token, linkedin_id, expires_at') // Select only necessary fields
      .eq('user_id', user.id)
      .single();

    if (tokenError || !linkedinTokenData) {
      console.error('[GLP] Error: LinkedIn token not found or query failed.', { tokenError });
      return new Response(JSON.stringify({ error: 'LinkedIn not connected. Please connect your LinkedIn account first.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    console.log('[GLP] LinkedIn token data retrieved.');

    const expiresAt = new Date(linkedinTokenData.expires_at);
    if (expiresAt <= new Date()) {
      console.error('[GLP] Error: LinkedIn token expired.', { expiresAt });
      return new Response(JSON.stringify({ error: 'LinkedIn token expired. Please reconnect your LinkedIn account.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    console.log('[GLP] LinkedIn token is valid, expires at:', expiresAt);

    console.log('[GLP] Generating final post content with OpenAI...');
    const postContentPrompt = `You are an expert LinkedIn post writer. Rewrite the following content to be engaging and professional for LinkedIn, incorporating the specified tone. The post should be well-structured. 

    Original Content Prompt: ${contentPrompt}
    Tone: ${tone}
    Niche: ${niche}

    Please ensure the post flows well and is ready for publication. Do NOT include any self-referential statements like "Here's the rewritten post:". Just output the final post content.`;

    let finalPostText = contentPrompt; // Fallback to original content if OpenAI fails
    try {
      const contentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${openAIApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: postContentPrompt }], temperature: 0.7, max_tokens: 1000 }),
        signal: AbortSignal.timeout(20000) // 20s timeout
      });
      if (!contentResponse.ok) {
        const errorBody = await contentResponse.text();
        console.error('[GLP] OpenAI final post content generation failed.', { status: contentResponse.status, body: errorBody });
      } else {
        const contentData = await contentResponse.json();
        if (contentData.choices && contentData.choices[0] && contentData.choices[0].message) {
          finalPostText = contentData.choices[0].message.content.trim();
          console.log('[GLP] Final post content generated by OpenAI.');
        } else {
          console.warn('[GLP] OpenAI final post content response OK, but content missing. Using original prompt.', contentData);
        }
      }
    } catch (e) {
      console.error('[GLP] Error during OpenAI final post content generation fetch:', e.message);
    }

    if (scheduleDate && scheduleTime) {
      console.log('[GLP] Scheduling post for:', { scheduleDate, scheduleTime });
      // Store the post for scheduling
      const { error: scheduleError } = await supabase.from('scheduled_posts').insert({
        user_id: user.id,
        linkedin_id: linkedinTokenData.linkedin_id,
        content: finalPostText,
        scheduled_at_utc: `${scheduleDate}T${scheduleTime}:00Z`,
        status: 'pending',
        niche: niche,
        tone: tone
      });
      if (scheduleError) {
        console.error('[GLP] Error saving scheduled post to DB:', { scheduleError });
        return new Response(JSON.stringify({ error: `Failed to schedule post: ${scheduleError.message}` }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      console.log('[GLP] Post successfully scheduled in DB.');
      return new Response(JSON.stringify({ message: 'Post scheduled successfully', content: finalPostText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
      });
    } else {
      console.log('[GLP] Posting directly to LinkedIn...');
      const postPayload: any = {
        author: `urn:li:person:${linkedinTokenData.linkedin_id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: finalPostText },
            shareMediaCategory: 'NONE', // ALWAYS NONE FOR TEXT-ONLY
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      };
      console.log('[GLP] LinkedIn post payload:', JSON.stringify(postPayload, null, 2));

      const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${linkedinTokenData.access_token}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
        body: JSON.stringify(postPayload),
        signal: AbortSignal.timeout(20000) // 20s timeout
      });

      if (!postResponse.ok) {
        const errorBodyText = await postResponse.text(); // Read as text first
        console.error('[GLP] LinkedIn ugcPosts API call failed.', { status: postResponse.status, body: errorBodyText });
        
        let linkedInErrorDetails: any = null;
        try {
          linkedInErrorDetails = JSON.parse(errorBodyText);
        } catch (parseError) {
          console.warn('[GLP] Could not parse LinkedIn error body (ugcPosts) as JSON:', parseError.message);
        }

        if (postResponse.status === 401 && linkedInErrorDetails && 
            (linkedInErrorDetails.serviceErrorCode === 65601 || linkedInErrorDetails.code === 'REVOKED_ACCESS_TOKEN')) {
          console.error('[GLP] LinkedIn token revoked (detected from ugcPosts API error).', { details: linkedInErrorDetails });
          return new Response(JSON.stringify({ 
            error: 'LINKEDIN_TOKEN_REVOKED', 
            message: linkedInErrorDetails.message || 'The LinkedIn token has been revoked or is invalid. Please re-authenticate your LinkedIn account.' 
          }), {
            status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Fallback to generic error for other failures
        return new Response(JSON.stringify({ error: 'Failed to post to LinkedIn', details: errorBodyText }), {
          status: postResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      const postResponseData = await postResponse.json();
      console.log('[GLP] Successfully posted to LinkedIn:', { postId: postResponseData.id });
      return new Response(JSON.stringify({ message: 'Post created successfully on LinkedIn!', content: finalPostText, linkedinPostId: postResponseData.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
      });
    }
  } catch (error) {
    console.error('[GLP] Unhandled error in function:', error.message, { stack: error.stack });
    return new Response(JSON.stringify({ error: error.message || 'An unexpected server error occurred.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
