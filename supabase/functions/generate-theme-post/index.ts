import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://deno.land/x/openai@v4.52.7/mod.ts';

interface ThemeInputDataFromClient {
  title: string;
  description: string;
  category: string;
  audience: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives?: string[];
  post_types?: string[];
  results?: { revenue?: string; cac?: string; churn?: string };
  details?: {
    background?: string;
    purpose?: string;
    mainTopic?: string;
    targetAudience?: string;
    complexityLevel?: string; // This is from multi-select complexity options
  };
  background_explanation?: string;
  purpose_explanation?: string;
  main_topic_explanation?: string;
  target_audience_explanation?: string;
  complexity_explanation?: string;
  user_id: string; // ID of the user creating the theme
}

// Interface for the structure in the 'themes' table
interface ThemeRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  audience: string;
  complexity: string;
  objectives: string[];
  post_types: string[];
  results: any;
  details: any;
  is_custom: boolean;
  created_by: string;
  background_explanation?: string;
  purpose_explanation?: string;
  main_topic_explanation?: string;
  target_audience_explanation?: string;
  complexity_explanation?: string;
  sample_posts?: string[];
  created_at: string;
  updated_at: string;
}


// Standard CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const themeInput: ThemeInputDataFromClient = requestBody.themeData;

    if (!themeInput || !themeInput.user_id || !themeInput.title) {
      return new Response(JSON.stringify({ error: 'Missing themeData, user_id, or title in request body' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      console.error('Missing OPENAI_API_KEY');
      throw new Error('Server configuration error: Missing OpenAI API Key.');
    }
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Server configuration error: Missing Supabase credentials.');
    }

    const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const themeToInsert = {
      title: themeInput.title,
      description: themeInput.description || '',
      category: themeInput.category || 'General',
      audience: themeInput.audience || '',
      complexity: themeInput.complexity || 'Intermediate',
      objectives: themeInput.objectives || [],
      post_types: themeInput.post_types || themeInput.objectives || [], // Default post_types to objectives if not provided
      results: themeInput.results || { revenue: 'N/A', cac: 'N/A', churn: 'N/A' },
      details: themeInput.details || {},
      is_custom: true,
      created_by: themeInput.user_id,
      background_explanation: themeInput.background_explanation || '',
      purpose_explanation: themeInput.purpose_explanation || '',
      main_topic_explanation: themeInput.main_topic_explanation || '',
      target_audience_explanation: themeInput.target_audience_explanation || '',
      complexity_explanation: themeInput.complexity_explanation || '',
      sample_posts: [], // Initialize as empty, will be updated
    };

    const { data: newThemeUntyped, error: insertError } = await supabaseAdmin
      .from('themes')
      .insert(themeToInsert)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting theme:', insertError);
      throw new Error(`Database error creating theme: ${insertError.message}`);
    }
    if (!newThemeUntyped) {
      throw new Error('Theme creation failed or returned no data.');
    }
    
    const newTheme = newThemeUntyped as ThemeRecord;

    let prompt = `Generate an engaging LinkedIn post of 500-700 words based on the following theme details. The post should be well-structured, informative, and tailored for a professional audience on LinkedIn.\n\nTheme Details:\n`;
    prompt += `Title: ${newTheme.title}\n`;
    prompt += `Description: ${newTheme.description}\n`;
    prompt += `Category: ${newTheme.category}\n`;
    prompt += `Target Audience: ${newTheme.audience}\n`;
    if (newTheme.complexity) prompt += `Overall Complexity: ${newTheme.complexity}\n`;
    if (newTheme.details?.complexityLevel) prompt += `Specific Complexity Aspects: ${newTheme.details.complexityLevel}\n`;
    if (newTheme.objectives && newTheme.objectives.length > 0) prompt += `Objectives: ${newTheme.objectives.join(', ')}\n`;
    if (newTheme.post_types && newTheme.post_types.length > 0) prompt += `Suggested Post Types: ${newTheme.post_types.join(', ')}\n`;

    if (newTheme.details) {
      prompt += `\nFurther Details:\n`;
      if (newTheme.details.background) prompt += `- Background/Offering: ${newTheme.details.background}\n`;
      if (newTheme.details.purpose) prompt += `- Purpose: ${newTheme.details.purpose}\n`;
      if (newTheme.details.mainTopic) prompt += `- Main Topic: ${newTheme.details.mainTopic}\n`;
      if (newTheme.details.targetAudience) prompt += `- Specific Target Audience Aspects: ${newTheme.details.targetAudience}\n`;
    }
    if (newTheme.results) {
        prompt += `Expected Results: Revenue ${newTheme.results.revenue || 'N/A'}, CAC ${newTheme.results.cac || 'N/A'}, Churn ${newTheme.results.churn || 'N/A'}\n`;
    }
    if (newTheme.background_explanation) prompt += `Background Explanation: ${newTheme.background_explanation}\n`;
    if (newTheme.purpose_explanation) prompt += `Purpose Explanation: ${newTheme.purpose_explanation}\n`;
    if (newTheme.main_topic_explanation) prompt += `Main Topic Explanation: ${newTheme.main_topic_explanation}\n`;
    if (newTheme.target_audience_explanation) prompt += `Target Audience Explanation: ${newTheme.target_audience_explanation}\n`;
    if (newTheme.complexity_explanation) prompt += `Complexity Explanation: ${newTheme.complexity_explanation}\n`;

    prompt += `\nPlease ensure the post is between 500 and 700 words and suitable for LinkedIn.`;

    const openai = new OpenAI({ apiKey: openAIApiKey });
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo-0125', // Using a specific version for potentially better consistency
    });

    const generatedPostContent = chatCompletion.choices[0]?.message?.content;

    if (!generatedPostContent) {
      // Theme was created, but post generation failed.
      console.warn(`Theme ${newTheme.id} created, but sample post generation failed.`);
      return new Response(
        JSON.stringify({
          message: 'Theme created, but sample post generation failed.',
          theme: newTheme,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 207 } // Multi-Status
      );
    }
    
    const samplePostsArray = [generatedPostContent.trim()];

    const { error: updateError } = await supabaseAdmin
      .from('themes')
      .update({ sample_posts: samplePostsArray })
      .eq('id', newTheme.id);

    if (updateError) {
      console.error(`Error updating theme ${newTheme.id} with sample post:`, updateError);
      return new Response(
        JSON.stringify({
          message: 'Theme created and post generated, but failed to update theme with sample post.',
          theme: newTheme,
          generatedPost: samplePostsArray,
          updateError: updateError.message,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 207 } // Multi-Status
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Theme created and sample post generated and saved successfully!',
        themeId: newTheme.id,
        samplePosts: samplePostsArray,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: (error instanceof Error && 'status' in error) ? (error as any).status : 500,
      }
    );
  }
}) 