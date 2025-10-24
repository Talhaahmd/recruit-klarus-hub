import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ATSAnalysisRequest {
  cvText: string;
  jobTitle?: string;
  industry?: string;
  jobDescription?: string;
}

interface ATSAnalysisResult {
  ats_score: number;
  formatting_score: number;
  keyword_density_score: number;
  grammar_score: number;
  quantifiable_results_score: number;
  overall_compatibility_score: number;
  feedback_summary: string;
  feedback_items: Array<{
    category: string;
    issue: string;
    suggestion: string;
    severity: 'high' | 'medium' | 'low';
    priority: number;
  }>;
  ai_analysis: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== ATS Analysis Started ===')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    const { cvText, jobTitle, industry, jobDescription }: ATSAnalysisRequest = await req.json()
    
    if (!cvText) {
      throw new Error('CV text is required')
    }

    console.log('Analyzing CV for user:', user.id)
    console.log('Job title:', jobTitle)
    console.log('Industry:', industry)

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create comprehensive ATS analysis prompt
    const analysisPrompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach. Analyze the following CV/resume for ATS compatibility and provide detailed feedback.

CV Text:
"""
${cvText}
"""

${jobTitle ? `Target Job Title: ${jobTitle}` : ''}
${industry ? `Industry: ${industry}` : ''}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Please provide a comprehensive ATS analysis with the following structure:

1. **ATS Compatibility Score (0-100)**: Overall ATS compatibility
2. **Formatting Score (0-100)**: Resume structure, sections, bullet points
3. **Keyword Density Score (0-100)**: Relevant keywords and industry terms
4. **Grammar Score (0-100)**: Grammar, spelling, clarity
5. **Quantifiable Results Score (0-100)**: Numbers, metrics, achievements
6. **Overall Compatibility Score (0-100)**: Final weighted score

For each category, provide:
- Specific issues found
- Actionable suggestions
- Severity level (high/medium/low)
- Priority (1-5, where 5 is highest)

Return ONLY a valid JSON object with this exact structure:

{
  "ats_score": 85,
  "formatting_score": 90,
  "keyword_density_score": 75,
  "grammar_score": 95,
  "quantifiable_results_score": 80,
  "overall_compatibility_score": 87,
  "feedback_summary": "Overall strong resume with minor improvements needed in keyword optimization and quantifiable results.",
  "feedback_items": [
    {
      "category": "formatting",
      "issue": "Missing professional summary section",
      "suggestion": "Add a 2-3 line professional summary at the top highlighting key qualifications",
      "severity": "medium",
      "priority": 3
    },
    {
      "category": "keywords",
      "issue": "Missing industry-specific keywords",
      "suggestion": "Include relevant keywords from the job description like 'project management', 'data analysis', 'team leadership'",
      "severity": "high",
      "priority": 5
    }
  ],
  "ai_analysis": {
    "strengths": ["Strong technical skills", "Relevant experience"],
    "weaknesses": ["Limited quantifiable results", "Generic language"],
    "recommendations": ["Add more metrics", "Use action verbs"],
    "keyword_matches": ["project management", "leadership"],
    "missing_keywords": ["data analysis", "stakeholder management"]
  }
}`

    console.log('Calling OpenAI for ATS analysis...')
    
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
            content: 'You are an expert ATS analyst and career coach. Provide detailed, actionable feedback for resume optimization. Always return valid JSON in the exact format requested.'
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent analysis
        max_tokens: 2000,
      }),
    })

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${errorText}`)
    }

    const openAIData = await openAIResponse.json()
    const analysisText = openAIData.choices[0]?.message?.content

    if (!analysisText) {
      throw new Error('No analysis received from OpenAI')
    }

    console.log('OpenAI analysis received, parsing...')

    // Parse the JSON response
    let analysisResult: ATSAnalysisResult
    try {
      // Clean the response to extract JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in OpenAI response')
      }
      
      analysisResult = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError)
      console.error('Raw response:', analysisText)
      throw new Error('Failed to parse analysis result')
    }

    console.log('Analysis parsed successfully')

    // Store analysis in database
    const { data: analysisRecord, error: analysisError } = await supabaseClient
      .from('ats_analyses')
      .insert({
        user_id: user.id,
        cv_text: cvText,
        job_title: jobTitle || null,
        industry: industry || null,
        job_description: jobDescription || null,
        ats_score: analysisResult.ats_score,
        formatting_score: analysisResult.formatting_score,
        keyword_density_score: analysisResult.keyword_density_score,
        grammar_score: analysisResult.grammar_score,
        quantifiable_results_score: analysisResult.quantifiable_results_score,
        overall_compatibility_score: analysisResult.overall_compatibility_score,
        feedback_summary: analysisResult.feedback_summary,
        ai_analysis: analysisResult.ai_analysis
      })
      .select()
      .single()

    if (analysisError) {
      console.error('Error storing analysis:', analysisError)
      throw new Error('Failed to store analysis: ' + analysisError.message)
    }

    console.log('Analysis stored with ID:', analysisRecord.id)

    // Store feedback items
    if (analysisResult.feedback_items && analysisResult.feedback_items.length > 0) {
      const feedbackItems = analysisResult.feedback_items.map(item => ({
        analysis_id: analysisRecord.id,
        category: item.category,
        issue: item.issue,
        suggestion: item.suggestion,
        severity: item.severity,
        priority: item.priority
      }))

      const { error: feedbackError } = await supabaseClient
        .from('ats_feedback_items')
        .insert(feedbackItems)

      if (feedbackError) {
        console.error('Error storing feedback items:', feedbackError)
        // Don't throw error here, analysis is still valid
      } else {
        console.log('Feedback items stored successfully')
      }
    }

    console.log('=== ATS Analysis Completed Successfully ===')

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisRecord,
        message: 'ATS analysis completed successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in ATS analysis:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
