
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  postId: string;
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { postId, content }: RequestBody = await req.json();

    console.log(`Publishing post ${postId} for user ${user.id}`);

    // Get LinkedIn token for the user
    const { data: tokenData } = await supabaseClient
      .from('linkedin_tokens')
      .select('access_token')
      .eq('user_id', user.id)
      .single();

    if (!tokenData?.access_token) {
      throw new Error('LinkedIn not connected. Please connect your LinkedIn account first.');
    }

    // Publish to LinkedIn
    const linkedinResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: `urn:li:person:${user.id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });

    if (!linkedinResponse.ok) {
      const errorData = await linkedinResponse.json();
      console.error('LinkedIn API error:', errorData);
      throw new Error(`Failed to publish to LinkedIn: ${errorData.message || 'Unknown error'}`);
    }

    const linkedinResult = await linkedinResponse.json();
    console.log('LinkedIn post published:', linkedinResult);

    // Update post status in database
    const { data: updatedPost, error: updateError } = await supabaseClient
      .from('automated_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        content: content, // Update with final content
      })
      .eq('id', postId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ 
      success: true,
      post: updatedPost,
      linkedinPostId: linkedinResult.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error publishing post:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
