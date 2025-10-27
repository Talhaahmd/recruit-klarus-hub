import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface InterviewGameplanRequest {
  target_role: string;
  company_type?: string;
  industry?: string;
  experience_level?: string;
  question_count?: number;
  focus_areas?: string[];
  difficulty_level?: string;
}

interface InterviewQuestion {
  question_text: string;
  question_type: string;
  difficulty_level: string;
  order_index: number;
  sample_answer: string;
  answer_explanation: string;
  key_points: string[];
  follow_up_questions: string[];
}

interface InterviewGameplanResult {
  title: string;
  description: string;
  difficulty_level: string;
  focus_areas: string[];
  interview_questions: InterviewQuestion[];
  ai_analysis: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Generate interview gameplan function called');
    const { 
      target_role,
      company_type,
      industry,
      experience_level = 'mid',
      question_count = 5,
      focus_areas = ['behavioral', 'technical'],
      difficulty_level = 'intermediate'
    }: InterviewGameplanRequest = await req.json();
    
    console.log('Request data received:', { 
      target_role,
      company_type,
      industry,
      experience_level,
      question_count,
      focus_areas
    });

    if (!target_role) {
      return new Response(
        JSON.stringify({ error: 'Target role is required' }),
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

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Sanitize inputs
    const sanitizedTargetRole = target_role.replace(/[^\w\s-]/g, '').trim();
    const sanitizedCompanyType = company_type ? company_type.replace(/[^\w\s-]/g, '').trim() : '';
    const sanitizedIndustry = industry ? industry.replace(/[^\w\s-]/g, '').trim() : '';

    // Create the interview gameplan generation prompt
    const interviewPrompt = `You are an expert interview coach and career development specialist.

Generate a comprehensive interview gameplan based on the following information:

Target Role: ${sanitizedTargetRole}
${sanitizedCompanyType ? `Company Type: ${sanitizedCompanyType}` : ''}
${sanitizedIndustry ? `Industry: ${sanitizedIndustry}` : 'General'}
Experience Level: ${experience_level}
Question Count: ${question_count}
Focus Areas: ${focus_areas.join(', ')}
Difficulty Level: ${difficulty_level}

Create a comprehensive interview preparation plan that:
1. Includes ${question_count} carefully crafted interview questions
2. Covers the specified focus areas (${focus_areas.join(', ')})
3. Matches the experience level (${experience_level})
4. Is appropriate for the target role (${sanitizedTargetRole})
5. Includes sample answers and key points for each question
6. Provides follow-up questions for deeper discussion

IMPORTANT: Generate realistic, industry-relevant questions that would actually be asked in interviews for this role.

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Interview Gameplan Title",
  "description": "Detailed description of the interview preparation plan",
  "difficulty_level": "${difficulty_level}",
  "focus_areas": ${JSON.stringify(focus_areas)},
  "interview_questions": [
    {
      "question_text": "Tell me about a time when you had to solve a complex problem.",
      "question_type": "behavioral",
      "difficulty_level": "intermediate",
      "order_index": 1,
      "sample_answer": "In my previous role as a Software Engineer, I encountered a critical bug that was causing our application to crash for 30% of users. The issue was difficult to reproduce and seemed to be related to memory management...",
      "answer_explanation": "This question tests problem-solving skills, technical knowledge, and communication abilities. The STAR method (Situation, Task, Action, Result) is ideal for answering behavioral questions.",
      "key_points": [
        "Use the STAR method (Situation, Task, Action, Result)",
        "Be specific with examples and metrics",
        "Show your thought process and decision-making",
        "Highlight collaboration and leadership if applicable"
      ],
      "follow_up_questions": [
        "How did you prioritize this issue among other tasks?",
        "What tools or techniques did you use to debug this?",
        "How did you prevent similar issues in the future?"
      ]
    }
  ],
  "ai_analysis": {
    "interview_strategy": "Explanation of the overall interview approach",
    "key_competencies": ["competency1", "competency2"],
    "success_metrics": ["metric1", "metric2"],
    "preparation_tips": "Additional tips for interview success"
  }
}`;

    console.log('Calling OpenAI for interview gameplan generation...');
    console.log('Prompt length:', interviewPrompt.length);
    
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
            content: 'You are an expert interview coach. Create comprehensive, practical interview preparation plans. Always return valid JSON in the exact format requested.'
          },
          { role: 'user', content: interviewPrompt }
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
    const gameplanText = openAIData.choices[0]?.message?.content;

    if (!gameplanText) {
      throw new Error('No interview gameplan received from OpenAI');
    }

    console.log('OpenAI interview gameplan received, parsing...');
    console.log('Raw response length:', gameplanText.length);

    // Parse the JSON response
    let gameplanResult: InterviewGameplanResult;
    try {
      // Clean the response to extract JSON
      const jsonMatch = gameplanText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in OpenAI response');
        console.error('Full response:', gameplanText);
        throw new Error('No JSON found in OpenAI response');
      }
      
      console.log('JSON match found, length:', jsonMatch[0].length);
      gameplanResult = JSON.parse(jsonMatch[0]);
      console.log('JSON parsed successfully');
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response:', gameplanText);
      throw new Error('Failed to parse interview gameplan result: ' + parseError.message);
    }

