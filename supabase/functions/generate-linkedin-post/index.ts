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

    let rssContent = 'No recent RSS content available';
    try {
      const rssUrl = getRssFeedUrl(niche);
      console.log('[GLP] Attempting to fetch RSS from:', rssUrl);
      const rssResponse = await fetch(rssUrl, { signal: AbortSignal.timeout(5000) }); // 5s timeout
      if (!rssResponse.ok) {
        console.warn(`[GLP] RSS fetch failed with status: ${rssResponse.status}. URL: ${rssUrl}`);
      } else {
        const rssText = await rssResponse.text();
        const articles = parseRssContent(rssText);
        rssContent = articles.slice(0, 1).map(article => `Title: ${article.title}\nSummary: ${article.description}`).join('\n\n');
        console.log('[GLP] RSS content fetched and parsed successfully.');
      }
    } catch (error) {
      console.warn('[GLP] RSS fetch/parse error, continuing without RSS content:', error.message);
    }

    const imagePromptGeneration = `Create a professional, simple image description for a LinkedIn post about ${niche}. Content theme: ${contentPrompt}. Tone: ${tone}. Generate a concise image prompt (max 80 characters) for a clean, professional business image suitable for LinkedIn. Focus on: professional business imagery, clean, modern aesthetics, relevant to ${niche}, simple and clear. Return ONLY the image prompt, nothing else.`;
    console.log('[GLP] Generating image prompt for DALL-E...');
    let imagePrompt = 'A generic professional business image related to ' + niche;
    try {
      const imagePromptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${openAIApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: imagePromptGeneration }], max_tokens: 80, temperature: 0.7 }),
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      if (!imagePromptResponse.ok) {
        const errorBody = await imagePromptResponse.text();
        console.error('[GLP] OpenAI image prompt generation failed.', { status: imagePromptResponse.status, body: errorBody });
        // Fallback to generic prompt, do not fail the whole function yet
      } else {
        const imagePromptData = await imagePromptResponse.json();
        if (imagePromptData.choices && imagePromptData.choices[0] && imagePromptData.choices[0].message) {
          imagePrompt = imagePromptData.choices[0].message.content.trim();
          console.log('[GLP] Generated DALL-E image prompt:', imagePrompt);
        } else {
          console.warn('[GLP] OpenAI image prompt response was OK, but content is missing. Using fallback.', imagePromptData);
        }
      }
    } catch (e) {
      console.error('[GLP] Error during OpenAI image prompt generation fetch:', e.message);
      // Fallback already set
    }

    let imageUrl = null;
    let mediaUrn = null;
    if (!scheduleDate) { // Only generate/upload image if not scheduling (LinkedIn API limitation for direct image scheduling)
      console.log('[GLP] Generating image with DALL-E using prompt:', imagePrompt);
      try {
        const imageGenResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${openAIApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'dall-e-3', prompt: `Professional business image: ${imagePrompt}. Clean, modern, high-quality business photography style.`, n: 1, size: '1024x1024', quality: 'standard', style: 'natural' }),
          signal: AbortSignal.timeout(30000) // 30s timeout for DALL-E
        });
        if (!imageGenResponse.ok) {
          const errorBody = await imageGenResponse.text();
          console.error('[GLP] DALL-E image generation failed.', { status: imageGenResponse.status, body: errorBody });
          // Continue without an image
        } else {
          const imageData = await imageGenResponse.json();
          if (imageData.data && imageData.data[0] && imageData.data[0].url) {
            imageUrl = imageData.data[0].url;
            console.log('[GLP] DALL-E Image generated successfully:', imageUrl);

            // THIS ENTIRE BLOCK (register, download, upload) should only run if imageUrl is valid
            if (imageUrl) { 
              console.log('[GLP] Attempting to register image upload with LinkedIn.');
              const registerUploadResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${linkedinTokenData.access_token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ registerUploadRequest: { recipes: ['urn:li:digitalmediaRecipe:feedshare-image'], owner: `urn:li:person:${linkedinTokenData.linkedin_id}`, serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }] } }),
                signal: AbortSignal.timeout(10000) // 10s timeout
              });
              if (!registerUploadResponse.ok) {
                const errorBodyText = await registerUploadResponse.text();
                console.error('[GLP] LinkedIn image upload registration failed.', { status: registerUploadResponse.status, body: errorBodyText });
                
                let linkedInErrorDetails: any = null;
                try {
                  linkedInErrorDetails = JSON.parse(errorBodyText);
                } catch (parseError) {
                  console.warn('[GLP] Could not parse LinkedIn error body (image registration) as JSON:', parseError.message);
                }

                if (registerUploadResponse.status === 401 && linkedInErrorDetails && 
                    (linkedInErrorDetails.serviceErrorCode === 65601 || linkedInErrorDetails.code === 'REVOKED_ACCESS_TOKEN')) {
                  console.error('[GLP] LinkedIn token revoked during image registration.', { details: linkedInErrorDetails });
                  return new Response(JSON.stringify({ 
                    error: 'LINKEDIN_TOKEN_REVOKED', 
                    message: linkedInErrorDetails.message || 'The LinkedIn token has been revoked. Please re-authenticate your LinkedIn account.' 
                  }), {
                    status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                  });
                }
                console.warn('[GLP] Image registration failed (not a token revocation error), proceeding without image.');
                imageUrl = null; // Ensure imageUrl is null if registration fails and we proceed
              } else {
                const uploadData = await registerUploadResponse.json();
                const uploadUrl = uploadData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
                const asset = uploadData.value.asset; // This is the mediaUrn
                console.log('[GLP] LinkedIn image upload registered. Asset URN:', asset, 'Upload URL:', uploadUrl);

                console.log('[GLP] Downloading image from DALL-E URL:', imageUrl);
                const imageDownloadResponse = await fetch(imageUrl, { signal: AbortSignal.timeout(15000) }); // 15s timeout
                if (!imageDownloadResponse.ok) {
                  console.error('[GLP] Failed to download generated image from DALL-E URL.', { status: imageDownloadResponse.status });
                  // Continue without image
                } else {
                  const imageBlob = await imageDownloadResponse.arrayBuffer();
                  console.log('[GLP] Image downloaded from DALL-E. Size:', imageBlob.byteLength);

                  console.log('[GLP] Uploading image to LinkedIn provided URL.');
                  const uploadImageResponse = await fetch(uploadUrl, {
                    method: 'PUT', // Changed from POST to PUT as per typical LinkedIn upload examples
                    headers: { 'Authorization': `Bearer ${linkedinTokenData.access_token}`, 'Content-Type': 'application/octet-stream' }, // Content-Type for binary
                    body: imageBlob,
                    signal: AbortSignal.timeout(30000) // 30s timeout
                  });
                  if (!uploadImageResponse.ok) {
                    const errorBodyText = await uploadImageResponse.text();
                    console.error('[GLP] LinkedIn image upload to provided URL failed.', { status: uploadImageResponse.status, body: errorBodyText });
                    
                    let linkedInErrorDetails: any = null;
                    try {
                      linkedInErrorDetails = JSON.parse(errorBodyText);
                    } catch (parseError) {
                      console.warn('[GLP] Could not parse LinkedIn error body (image upload) as JSON:', parseError.message);
                    }

                    if (uploadImageResponse.status === 401 && linkedInErrorDetails && 
                        (linkedInErrorDetails.serviceErrorCode === 65601 || linkedInErrorDetails.code === 'REVOKED_ACCESS_TOKEN')) {
                      console.error('[GLP] LinkedIn token revoked during image binary upload.', { details: linkedInErrorDetails });
                      return new Response(JSON.stringify({ 
                        error: 'LINKEDIN_TOKEN_REVOKED', 
                        message: linkedInErrorDetails.message || 'The LinkedIn token has been revoked. Please re-authenticate your LinkedIn account.' 
                      }), {
                        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                      });
                    }
                    console.warn('[GLP] Image binary upload failed (not a token revocation error), proceeding without image. Media URN will be null.');
                  } else {
                    mediaUrn = asset;
                    console.log('[GLP] Image successfully uploaded to LinkedIn. Media URN:', mediaUrn);
                  }
                }
              }
            } else {
              console.warn('[GLP] Skipping LinkedIn image registration and upload because imageUrl is null.');
              // Ensure mediaUrn is also null if imageUrl was null and we skipped this block
              mediaUrn = null; 
            }
          } else {
            console.warn('[GLP] DALL-E response OK, but image URL missing.', imageData);
            imageUrl = null; // Ensure imageUrl is null
            mediaUrn = null; // Ensure mediaUrn is null
          }
        }
      } catch (e) {
        console.error('[GLP] Error during DALL-E image generation or LinkedIn upload process:', e.message);
        imageUrl = null; // Ensure imageUrl is null on error
        mediaUrn = null; // Ensure mediaUrn is null on error
        // Continue without image
      }
    } else {
      console.log('[GLP] Post is scheduled, skipping live image generation and upload.');
    }

    console.log('[GLP] Generating final post content with OpenAI...');
    const postContentPrompt = `You are an expert LinkedIn post writer. Rewrite the following content to be engaging and professional for LinkedIn, incorporating the specified tone. The post should be well-structured. If RSS content is provided, weave it in naturally. 

    Original Content Prompt: ${contentPrompt}
    Tone: ${tone}
    Niche: ${niche}
    Recent RSS Content from niche (use if relevant, otherwise ignore):
    ${rssContent}

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
        media_urn: mediaUrn, // Will be null if image failed or not generated
        image_url: imageUrl, // Store original DALL-E URL for reference, can be null
        scheduled_at_utc: `${scheduleDate}T${scheduleTime}:00Z`, // Assuming scheduleTime is HH:MM
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
      return new Response(JSON.stringify({ message: 'Post scheduled successfully', content: finalPostText, imageUrl, mediaUrn }), {
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
            shareMediaCategory: mediaUrn ? 'IMAGE' : 'NONE',
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      };
      if (mediaUrn) {
        postPayload.specificContent['com.linkedin.ugc.ShareContent'].media = [
          { status: 'READY', media: mediaUrn },
        ];
      }
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
      return new Response(JSON.stringify({ message: 'Post created successfully on LinkedIn!', content: finalPostText, linkedinPostId: postResponseData.id, imageUrl, mediaUrn }), {
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

// Helper function to get RSS feed URL based on niche (simplified)
function getRssFeedUrl(niche: string): string {
  console.log(`[GLP_helper] getRssFeedUrl called for niche: ${niche}`);
  // This is a placeholder. Replace with actual logic to map niches to RSS URLs.
  const nicheToUrlMap: Record<string, string> = {
    'Technology': 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    'AI': 'http://feeds.bbci.co.uk/news/technology/rss.xml',
    'Software Development': 'https://www.infoworld.com/category/development/index.rss',
    // Add more mappings as needed
  };
  const normalizedNiche = niche.trim();
  for (const key in nicheToUrlMap) {
    if (normalizedNiche.toLowerCase().includes(key.toLowerCase())) {
      console.log(`[GLP_helper] Matched niche '${normalizedNiche}' to RSS URL: ${nicheToUrlMap[key]}`);
      return nicheToUrlMap[key];
    }
  }
  console.warn(`[GLP_helper] No RSS feed URL found for niche: ${normalizedNiche}. Defaulting.`);
  return 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'; // Default or error
}

// Helper function to parse RSS content (simplified, needs robust error handling)
function parseRssContent(rssText: string): Array<{title: string, description: string}> {
  console.log('[GLP_helper] parseRssContent called.');
  const articles: Array<{title: string, description: string}> = [];
  try {
    const itemMatches = rssText.matchAll(/<item>(.*?)<\/item>/gs);
    for (const itemMatch of itemMatches) {
      const itemContent = itemMatch[1];
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s);
      const descriptionMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s);
      const title = titleMatch ? titleMatch[1].trim() : (itemContent.match(/<title>(.*?)<\/title>/s)?.[1] || 'No title').trim();
      const description = descriptionMatch ? descriptionMatch[1].trim() : (itemContent.match(/<description>(.*?)<\/description>/s)?.[1] || 'No description').trim();
      articles.push({ title, description });
      if (articles.length >= 3) break; // Limit to 3 articles for brevity in prompt
    }
  } catch (e) {
    console.error('[GLP_helper] Error parsing RSS content:', e.message);
    // Return empty or partial articles
  }
  console.log(`[GLP_helper] Parsed ${articles.length} articles from RSS.`);
  return articles;
}
