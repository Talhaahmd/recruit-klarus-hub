
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
    console.log('Generate LinkedIn post function called');
    
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

    // Get the request data
    const { niche, tone, contentPrompt, scheduleDate, scheduleTime } = await req.json();
    
    if (!niche || !tone || !contentPrompt) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: niche, tone, and contentPrompt are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Generating LinkedIn post for niche:', niche, 'tone:', tone);

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

    console.log('LinkedIn token valid, fetching RSS content...');

    // Fetch RSS feed content based on niche
    let rssContent = '';
    try {
      const rssUrl = getRssFeedUrl(niche);
      console.log('Fetching RSS from:', rssUrl);
      
      const rssResponse = await fetch(rssUrl);
      const rssText = await rssResponse.text();
      
      // Parse RSS and extract recent articles
      const articles = parseRssContent(rssText);
      rssContent = articles.slice(0, 3).map(article => 
        `Title: ${article.title}\nSummary: ${article.description}`
      ).join('\n\n');
      
      console.log('RSS content fetched successfully');
    } catch (error) {
      console.warn('RSS fetch failed, continuing without RSS content:', error);
      rssContent = 'No recent RSS content available';
    }

    // Generate image prompt based on niche
    const imagePrompt = `Professional ${niche.toLowerCase()} themed image for LinkedIn post, modern, clean, business-oriented`;
    console.log('Generating image with prompt:', imagePrompt);

    // Generate image using DALL-E
    let imageUrl = '';
    try {
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: imagePrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        imageUrl = imageData.data[0].url;
        console.log('Image generated successfully');
      } else {
        console.warn('Image generation failed, continuing without image');
      }
    } catch (error) {
      console.warn('Image generation error:', error);
    }

    // Generate LinkedIn post content using ChatGPT
    const postPrompt = `Create a professional LinkedIn post based on the following requirements:

Niche: ${niche}
Tone: ${tone}
User's content idea: ${contentPrompt}

Recent industry content for reference:
${rssContent}

Requirements:
- Write a ${tone.toLowerCase()} LinkedIn post about ${niche}
- Keep it between 500-700 words
- Include relevant hashtags (3-5)
- Make it engaging and shareable
- Incorporate insights from the recent industry content if relevant
- Match the ${tone.toLowerCase()} tone throughout
- Include a call to action
- Structure it with line breaks for readability

The post should feel authentic and provide value to the LinkedIn audience.`;

    console.log('Generating post content with ChatGPT...');

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
            content: 'You are a professional LinkedIn content creator who creates engaging, valuable posts that resonate with professional audiences. Always maintain the specified tone and include relevant hashtags.' 
          },
          { role: 'user', content: postPrompt }
        ],
        max_tokens: 1000,
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
    const generatedContent = openAIData.choices[0].message.content;
    
    console.log('Generated post content successfully');

    // If it's a scheduled post, save to database and return
    if (scheduleDate) {
      console.log('Saving scheduled post to database...');
      
      const { data: savedPost, error: saveError } = await supabase
        .from('linkedin_posts')
        .insert({
          content: generatedContent,
          scheduled_date: scheduleDate,
          scheduled_time: scheduleTime,
          niche: niche,
          tone: tone,
          posted: false,
          user_id: user.id,
          created_by: user.id
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving scheduled post:', saveError);
        return new Response(
          JSON.stringify({ error: 'Failed to save scheduled post' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Post scheduled successfully',
          content: generatedContent,
          imageUrl: imageUrl,
          scheduled: true,
          postId: savedPost.id
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Post immediately to LinkedIn
    console.log('Posting to LinkedIn...');

    // Prepare LinkedIn post data
    const linkedinPostData = {
      author: `urn:li:person:${linkedinToken.linkedin_id}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: generatedContent
          },
          shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
          ...(imageUrl && {
            media: [{
              status: 'READY',
              description: {
                text: 'Generated image for LinkedIn post'
              },
              media: imageUrl,
              title: {
                text: `${niche} Post`
              }
            }]
          })
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

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
      
      let errorMessage = 'Failed to post to LinkedIn';
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.serviceErrorCode === 65601 || errorData.code === 'REVOKED_ACCESS_TOKEN') {
          errorMessage = 'LinkedIn token expired. Please reconnect your LinkedIn account.';
        } else if (errorData.message) {
          errorMessage = `LinkedIn error: ${errorData.message}`;
        }
      } catch (parseError) {
        console.error('Error parsing LinkedIn response:', parseError);
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const linkedinResult = await linkedinResponse.json();
    console.log('LinkedIn post successful:', linkedinResult.id);

    // Save the posted content to database
    const { error: postSaveError } = await supabase
      .from('linkedin_posts')
      .insert({
        content: generatedContent,
        posted: true,
        niche: niche,
        tone: tone,
        user_id: user.id,
        created_by: user.id
      });

    if (postSaveError) {
      console.error('Failed to save post record:', postSaveError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Post created and posted to LinkedIn successfully',
        content: generatedContent,
        imageUrl: imageUrl,
        linkedinPostId: linkedinResult.id,
        posted: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate LinkedIn post function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to get RSS feed URL based on niche
function getRssFeedUrl(niche: string): string {
  const rssFeeds: Record<string, string> = {
    'Career Advice': 'https://feeds.feedburner.com/careerdevelopment',
    'Industry Trends': 'https://feeds.feedburner.com/TechCrunch',
    'Company Culture': 'https://feeds.feedburner.com/workplace',
    'Leadership': 'https://feeds.feedburner.com/leadership',
    'Technology': 'https://feeds.feedburner.com/TechCrunch',
    'Recruitment': 'https://feeds.feedburner.com/recruiting',
    'Professional Development': 'https://feeds.feedburner.com/professionaldevelopment'
  };
  
  return rssFeeds[niche] || 'https://feeds.feedburner.com/TechCrunch';
}

// Helper function to parse RSS content
function parseRssContent(rssText: string): Array<{title: string, description: string}> {
  const articles: Array<{title: string, description: string}> = [];
  
  try {
    // Simple regex-based RSS parsing
    const itemMatches = rssText.match(/<item[^>]*>[\s\S]*?<\/item>/gi);
    
    if (itemMatches) {
      for (const item of itemMatches.slice(0, 5)) {
        const titleMatch = item.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i);
        const descMatch = item.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i);
        
        if (titleMatch && descMatch) {
          const title = (titleMatch[1] || titleMatch[2] || '').trim();
          const description = (descMatch[1] || descMatch[2] || '').trim();
          
          if (title && description) {
            articles.push({
              title: title.substring(0, 150),
              description: description.substring(0, 300)
            });
          }
        }
      }
    }
  } catch (error) {
    console.warn('RSS parsing error:', error);
  }
  
  return articles;
}
