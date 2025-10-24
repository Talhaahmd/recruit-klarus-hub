import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

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
    console.log('Skill analysis function called');
    const { cv_text, job_title, industry, target_role }: SkillAnalysisRequest = await req.json();
    console.log('Request data received:', { cv_text: cv_text?.substring(0, 100) + '...', job_title, industry, target_role });

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

    // Get skill categories, skills, and archetypes from database
    console.log('Fetching reference data from database...');
    
    const { data: skillCategories, error: skillCategoriesError } = await supabase
      .from('skill_categories')
      .select('*');

    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*');

    const { data: archetypes, error: archetypesError } = await supabase
      .from('employee_archetypes')
      .select('*');

    const { data: skillMaps, error: skillMapsError } = await supabase
      .from('skill_maps')
      .select('*');

    console.log('Database query results:', {
      skillCategoriesCount: skillCategories?.length || 0,
      skillsCount: skills?.length || 0,
      archetypesCount: archetypes?.length || 0,
      skillMapsCount: skillMaps?.length || 0,
      errors: {
        skillCategories: skillCategoriesError?.message,
        skills: skillsError?.message,
        archetypes: archetypesError?.message,
        skillMaps: skillMapsError?.message
      }
    });

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Sanitize inputs to prevent issues
    const sanitizedJobTitle = job_title ? job_title.replace(/[^\w\s-]/g, '').trim() : '';
    const sanitizedIndustry = industry ? industry.replace(/[^\w\s-]/g, '').trim() : '';
    const sanitizedTargetRole = target_role ? target_role.replace(/[^\w\s-]/g, '').trim() : '';

    // Create the analysis prompt
    const analysisPrompt = `You are an expert career analyst specializing in skill assessment and employee archetype classification.

Analyze the following CV for skill assessment and archetype classification:

CV Text:
"""
${cv_text}
"""

${sanitizedJobTitle ? `Target Job Title: ${sanitizedJobTitle}` : ''}
${sanitizedIndustry ? `Industry: ${sanitizedIndustry}` : ''}
${sanitizedTargetRole ? `Target Role: ${sanitizedTargetRole}` : ''}

Available skill categories: ${skillCategories && skillCategories.length > 0 ? skillCategories.map(c => c.name).join(', ') : 'None'}
Available skills: ${skills && skills.length > 0 ? skills.slice(0, 20).map(s => s.name).join(', ') : 'None'}
Available archetypes: ${archetypes && archetypes.length > 0 ? archetypes.map(a => `${a.name} (ID: ${a.id})`).join(', ') : 'None'}

Please provide:
1. Skill scores (0-100) for: technical_skills, soft_skills, leadership, creativity, analytical
2. Overall skill score and skill balance score
3. Primary and secondary archetype classification with confidence (use archetype IDs from the list above)
4. Top 10 identified skills with evidence
5. Top 5 missing/weak skills
6. Detailed skill analysis items with proficiency levels
7. Personality indicators from tone and content

Return ONLY a valid JSON object with this exact structure:
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

    console.log('Calling OpenAI for skill analysis...');
    console.log('Prompt length:', analysisPrompt.length);
    console.log('Input parameters:', { job_title, industry, target_role });
    
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
            content: 'You are an expert career analyst and skill assessor. Provide detailed, accurate skill analysis. Always return valid JSON in the exact format requested.'
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const openAIData = await openAIResponse.json();
    const analysisText = openAIData.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error('No analysis received from OpenAI');
    }

    console.log('OpenAI analysis received, parsing...');
    console.log('Raw response length:', analysisText.length);
    console.log('Raw response preview:', analysisText.substring(0, 200) + '...');

    // Parse the JSON response
    let analysisResult: SkillAnalysisResult;
    try {
      // Clean the response to extract JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in OpenAI response');
        console.error('Full response:', analysisText);
        throw new Error('No JSON found in OpenAI response');
      }
      
      console.log('JSON match found, length:', jsonMatch[0].length);
      analysisResult = JSON.parse(jsonMatch[0]);
      console.log('JSON parsed successfully');
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response:', analysisText);
      console.error('JSON match attempt:', analysisText.match(/\{[\s\S]*\}/)?.[0]?.substring(0, 200));
      throw new Error('Failed to parse analysis result: ' + parseError.message);
    }

    console.log('Analysis parsed successfully');

    // Validate and clean the result - ENSURE ALL SCORES ARE INTEGERS
    const validatedResult = {
      technical_skills_score: Math.round(Math.max(0, Math.min(100, analysisResult.technical_skills_score || 0))),
      soft_skills_score: Math.round(Math.max(0, Math.min(100, analysisResult.soft_skills_score || 0))),
      leadership_score: Math.round(Math.max(0, Math.min(100, analysisResult.leadership_score || 0))),
      creativity_score: Math.round(Math.max(0, Math.min(100, analysisResult.creativity_score || 0))),
      analytical_score: Math.round(Math.max(0, Math.min(100, analysisResult.analytical_score || 0))),
      overall_skill_score: Math.round(Math.max(0, Math.min(100, analysisResult.overall_skill_score || 0))),
      skill_balance_score: Math.round(Math.max(0, Math.min(100, analysisResult.skill_balance_score || 0))),
      primary_archetype_id: analysisResult.primary_archetype_id || (archetypes && archetypes.length > 0 ? archetypes[0].id : null),
      secondary_archetype_id: analysisResult.secondary_archetype_id || null,
      archetype_confidence: Math.max(0, Math.min(1, analysisResult.archetype_confidence || 0.5)),
      top_skills: Array.isArray(analysisResult.top_skills) ? analysisResult.top_skills : [],
      missing_skills: Array.isArray(analysisResult.missing_skills) ? analysisResult.missing_skills : [],
      skill_gaps: analysisResult.skill_gaps || {},
      personality_indicators: analysisResult.personality_indicators || {},
      ai_analysis: analysisResult.ai_analysis || {},
      skill_analysis_items: Array.isArray(analysisResult.skill_analysis_items) ? analysisResult.skill_analysis_items : []
    };

    console.log('Validated result:', {
      scores: {
        technical: validatedResult.technical_skills_score,
        soft: validatedResult.soft_skills_score,
        leadership: validatedResult.leadership_score,
        creativity: validatedResult.creativity_score,
        analytical: validatedResult.analytical_score,
        overall: validatedResult.overall_skill_score
      },
      primary_archetype_id: validatedResult.primary_archetype_id,
      top_skills_count: validatedResult.top_skills.length,
      skill_items_count: validatedResult.skill_analysis_items.length
    });

    // Store analysis in database
    console.log('Storing analysis in database for user:', user.id);
    
    const { data: skillAnalysis, error: analysisError } = await supabase
      .from('skill_analyses')
      .insert({
        user_id: user.id,
        cv_text,
        job_title: sanitizedJobTitle || null,
        industry: sanitizedIndustry || null,
        target_role: sanitizedTargetRole || null,
        technical_skills_score: validatedResult.technical_skills_score,
        soft_skills_score: validatedResult.soft_skills_score,
        leadership_score: validatedResult.leadership_score,
        creativity_score: validatedResult.creativity_score,
        analytical_score: validatedResult.analytical_score,
        overall_skill_score: validatedResult.overall_skill_score,
        skill_balance_score: validatedResult.skill_balance_score,
        primary_archetype_id: validatedResult.primary_archetype_id,
        secondary_archetype_id: validatedResult.secondary_archetype_id,
        archetype_confidence: validatedResult.archetype_confidence, // Keep as decimal (0.0 - 1.0)
        top_skills: validatedResult.top_skills,
        missing_skills: validatedResult.missing_skills,
        skill_gaps: validatedResult.skill_gaps,
        personality_indicators: validatedResult.personality_indicators,
        ai_analysis: validatedResult.ai_analysis
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      throw new Error('Failed to store analysis: ' + analysisError.message);
    }

    console.log('Analysis stored with ID:', skillAnalysis.id);

    // Store skill analysis items
    if (validatedResult.skill_analysis_items && validatedResult.skill_analysis_items.length > 0) {
      const skillItems = validatedResult.skill_analysis_items.map(item => ({
        analysis_id: skillAnalysis.id,
        skill_name: item.skill_name,
        skill_category: item.skill_category,
        proficiency_level: item.proficiency_level,
        confidence_score: Math.round(item.confidence_score || 0), // Ensure integer
        evidence: item.evidence,
        is_strong_point: item.is_strong_point,
        is_weak_point: item.is_weak_point
      }));

      const { error: itemsError } = await supabase
        .from('skill_analysis_items')
        .insert(skillItems);

      if (itemsError) {
        console.error('Error storing skill analysis items:', itemsError);
        // Don't throw error here, analysis is still valid
      } else {
        console.log('Skill analysis items stored successfully');
      }
    }

    console.log('=== Skill Analysis Completed Successfully ===');

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
    console.error('Error in skill analysis:', error);
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
