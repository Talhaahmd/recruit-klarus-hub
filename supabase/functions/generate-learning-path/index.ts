import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface LearningPathRequest {
  skill_gaps: string[];
  target_role?: string;
  industry?: string;
  experience_level?: string;
  time_commitment?: string; // hours per week
  learning_goals?: string[];
}

interface LearningPathResult {
  title: string;
  description: string;
  estimated_duration_weeks: number;
  difficulty_level: string;
  total_hours: number;
  learning_path_items: Array<{
    title: string;
    description: string;
    item_type: string;
    order_index: number;
    estimated_hours: number;
    is_required: boolean;
    course_id?: string;
    resource_url?: string;
    skills_covered: string[];
  }>;
  ai_analysis: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Generate learning path function called');
    const { 
      skill_gaps, 
      target_role, 
      industry, 
      experience_level = 'intermediate',
      time_commitment = '5-10',
      learning_goals = []
    }: LearningPathRequest = await req.json();
    
    console.log('Request data received:', { 
      skill_gaps: skill_gaps?.length || 0, 
      target_role, 
      industry, 
      experience_level,
      time_commitment 
    });

    if (!skill_gaps || skill_gaps.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Skill gaps are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Get courses and resources from database
    console.log('Fetching courses and resources from database...');
    
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('rating', { ascending: false });

    const { data: resources, error: resourcesError } = await supabase
      .from('learning_resources')
      .select('*');

    const { data: categories, error: categoriesError } = await supabase
      .from('course_categories')
      .select('*');

    console.log('Database query results:', {
      coursesCount: courses?.length || 0,
      resourcesCount: resources?.length || 0,
      categoriesCount: categories?.length || 0,
      errors: {
        courses: coursesError?.message,
        resources: resourcesError?.message,
        categories: categoriesError?.message
      }
    });

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Sanitize inputs
    const sanitizedTargetRole = target_role ? target_role.replace(/[^\w\s-]/g, '').trim() : '';
    const sanitizedIndustry = industry ? industry.replace(/[^\w\s-]/g, '').trim() : '';
    const sanitizedGoals = learning_goals.map(goal => goal.replace(/[^\w\s-]/g, '').trim());

    // Create the learning path generation prompt
    const learningPathPrompt = `You are an expert learning path designer and career development specialist.

Generate a personalized learning roadmap based on the following information:

Skill Gaps to Address: ${skill_gaps.join(', ')}
${sanitizedTargetRole ? `Target Role: ${sanitizedTargetRole}` : ''}
${sanitizedIndustry ? `Industry: ${sanitizedIndustry}` : 'General'}
Experience Level: ${experience_level}
Time Commitment: ${time_commitment} hours per week
${sanitizedGoals.length > 0 ? `Learning Goals: ${sanitizedGoals.join(', ')}` : ''}

Available Courses: ${courses && courses.length > 0 ? courses.slice(0, 10).map(c => `${c.title} (${c.difficulty_level}, ${c.duration_hours}h, ${c.is_free ? 'Free' : 'Paid'})`).join(', ') : 'None'}
Available Resources: ${resources && resources.length > 0 ? resources.slice(0, 5).map(r => `${r.title} (${r.resource_type})`).join(', ') : 'None'}

Create a comprehensive learning path that:
1. Addresses the identified skill gaps systematically
2. Matches the user's experience level and time commitment
3. Includes a mix of courses, resources, and practical projects
4. Progresses logically from foundational to advanced topics
5. Provides clear learning objectives and outcomes

IMPORTANT: Calculate realistic duration and hours based on:
- Number of skill gaps to address
- User's experience level (beginner needs more time)
- Time commitment per week (${time_commitment} hours)
- Complexity of the target role

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Learning Path Title",
  "description": "Detailed description of the learning path",
  "estimated_duration_weeks": [CALCULATE based on skill gaps and time commitment],
  "difficulty_level": "[beginner/intermediate/advanced/expert based on experience level]",
  "total_hours": [CALCULATE based on duration and time commitment],
  "learning_path_items": [
    {
      "title": "Course/Resource Title",
      "description": "What the learner will gain",
      "item_type": "course",
      "order_index": 1,
      "estimated_hours": 10,
      "is_required": true,
      "course_id": "course_id_if_applicable",
      "resource_url": "url_if_applicable",
      "skills_covered": ["skill1", "skill2"]
    }
  ],
  "ai_analysis": {
    "learning_strategy": "Explanation of the learning approach",
    "key_benefits": ["benefit1", "benefit2"],
    "success_metrics": ["metric1", "metric2"],
    "recommendations": "Additional tips for success"
  }
}`;

    console.log('Calling OpenAI for learning path generation...');
    console.log('Prompt length:', learningPathPrompt.length);
    
    // Call OpenAI API using fetch
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
            content: 'You are an expert learning path designer. Create comprehensive, practical learning roadmaps. Always return valid JSON in the exact format requested.'
          },
          { role: 'user', content: learningPathPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const openAIData = await openAIResponse.json();
    const pathText = openAIData.choices[0]?.message?.content;

    if (!pathText) {
      throw new Error('No learning path received from OpenAI');
    }

    console.log('OpenAI learning path received, parsing...');
    console.log('Raw response length:', pathText.length);
    console.log('Raw OpenAI response:', pathText);

    // Parse the JSON response
    let pathResult: LearningPathResult;
    try {
      // Clean the response to extract JSON
      const jsonMatch = pathText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in OpenAI response');
        console.error('Full response:', pathText);
        throw new Error('No JSON found in OpenAI response');
      }
      
      console.log('JSON match found, length:', jsonMatch[0].length);
      pathResult = JSON.parse(jsonMatch[0]);
      console.log('JSON parsed successfully');
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response:', pathText);
      throw new Error('Failed to parse learning path result: ' + parseError.message);
    }

