import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { OpenAI } from "https://deno.land/x/openai@v4.33.0/mod.ts";

interface SkillAnalysisRequest {
  cv_text: string;
  job_title?: string;
  industry?: string;
  target_role?: string;
}

interface SkillAnalysisResult {
  technical_skills_score: number;
  soft_skills_score: number;
  leadership_score: number;
  creativity_score: number;
  analytical_score: number;
  overall_skill_score: number;
  skill_balance_score: number;
  primary_archetype_id: string;
  secondary_archetype_id?: string;
  archetype_confidence: number;
  top_skills: string[];
  missing_skills: string[];
  skill_gaps: any;
  personality_indicators: any;
  ai_analysis: any;
  skill_analysis_items: Array<{
    skill_name: string;
    skill_category: string;
    proficiency_level: string;
    confidence_score: number;
    evidence: string;
    is_strong_point: boolean;
    is_weak_point: boolean;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { cv_text, job_title, industry, target_role }: SkillAnalysisRequest = await req.json();

    if (!cv_text) {
      return new Response(
        JSON.stringify({ error: 'CV text is required' }),
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

    // Get user from request headers (when called via supabase.functions.invoke)
    const authHeader = req.headers.get('Authorization');
    let user;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !authUser) {
        return new Response(
          JSON.stringify({ error: 'Invalid authentication' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      user = authUser;
    } else {
      // If no auth header, try to get user from the request context
      const { data: { user: contextUser } } = await supabase.auth.getUser();
      if (!contextUser) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      user = contextUser;
    }

    // Get skill categories, skills, and archetypes from database
    const { data: skillCategories } = await supabase
      .from('skill_categories')
      .select('*');

    const { data: skills } = await supabase
      .from('skills')
      .select('*');

    const { data: archetypes } = await supabase
      .from('employee_archetypes')
      .select('*');

    const { data: skillMaps } = await supabase
      .from('skill_maps')
      .select('*');

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Create the analysis prompt
    const systemPrompt = `You are an expert career analyst specializing in skill assessment and employee archetype classification. 
    
    Your task is to analyze a CV and provide:
    1. Skill scores (0-100) for different categories
    2. Employee archetype classification
    3. Detailed skill analysis with evidence
    4. Personality indicators from tone and content
    
    Available skill categories: ${skillCategories?.map(c => c.name).join(', ')}
    Available skills: ${skills?.map(s => s.name).join(', ')}
    Available archetypes: ${archetypes?.map(a => a.name).join(', ')}
    
    Return your analysis as a JSON object with the exact structure specified.`;

    const userPrompt = `Analyze this CV for skill assessment and archetype classification:

CV Text: ${cv_text}
${job_title ? `Target Job Title: ${job_title}` : ''}
${industry ? `Industry: ${industry}` : ''}
${target_role ? `Target Role: ${target_role}` : ''}

Please provide:
1. Skill scores (0-100) for: technical_skills, soft_skills, leadership, creativity, analytical
2. Overall skill score and skill balance score
3. Primary and secondary archetype classification with confidence
4. Top 10 identified skills with evidence
5. Top 5 missing/weak skills
6. Detailed skill analysis items with proficiency levels
7. Personality indicators from tone and content

Return as JSON with this exact structure:
{
  "technical_skills_score": number,
  "soft_skills_score": number,
  "leadership_score": number,
  "creativity_score": number,
  "analytical_score": number,
  "overall_skill_score": number,
  "skill_balance_score": number,
  "primary_archetype_id": "archetype_id",
  "secondary_archetype_id": "archetype_id",
  "archetype_confidence": 0.85,
  "top_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "skill_gaps": {...},
  "personality_indicators": {...},
  "ai_analysis": {...},
  "skill_analysis_items": [
    {
      "skill_name": "JavaScript",
      "skill_category": "Programming & Development",
      "proficiency_level": "advanced",
      "confidence_score": 85,
      "evidence": "5+ years experience building web applications",
      "is_strong_point": true,
      "is_weak_point": false
    }
  ]
}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const analysisResult: SkillAnalysisResult = JSON.parse(completion.choices[0].message.content || '{}');

    // Validate and clean the result
    const validatedResult = {
      technical_skills_score: Math.max(0, Math.min(100, analysisResult.technical_skills_score || 0)),
      soft_skills_score: Math.max(0, Math.min(100, analysisResult.soft_skills_score || 0)),
      leadership_score: Math.max(0, Math.min(100, analysisResult.leadership_score || 0)),
      creativity_score: Math.max(0, Math.min(100, analysisResult.creativity_score || 0)),
      analytical_score: Math.max(0, Math.min(100, analysisResult.analytical_score || 0)),
      overall_skill_score: Math.max(0, Math.min(100, analysisResult.overall_skill_score || 0)),
      skill_balance_score: Math.max(0, Math.min(100, analysisResult.skill_balance_score || 0)),
      primary_archetype_id: analysisResult.primary_archetype_id || archetypes?.[0]?.id,
      secondary_archetype_id: analysisResult.secondary_archetype_id,
      archetype_confidence: Math.max(0, Math.min(1, analysisResult.archetype_confidence || 0.5)),
      top_skills: analysisResult.top_skills || [],
      missing_skills: analysisResult.missing_skills || [],
      skill_gaps: analysisResult.skill_gaps || {},
      personality_indicators: analysisResult.personality_indicators || {},
      ai_analysis: analysisResult.ai_analysis || {},
      skill_analysis_items: analysisResult.skill_analysis_items || []
    };

    // Insert the skill analysis into the database
    const { data: skillAnalysis, error: analysisError } = await supabase
      .from('skill_analyses')
      .insert({
        user_id: user.id,
        cv_text,
        job_title,
        industry,
        target_role,
        technical_skills_score: validatedResult.technical_skills_score,
        soft_skills_score: validatedResult.soft_skills_score,
        leadership_score: validatedResult.leadership_score,
        creativity_score: validatedResult.creativity_score,
        analytical_score: validatedResult.analytical_score,
        overall_skill_score: validatedResult.overall_skill_score,
        skill_balance_score: validatedResult.skill_balance_score,
        primary_archetype_id: validatedResult.primary_archetype_id,
        secondary_archetype_id: validatedResult.secondary_archetype_id,
        archetype_confidence: validatedResult.archetype_confidence,
        top_skills: validatedResult.top_skills,
        missing_skills: validatedResult.missing_skills,
        skill_gaps: validatedResult.skill_gaps,
        personality_indicators: validatedResult.personality_indicators,
        ai_analysis: validatedResult.ai_analysis
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error inserting skill analysis:', analysisError);
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert skill analysis items
    if (validatedResult.skill_analysis_items.length > 0) {
      const skillItems = validatedResult.skill_analysis_items.map(item => ({
        analysis_id: skillAnalysis.id,
        skill_name: item.skill_name,
        skill_category: item.skill_category,
        proficiency_level: item.proficiency_level,
        confidence_score: item.confidence_score,
        evidence: item.evidence,
        is_strong_point: item.is_strong_point,
        is_weak_point: item.is_weak_point
      }));

      const { error: itemsError } = await supabase
        .from('skill_analysis_items')
        .insert(skillItems);

      if (itemsError) {
        console.error('Error inserting skill analysis items:', itemsError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: skillAnalysis,
        message: 'Skill analysis completed successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Skill analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Skill analysis failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
