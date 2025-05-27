import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  action: 'generate_ideas' | 'generate_post' | 'regenerate_post' | 'generate_sample_posts';
  themeId?: string;
  postId?: string;
  additionalContent?: string;
  customization?: any;
  themeData?: any;
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

    const { action, themeId, postId, additionalContent, customization, themeData }: RequestBody = await req.json();

    console.log(`Processing ${action} for user ${user.id}`);

    if (action === 'generate_sample_posts') {
      // Generate 2 sample posts for custom theme using OpenAI
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = `Create 2 sample LinkedIn posts (500-700 words each) based on this custom theme:

Theme: ${themeData.title}
Category: ${themeData.category}
Description: ${themeData.description}
Target Audience: ${themeData.audience}
Objectives: ${themeData.objectives?.join(', ')}

Generate 2 distinct, engaging LinkedIn posts that would be typical for this theme. Each post should be between 500-700 words and showcase the style and content approach of this theme. Make them professional, engaging, and valuable to the target audience.

Format: Return just the two posts separated by "---POST_SEPARATOR---"`;

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      const openaiData = await openaiResponse.json();
      const generatedContent = openaiData.choices[0]?.message?.content;

      if (!generatedContent) {
        throw new Error('Failed to generate sample posts');
      }

      const posts = generatedContent.split('---POST_SEPARATOR---').map((post: string) => post.trim()).filter((post: string) => post.length > 0);

      return new Response(JSON.stringify({ posts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'generate_ideas') {
      // Generate post ideas based on theme
      const { data: theme } = await supabaseClient
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();

      if (!theme) {
        throw new Error('Theme not found');
      }

      // Mock RSS feed data - in real implementation, you'd fetch from actual RSS feeds
      const mockIdeas = [
        {
          title: `${theme.category}: Latest Industry Trends`,
          description: `Explore the newest developments in ${theme.category.toLowerCase()}`,
          category: theme.category,
          filter_tags: ['trending', 'industry'],
          rss_source: 'industry-news-feed'
        },
        {
          title: `${theme.audience} Success Stories`,
          description: `Real-world examples of ${theme.audience.toLowerCase()} achieving results`,
          category: theme.category,
          filter_tags: ['success', 'case-study'],
          rss_source: 'success-stories-feed'
        }
      ];

      // Insert ideas into database
      const { data: ideas, error: ideasError } = await supabaseClient
        .from('post_ideas')
        .insert(
          mockIdeas.map(idea => ({
            user_id: user.id,
            theme_id: themeId,
            ...idea
          }))
        )
        .select();

      if (ideasError) throw ideasError;

      return new Response(JSON.stringify({ ideas }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'generate_post') {
      // Generate post content using OpenAI
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const { data: theme } = await supabaseClient
        .from('themes')
        .select('*')
        .eq('id', themeId)
        .single();

      const { data: userTheme } = await supabaseClient
        .from('user_themes')
        .select('customization')
        .eq('user_id', user.id)
        .eq('theme_id', themeId)
        .single();

      // Create prompt based on theme and customization
      const prompt = `Create a LinkedIn post based on:
Theme: ${theme.title}
Category: ${theme.category}
Description: ${theme.description}
Target Audience: ${theme.audience}
${customization ? `Customization: ${JSON.stringify(customization)}` : ''}
${additionalContent ? `Additional Content: ${additionalContent}` : ''}

Write an engaging LinkedIn post that would resonate with the target audience and achieve the theme's objectives.`;

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      const openaiData = await openaiResponse.json();
      const generatedContent = openaiData.choices[0]?.message?.content;

      if (!generatedContent) {
        throw new Error('Failed to generate content');
      }

      // Create or update automated post
      const postData = {
        user_id: user.id,
        theme_id: themeId,
        title: `Generated post for ${theme.title}`,
        content: generatedContent,
        additional_content: additionalContent || null,
        status: 'reviewing',
      };

      const { data: post, error: postError } = postId 
        ? await supabaseClient
            .from('automated_posts')
            .update(postData)
            .eq('id', postId)
            .eq('user_id', user.id)
            .select()
            .single()
        : await supabaseClient
            .from('automated_posts')
            .insert(postData)
            .select()
            .single();

      if (postError) throw postError;

      return new Response(JSON.stringify({ post }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'regenerate_post') {
      if (!postId) {
        throw new Error('Post ID required for regeneration');
      }

      // Check regeneration limit
      const { data: existingPost } = await supabaseClient
        .from('automated_posts')
        .select('regeneration_count, max_regenerations')
        .eq('id', postId)
        .eq('user_id', user.id)
        .single();

      if (!existingPost) {
        throw new Error('Post not found');
      }

      if (existingPost.regeneration_count >= existingPost.max_regenerations) {
        throw new Error('Maximum regenerations reached');
      }

      // Increment regeneration count and generate new content
      const { data: updatedPost, error: updateError } = await supabaseClient
        .from('automated_posts')
        .update({
          regeneration_count: existingPost.regeneration_count + 1,
        })
        .eq('id', postId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Generate new content (similar to generate_post but for regeneration)
      return new Response(JSON.stringify({ 
        post: updatedPost,
        message: 'Post regenerated successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