    console.log('Interview gameplan parsed successfully');

    // Validate and clean the result
    const validatedResult = {
      title: gameplanResult.title || `Interview Gameplan for ${sanitizedTargetRole}`,
      description: gameplanResult.description || 'A comprehensive interview preparation plan',
      difficulty_level: gameplanResult.difficulty_level || difficulty_level,
      focus_areas: Array.isArray(gameplanResult.focus_areas) ? gameplanResult.focus_areas : focus_areas,
      interview_questions: Array.isArray(gameplanResult.interview_questions) ? gameplanResult.interview_questions : [],
      ai_analysis: gameplanResult.ai_analysis || {}
    };

    console.log('Validated result:', {
      title: validatedResult.title,
      difficulty_level: validatedResult.difficulty_level,
      questions_count: validatedResult.interview_questions.length,
      focus_areas: validatedResult.focus_areas
    });

    // Store interview gameplan in database
    console.log('Storing interview gameplan in database for user:', user.id);
    
    const { data: interviewGameplan, error: gameplanError } = await supabase
      .from('interview_questions')
      .insert({
        user_id: user.id,
        title: validatedResult.title,
        description: validatedResult.description,
        target_role: sanitizedTargetRole,
        company_type: sanitizedCompanyType || null,
        industry: sanitizedIndustry || null,
        experience_level: experience_level,
        question_count: validatedResult.interview_questions.length,
        difficulty_level: validatedResult.difficulty_level,
        focus_areas: validatedResult.focus_areas,
        ai_analysis: validatedResult.ai_analysis
      })
      .select()
      .single();

    if (gameplanError) {
      console.error('Error storing interview gameplan:', gameplanError);
      throw new Error('Failed to store interview gameplan: ' + gameplanError.message);
    }

    console.log('Interview gameplan stored with ID:', interviewGameplan.id);

    // Store interview question items
    if (validatedResult.interview_questions && validatedResult.interview_questions.length > 0) {
      console.log('Processing interview question items...');
      
      const questionItems = validatedResult.interview_questions.map((question, index) => ({
        question_set_id: interviewGameplan.id,
        question_text: question.question_text,
        question_type: question.question_type || 'behavioral',
        difficulty_level: question.difficulty_level || difficulty_level,
        order_index: question.order_index || index + 1,
        sample_answer: question.sample_answer || '',
        answer_explanation: question.answer_explanation || '',
        key_points: Array.isArray(question.key_points) ? question.key_points : [],
        follow_up_questions: Array.isArray(question.follow_up_questions) ? question.follow_up_questions : []
      }));

      const { error: itemsError } = await supabase
        .from('interview_question_items')
        .insert(questionItems);

      if (itemsError) {
        console.error('Error storing interview question items:', itemsError);
        // Don't throw error here, gameplan is still valid
      } else {
        console.log('Interview question items stored successfully');
      }
    }

    console.log('=== Interview Gameplan Generation Completed Successfully ===');

    return new Response(
      JSON.stringify({
        success: true,
        interview_gameplan: interviewGameplan,
        message: 'Interview gameplan generated successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in interview gameplan generation:', error);
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
