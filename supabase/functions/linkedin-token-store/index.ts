
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
    console.log('Request URL:', req.url);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
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
    console.log('Auth token received (first 20 chars):', token.substring(0, 20) + '...');
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Service key available:', !!supabaseServiceKey);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the JWT token and get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Invalid user token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid user token', details: userError?.message }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('User verified:', user.id);

    // Get the request body - check content-length first
    const contentLength = req.headers.get('content-length');
    console.log('Content-Length:', contentLength);
    
    if (!contentLength || contentLength === '0') {
      console.error('Empty request body - content-length is 0');
      return new Response(
        JSON.stringify({ error: 'Empty request body', received_headers: Object.fromEntries(req.headers.entries()) }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get request body as text first for debugging
    const bodyText = await req.text();
    console.log('Raw request body:', bodyText);
    console.log('Body length:', bodyText.length);
    
    if (!bodyText || bodyText.trim() === '') {
      console.error('Empty request body text');
      return new Response(
        JSON.stringify({ error: 'Empty request body text' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let requestBody;
    try {
      requestBody = JSON.parse(bodyText);
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('Failed to parse request body as JSON:', parseError);
      console.error('Body text was:', bodyText);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', bodyReceived: bodyText }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { code } = requestBody;
    
    if (!code) {
      console.error('Missing authorization code in request body');
      return new Response(
        JSON.stringify({ error: 'Missing authorization code', bodyReceived: requestBody }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Authorization code received (first 10 chars):', code.substring(0, 10) + '...');
    console.log('Exchanging code for access token');
    
    // LinkedIn credentials
    const linkedinClientId = Deno.env.get('LINKEDIN_CLIENT_ID') || '771girpp9fv439';
    const linkedinClientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET') || 'WPL_AP1.P66OnLQbXKWBBjfM.EqymLg==';
    
    console.log('LinkedIn Client ID:', linkedinClientId);
    console.log('LinkedIn Client Secret available:', !!linkedinClientSecret);
    
    // Exchange authorization code for access token
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://klarushr.com/linkedin-token-callback',
      client_id: linkedinClientId,
      client_secret: linkedinClientSecret,
    });

    console.log('Making token exchange request to LinkedIn...');
    console.log('Token request params:', {
      grant_type: 'authorization_code',
      redirect_uri: 'https://klarushr.com/linkedin-token-callback',
      client_id: linkedinClientId,
      code_length: code.length
    });

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: tokenRequestBody,
    });

    console.log('LinkedIn token response status:', tokenResponse.status);
    const tokenResponseText = await tokenResponse.text();
    console.log('LinkedIn token response body:', tokenResponseText);

    if (!tokenResponse.ok) {
      console.error('LinkedIn token exchange failed:', tokenResponseText);
      let errorMessage = 'Token exchange failed';
      
      try {
        const errorData = JSON.parse(tokenResponseText);
        if (errorData.error_description) {
          errorMessage = errorData.error_description;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        errorMessage = tokenResponseText;
      }
      
      return new Response(
        JSON.stringify({ error: 'LinkedIn token exchange failed', details: errorMessage }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const tokenData = JSON.parse(tokenResponseText);
    console.log('Token exchange successful, expires in:', tokenData.expires_in);

    // Get LinkedIn user profile using the correct API v2 endpoint
    console.log('Fetching LinkedIn profile with corrected API endpoint...');
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    });

    console.log('LinkedIn profile response status:', profileResponse.status);

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('Failed to fetch LinkedIn profile:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch LinkedIn profile', details: errorText }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const profileData = await profileResponse.json();
    const linkedinId = profileData.id;
    console.log('LinkedIn profile fetched successfully, ID:', linkedinId);

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
      JSON.stringify({ success: true, message: 'LinkedIn connected successfully' }),
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
