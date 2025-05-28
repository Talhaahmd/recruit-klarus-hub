import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { OpenAI } from "https://deno.land/x/openai/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Ensure these environment variables are set in your Supabase project settings
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { themeId, tone, userInput } = await req.json();

    if (!themeId || !tone) {
      return new Response(JSON.stringify({ error: 'Missing themeId or tone' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing API keys or URL.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const openai = new OpenAI(OPENAI_API_KEY);
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch theme's sample post
    const { data: themeData, error: themeError } = await supabaseAdmin
      .from('themes')
      .select('sample_posts, title')
      .eq('id', themeId)
      .single();

    if (themeError || !themeData) {
      console.error('Theme fetch error:', themeError?.message || 'Theme not found.');
      return new Response(JSON.stringify({ error: 'Failed to fetch theme details. Please ensure the theme exists.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    let samplePost = "No sample post available for this theme. Please ensure the theme has sample posts defined.";
    if (themeData.sample_posts && Array.isArray(themeData.sample_posts) && themeData.sample_posts.length > 0 && typeof themeData.sample_posts[0] === 'string' && themeData.sample_posts[0].trim() !== '') {
      samplePost = themeData.sample_posts[0];
    } else {
      console.warn(`No valid sample_posts found for theme ID ${themeId}. Using a generic instruction for style guidance.`);
      // Fallback if samplePost is not good, though the prompt might be less effective
      samplePost = "A well-structured and engaging LinkedIn post."
    }
    
    // 2. Construct OpenAI Prompt
    const promptMessages = [
      {
        role: "system",
        content: "You are an expert LinkedIn post writer. Your goal is to generate a new LinkedIn post draft. It must closely follow the format, spacing, style, and writing technique of the provided sample post. The new post should have the specified tone. If the user provides initial ideas/content, use those as the core message, integrated naturally into the sample's style and the requested tone. Only output the generated post content itself, without any preambles, apologies, or self-references."
      },
      {
        role: "user",
        content: `
Sample LinkedIn Post (for style, format, spacing, and writing technique reference):
---
${samplePost}
---

Tone to apply for the new post: ${tone}

${userInput && userInput.trim() !== '' ? `User's initial ideas/content to incorporate:
---
${userInput}
---
` : "No specific user ideas provided. Generate a relevant post based on the sample's implicit theme and the requested tone."}

Generate the new LinkedIn post draft now. Ensure it is ready for direct use on LinkedIn.
        `
      }
    ];

    // 3. Call OpenAI
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0125", // Consider "gpt-4" or other models based on availability and preference
      messages: promptMessages,
      temperature: 0.7, 
      max_tokens: 700, 
      n: 1,
    });

    const draftContent = chatCompletion.choices?.[0]?.message?.content?.trim();

    if (!draftContent) {
      console.error('OpenAI did not return draft content.');
      return new Response(JSON.stringify({ error: 'Failed to generate draft from AI. The AI returned no content.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ draftContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in generate-draft-linkedin-post function:', error.message);
    return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 