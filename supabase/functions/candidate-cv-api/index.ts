
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

    const url = new URL(req.url)
    const method = req.method

    if (method === 'GET') {
      // Get candidate CVs for jobs created by the API key owner
      const { data, error } = await supabaseClient
        .from('candidate_cvs')
        .select(`
          *,
          jobs:job_id (
            title,
            location,
            type,
            created_by,
            user_id
          )
        `)
        .order('application_date', { ascending: false })

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Filter CVs to only show those for jobs created by the API key owner
      const filteredData = data?.filter(cv => 
        cv.jobs?.created_by === keyData.user_id || cv.jobs?.user_id === keyData.user_id
      ) || []

      return new Response(
        JSON.stringify({ data: filteredData }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'POST') {
      // Create new candidate CV entry - anyone can create but we need to ensure proper job ownership
      const body = await req.json()
      
      // Verify the job exists and get its details
      const { data: jobData, error: jobError } = await supabaseClient
        .from('jobs')
        .select('id, created_by, user_id')
        .eq('id', body.job_id)
        .single()

      if (jobError || !jobData) {
        return new Response(
          JSON.stringify({ error: 'Job not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // For CV creation, we use the job owner's user_id
      const { data, error } = await supabaseClient
        .from('candidate_cvs')
        .insert({
          ...body,
          user_id: jobData.created_by || jobData.user_id
        })
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
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
