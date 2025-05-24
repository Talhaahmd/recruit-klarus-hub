
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
    console.log('LinkedIn token store function called');
    console.log('Request method:', req.method);
    
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
    console.log('Auth token received');
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
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

    // Get the request body
    const requestBody = await req.json();
    const { code } = requestBody;
    
    if (!code) {
      console.error('Missing authorization code in request body');
      return new Response(
        JSON.stringify({ error: 'Missing authorization code' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Authorization code received, exchanging for access token...');
    
    // LinkedIn credentials
    const linkedinClientId = Deno.env.get('LINKEDIN_CLIENT_ID') || '771girpp9fv439';
    const linkedinClientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET') || 'WPL_AP1.P66OnLQbXKWBBjfM.EqymLg==';
    
    // Exchange authorization code for access token
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://klarushr.com/linkedin-token-callback',
      client_id: linkedinClientId,
      client_secret: linkedinClientSecret,
    });

    console.log('Making token exchange request to LinkedIn...');

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: tokenRequestBody,
    });

    console.log('LinkedIn token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('LinkedIn token exchange failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'LinkedIn token exchange failed', details: errorText }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange successful, expires in:', tokenData.expires_in);

    // Get LinkedIn profile to get the proper member ID
    let linkedinId = null;
    try {
      console.log('Fetching LinkedIn profile...');
      const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        linkedinId = profile.sub; // This is the proper LinkedIn member ID
        console.log('LinkedIn profile fetched, member ID:', linkedinId);
      } else {
        console.warn('Failed to fetch LinkedIn profile, using fallback ID');
        linkedinId = `member_${user.id}_${Date.now()}`;
      }
    } catch (profileError) {
      console.warn('Error fetching LinkedIn profile:', profileError);
      linkedinId = `member_${user.id}_${Date.now()}`;
    }

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString();
    console.log('Token expires at:', expiresAt);

    // Store the token in the database
    console.log('Storing LinkedIn token in database...');
    const { error: insertError } = await supabase
      .from('linkedin_tokens')
      .upsert(
        {
          user_id: user.id,
          linkedin_id: linkedinId,
          access_token: tokenData.access_token,
          expires_at: expiresAt,
        },
        {
          onConflict: 'user_id',
        }
      );

    if (insertError) {
      console.error('Failed to store LinkedIn token:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store token', details: insertError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('LinkedIn token stored successfully for user:', user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'LinkedIn connected successfully',
        linkedin_id: linkedinId 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in LinkedIn token store function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
