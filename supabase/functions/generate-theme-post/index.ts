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

    // --- Add to user_themes table ---
    const { error: userThemeInsertError } = await supabaseAdmin
      .from('user_themes')
      .insert({ 
        user_id: newTheme.created_by, // This comes from themeInput.user_id initially
        theme_id: newTheme.id 
      });

    if (userThemeInsertError) {
      // Log the error, but don't let it block the rest of the process if the main theme was created.
      // The user might just not see it immediately in "My Themes" but it exists.
      // Alternatively, you could choose to throw an error here if this link is critical.
      console.error(`Error inserting into user_themes for theme ${newTheme.id} and user ${newTheme.created_by}:`, userThemeInsertError);
      // Potentially return a specific status or message indicating partial success
    }

    // --- First OpenAI Call: Generate LinkedIn Post ---
    let postGenerationPrompt = `Generate an engaging LinkedIn post of 500-700 words based on the following theme details. The post should be well-structured, informative, and tailored for a professional audience on LinkedIn.\n\nTheme Details:\n`;
    postGenerationPrompt += `Title: ${newTheme.title}\n`;
    postGenerationPrompt += `Description: ${newTheme.description}\n`;
    postGenerationPrompt += `Category: ${newTheme.category}\n`;
    postGenerationPrompt += `Target Audience: ${newTheme.audience}\n`;
    if (newTheme.complexity) postGenerationPrompt += `Overall Complexity: ${newTheme.complexity}\n`;
    if (newTheme.details?.complexityLevel) postGenerationPrompt += `Specific Complexity Aspects: ${newTheme.details.complexityLevel}\n`;
    if (newTheme.objectives && newTheme.objectives.length > 0) postGenerationPrompt += `Objectives: ${newTheme.objectives.join(', ')}\n`;
    if (newTheme.post_types && newTheme.post_types.length > 0) postGenerationPrompt += `Suggested Post Types: ${newTheme.post_types.join(', ')}\n`;

    if (newTheme.details) {
      postGenerationPrompt += `\nFurther Details:\n`;
      if (newTheme.details.background) postGenerationPrompt += `- Background/Offering: ${newTheme.details.background}\n`;
      if (newTheme.details.purpose) postGenerationPrompt += `- Purpose: ${newTheme.details.purpose}\n`;
      if (newTheme.details.mainTopic) postGenerationPrompt += `- Main Topic: ${newTheme.details.mainTopic}\n`;
      if (newTheme.details.targetAudience) postGenerationPrompt += `- Specific Target Audience Aspects: ${newTheme.details.targetAudience}\n`;
    }
    // Results are not included here as they are yet to be generated
    if (newTheme.background_explanation) postGenerationPrompt += `Background Explanation: ${newTheme.background_explanation}\n`;
    if (newTheme.purpose_explanation) postGenerationPrompt += `Purpose Explanation: ${newTheme.purpose_explanation}\n`;
    if (newTheme.main_topic_explanation) postGenerationPrompt += `Main Topic Explanation: ${newTheme.main_topic_explanation}\n`;
    if (newTheme.target_audience_explanation) postGenerationPrompt += `Target Audience Explanation: ${newTheme.target_audience_explanation}\n`;
    if (newTheme.complexity_explanation) postGenerationPrompt += `Complexity Explanation: ${newTheme.complexity_explanation}\n`;

    postGenerationPrompt += `\nPlease format the post with a blank line separating each paragraph. Ensure the post is between 500 and 700 words and suitable for LinkedIn.`;

    const openai = new OpenAI({ apiKey: openAIApiKey });
    const postChatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: postGenerationPrompt }],
      model: 'gpt-4',
    });

    const generatedPostContent = postChatCompletion.choices[0]?.message?.content;
    let samplePostsArray: string[] = [];

    if (!generatedPostContent) {
      console.warn(`Theme ${newTheme.id} created, but sample post generation failed.`);
      // Even if post generation fails, we proceed to generate results if possible,
      // but the sample_posts array will be empty.
    } else {
      samplePostsArray = [generatedPostContent.trim()];
      const { error: updateError } = await supabaseAdmin
        .from('themes')
        .update({ sample_posts: samplePostsArray })
        .eq('id', newTheme.id);

      if (updateError) {
        console.error(`Error updating theme ${newTheme.id} with sample post:`, updateError);
        // Log the error but continue to attempt generating results
      }
    }

    // --- Second OpenAI Call: Generate Expected Results ---
    let resultsPrompt = `Analyze the following LinkedIn marketing theme and its generated sample post. Based on this information, estimate the potential business impact.
Provide your answer ONLY as a single, valid JSON object. The JSON object must have the following string keys: "revenue", "cac", and "churn".
Example values for these keys are: "+5-10% quarterly increase", "Additional $5k MRR" for revenue; "-15% reduction", "Improved from $50 to $40" for cac; and "-2% monthly", "Reduced by 10%" for churn.
If you cannot reasonably estimate a metric, use "N/A" as the string value for that key.
Ensure the output is nothing but this single JSON object and nothing else before or after it.

Theme Details:
Title: ${newTheme.title}
Description: ${newTheme.description}
Category: ${newTheme.category}
Target Audience: ${newTheme.audience}
Complexity: ${newTheme.complexity}
Objectives: ${newTheme.objectives.join(', ')}
Post Types: ${newTheme.post_types.join(', ')}
`;
    if (newTheme.details?.background) resultsPrompt += `Background/Offering: ${newTheme.details.background}\n`;
    if (newTheme.details?.purpose) resultsPrompt += `Purpose: ${newTheme.details.purpose}\n`;
    if (newTheme.details?.mainTopic) resultsPrompt += `Main Topic: ${newTheme.details.mainTopic}\n`;

    resultsPrompt += `\nGenerated Sample Post Content:\n${generatedPostContent || "No post content was generated."}\n\nStrictly return ONLY the JSON object. For example: {"revenue": "N/A", "cac": "-5%", "churn": "N/A"}\nYour JSON Output:`;
    
    const resultsChatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: resultsPrompt }],
        model: 'gpt-4',
        // response_format: { type: "json_object" }, // Removed as it's not supported by this gpt-4 model version
    });

    let generatedResults = { revenue: 'N/A', cac: 'N/A', churn: 'N/A' };
    try {
      const resultsContent = resultsChatCompletion.choices[0]?.message?.content;
      if (resultsContent) {
        const parsedResults = JSON.parse(resultsContent);
        generatedResults = {
            revenue: parsedResults.revenue || 'N/A',
            cac: parsedResults.cac || 'N/A',
            churn: parsedResults.churn || 'N/A'
        };
      } else {
        console.warn(`Could not generate results for theme ${newTheme.id}. OpenAI response was empty.`);
      }
    } catch (e) {
      console.error(`Error parsing results JSON for theme ${newTheme.id}:`, e);
      // Keep default N/A values if parsing fails
    }

    const { error: finalUpdateError } = await supabaseAdmin
      .from('themes')
      .update({ results: generatedResults, sample_posts: samplePostsArray }) // Ensure sample_posts is also updated here
      .eq('id', newTheme.id);

    if (finalUpdateError) {
      console.error(`Error updating theme ${newTheme.id} with generated results:`, finalUpdateError);
      return new Response(
        JSON.stringify({
          message: 'Theme created, post and results generated, but failed to update theme with results.',
          themeId: newTheme.id,
          samplePosts: samplePostsArray,
          generatedResults,
          updateError: finalUpdateError.message,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 207 }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Theme created, sample post and results generated and saved successfully!',
        themeId: newTheme.id,
        samplePosts: samplePostsArray,
        results: generatedResults,
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