    console.log('Learning path parsed successfully');

    // Calculate intelligent fallbacks based on user input
    const timeCommitmentHours = parseInt(time_commitment.split('-')[0]) || 5; // Get minimum hours from range
    const skillGapsCount = skill_gaps.length;
    const isBeginner = experience_level === 'beginner';
    
    // Calculate realistic duration based on skill gaps and experience
    const baseWeeks = Math.max(4, skillGapsCount * (isBeginner ? 3 : 2));
    const calculatedWeeks = Math.min(52, baseWeeks);
    const calculatedHours = calculatedWeeks * timeCommitmentHours;
    
    // Validate and clean the result
    const validatedResult = {
      title: pathResult.title || 'Personalized Learning Path',
      description: pathResult.description || 'A customized learning roadmap',
      estimated_duration_weeks: Math.max(1, Math.min(52, pathResult.estimated_duration_weeks || calculatedWeeks)),
      difficulty_level: pathResult.difficulty_level || experience_level,
      total_hours: Math.max(1, Math.min(1000, pathResult.total_hours || calculatedHours)),
      learning_path_items: Array.isArray(pathResult.learning_path_items) ? pathResult.learning_path_items : [],
      ai_analysis: pathResult.ai_analysis || {}
    };

    console.log('Calculation details:', {
      timeCommitmentHours,
      skillGapsCount,
      isBeginner,
      calculatedWeeks,
      calculatedHours
    });
    
    console.log('Validated result:', {
      title: validatedResult.title,
      duration_weeks: validatedResult.estimated_duration_weeks,
      total_hours: validatedResult.total_hours,
      items_count: validatedResult.learning_path_items.length
    });
    
    console.log('Learning path items from OpenAI:', JSON.stringify(validatedResult.learning_path_items, null, 2));

    // Store learning path in database
    console.log('Storing learning path in database for user:', user.id);
    
    const { data: learningPath, error: pathError } = await supabase
      .from('learning_paths')
      .insert({
        user_id: user.id,
        title: validatedResult.title,
        description: validatedResult.description,
        target_role: sanitizedTargetRole || null,
        industry: sanitizedIndustry || null,
        skill_gaps: skill_gaps,
        estimated_duration_weeks: validatedResult.estimated_duration_weeks,
        difficulty_level: validatedResult.difficulty_level,
        total_hours: validatedResult.total_hours,
        ai_analysis: validatedResult.ai_analysis
      })
      .select()
      .single();

    if (pathError) {
      console.error('Error storing learning path:', pathError);
      throw new Error('Failed to store learning path: ' + pathError.message);
    }

    console.log('Learning path stored with ID:', learningPath.id);

    // Store learning path items
    if (validatedResult.learning_path_items && validatedResult.learning_path_items.length > 0) {
      console.log('Processing learning path items...');
      
      // Create a mapping of course titles to UUIDs for matching
      const courseTitleToId = new Map();
      if (courses && courses.length > 0) {
        courses.forEach(course => {
          courseTitleToId.set(course.title.toLowerCase(), course.id);
        });
      }
      
      console.log('Available courses for mapping:', courseTitleToId.size);
      console.log('Available course titles:', Array.from(courseTitleToId.keys()));
      
      const pathItems = validatedResult.learning_path_items.map((item, index) => {
        let courseId = null;
        
        // Only try to match course_id if item_type is 'course' and we have a course_id from OpenAI
        if (item.item_type === 'course' && item.course_id) {
          // Try to find a matching course by title (case-insensitive)
          const matchingCourse = courses?.find(course => 
            course.title.toLowerCase().includes(item.title.toLowerCase()) ||
            item.title.toLowerCase().includes(course.title.toLowerCase())
          );
          
          if (matchingCourse) {
            courseId = matchingCourse.id;
            console.log(`Matched course: "${item.title}" -> ${matchingCourse.id}`);
          } else {
            console.log(`No matching course found for: "${item.title}"`);
          }
        }
        
        return {
          path_id: learningPath.id,
          course_id: courseId,
          title: item.title,
          description: item.description,
          item_type: item.item_type || 'course',
          order_index: item.order_index || index + 1,
          estimated_hours: item.estimated_hours || 5,
          is_required: item.is_required !== false,
          notes: item.resource_url ? `Resource: ${item.resource_url}` : null
        };
      });

      const { error: itemsError } = await supabase
        .from('learning_path_items')
        .insert(pathItems);

      if (itemsError) {
        console.error('Error storing learning path items:', itemsError);
        // Don't throw error here, path is still valid
      } else {
        console.log('Learning path items stored successfully');
      }
    }

    console.log('=== Learning Path Generation Completed Successfully ===');

    return new Response(
      JSON.stringify({
        success: true,
        learning_path: learningPath,
        message: 'Learning path generated successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in learning path generation:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
