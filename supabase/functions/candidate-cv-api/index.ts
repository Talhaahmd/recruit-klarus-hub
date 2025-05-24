import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const method = req.method

    if (method === 'POST') {
      // Handle both API key requests and direct Make.com webhook requests
      const body = await req.json()
      
      console.log('Received data from Make.com:', body)

      // Check if this is an API key request
      const apiKey = req.headers.get('x-api-key')
      let keyData = null
      
      if (apiKey) {
        // Verify API key if provided
        const { data: apiKeyData, error: keyError } = await supabaseClient
          .from('api_keys')
          .select('user_id, permissions, is_active')
          .eq('api_key', apiKey)
          .eq('is_active', true)
          .single()

        if (keyError || !apiKeyData) {
          return new Response(
            JSON.stringify({ error: 'Invalid API key' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        keyData = apiKeyData

        // Update last_used timestamp
        await supabaseClient
          .from('api_keys')
          .update({ last_used: new Date().toISOString() })
          .eq('api_key', apiKey)
      }

      // Map the Make.com data to the candidates table structure
      const candidateData = {
        full_name: body.full_name || body.name || 'Unknown Candidate',
        email: body.email || body.candidate_email || null,
        phone: body.phone || body.candidate_phone || null,
        location: body.location || null,
        linkedin: body.linkedin || body.linkedin_url || null,
        current_job_title: body.current_job_title || body.job_title || null,
        years_experience: body.years_experience || null,
        skills: body.skills || null,
        certifications: body.certifications || null,
        companies: body.companies || body.previous_companies || null,
        job_titles: body.job_titles || body.previous_job_titles || null,
        degrees: body.degrees || body.education || null,
        institutions: body.institutions || body.educational_institutions || null,
        graduation_years: body.graduation_years || null,
        experience_level: body.experience_level || null,
        source: body.source || 'Make.com CV Upload',
        timestamp: body.timestamp || new Date().toISOString(),
        job_id: body.job_id || null,
        ai_rating: body.ai_rating || body.rating || 0,
        ai_summary: body.ai_summary || body.summary || null,
        ai_content: body.ai_content || body.parsed_content || null
      }

      console.log('Inserting candidate data:', candidateData)

      // Use service role key to bypass RLS for insertion
      const { data, error } = await supabaseClient
        .from('candidates')
        .insert(candidateData)
        .select()
        .single()

      if (error) {
        console.error('Error inserting candidate:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Successfully created candidate:', data.id)

      // If there's a job_id, increment the applicants count
      if (candidateData.job_id) {
        try {
          const { error: jobUpdateError } = await supabaseClient
            .from('jobs')
            .update({ 
              applicants: supabaseClient.rpc('increment', { x: 1 }) 
            })
            .eq('id', candidateData.job_id)
            
          if (jobUpdateError) {
            console.error('Error updating job applicants count:', jobUpdateError)
          }
        } catch (updateError) {
          console.error('Error incrementing job applicants:', updateError)
        }
      }

      return new Response(
        JSON.stringify({ data, message: 'Candidate created successfully' }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'GET') {
      // Get candidate CVs for jobs created by the API key owner
      const apiKey = req.headers.get('x-api-key')
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'API key required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify API key
      const { data: keyData, error: keyError } = await supabaseClient
        .from('api_keys')
        .select('user_id, permissions, is_active')
        .eq('api_key', apiKey)
        .eq('is_active', true)
        .single()

      if (keyError || !keyData) {
        return new Response(
          JSON.stringify({ error: 'Invalid API key' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update last_used timestamp
      await supabaseClient
        .from('api_keys')
        .update({ last_used: new Date().toISOString() })
        .eq('api_key', apiKey)

      const { data, error } = await supabaseClient
        .from('candidates')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'PUT') {
      // Update candidate CV - only for CVs belonging to jobs owned by API key owner
      const cvId = url.searchParams.get('id')
      if (!cvId) {
        return new Response(
          JSON.stringify({ error: 'CV ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const body = await req.json()
      
      // First check if the CV belongs to a job owned by the API key owner
      const { data: cvData, error: cvCheckError } = await supabaseClient
        .from('candidate_cvs')
        .select(`
          id,
          jobs:job_id (
            created_by,
            user_id
          )
        `)
        .eq('id', cvId)
        .single()

      if (cvCheckError || !cvData) {
        return new Response(
          JSON.stringify({ error: 'CV not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check ownership
      if (cvData.jobs?.created_by !== keyData.user_id && cvData.jobs?.user_id !== keyData.user_id) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized to update this CV' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      const { data, error } = await supabaseClient
        .from('candidate_cvs')
        .update(body)
        .eq('id', cvId)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'DELETE') {
      // Delete candidate CV - only for CVs belonging to jobs owned by API key owner
      const cvId = url.searchParams.get('id')
      if (!cvId) {
        return new Response(
          JSON.stringify({ error: 'CV ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // First check if the CV belongs to a job owned by the API key owner
      const { data: cvData, error: cvCheckError } = await supabaseClient
        .from('candidate_cvs')
        .select(`
          id,
          jobs:job_id (
            created_by,
            user_id
          )
        `)
        .eq('id', cvId)
        .single()

      if (cvCheckError || !cvData) {
        return new Response(
          JSON.stringify({ error: 'CV not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check ownership
      if (cvData.jobs?.created_by !== keyData.user_id && cvData.jobs?.user_id !== keyData.user_id) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized to delete this CV' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error } = await supabaseClient
        .from('candidate_cvs')
        .delete()
        .eq('id', cvId)

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ message: 'CV deleted successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('API Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
