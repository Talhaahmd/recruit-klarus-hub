
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method === 'POST') {
      const { action, candidateId, candidateName, candidatePhone, role } = await req.json()

      if (action === 'initiate_call') {
        console.log('Initiating call for candidate:', candidateName, 'Raw phone:', candidatePhone)

        // Validate phone number format
        if (!candidatePhone || candidatePhone.trim() === '') {
          throw new Error('Phone number is required')
        }

        // Clean and format phone number for Vapi
        // Remove all non-digit characters except the leading +
        let cleanPhone = candidatePhone.replace(/[^\d+]/g, '')
        
        // Ensure it starts with +
        if (!cleanPhone.startsWith('+')) {
          // If it starts with 1, assume it's a US number
          if (cleanPhone.startsWith('1')) {
            cleanPhone = '+' + cleanPhone
          } else {
            // Otherwise, assume US and add +1
            cleanPhone = '+1' + cleanPhone
          }
        }

        console.log('Cleaned phone number:', cleanPhone)

        // Validate phone number length (should be at least 10 digits after country code)
        const digitsOnly = cleanPhone.replace(/[^\d]/g, '')
        if (digitsOnly.length < 10) {
          throw new Error('Phone number is too short')
        }

        // Create initial interview record
        const { data: interview, error: insertError } = await supabaseClient
          .from('ai_interviews')
          .insert({
            candidate_id: candidateId,
            candidate_name: candidateName,
            candidate_phone: cleanPhone,
            role: role,
            call_status: 'initiating'
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error creating interview record:', insertError)
          throw insertError
        }

        console.log('Created interview record:', interview.id)

        // Prepare Vapi call payload
        const vapiPayload = {
          assistantId: '1637d56c-c8f0-4397-8836-77ca4a8664be',
          customer: {
            number: cleanPhone,
          },
          assistantOverrides: {
            variableValues: {
              full_name: candidateName,
              role: role
            }
          }
        }

        console.log('Vapi payload being sent:', JSON.stringify(vapiPayload, null, 2))

        // Make call to Vapi
        const vapiResponse = await fetch('https://api.vapi.ai/call', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('VAPI_PRIVATE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vapiPayload),
        })

        console.log('Vapi response status:', vapiResponse.status)
        console.log('Vapi response headers:', Object.fromEntries(vapiResponse.headers.entries()))

        const vapiData = await vapiResponse.json()
        console.log('Vapi response body:', JSON.stringify(vapiData, null, 2))

        if (!vapiResponse.ok) {
          console.error('Vapi API error details:', {
            status: vapiResponse.status,
            statusText: vapiResponse.statusText,
            data: vapiData
          })
          
          // Update interview record with error status
          await supabaseClient
            .from('ai_interviews')
            .update({
              call_status: 'failed',
              interview_summary: `Vapi API error: ${JSON.stringify(vapiData)}`
            })
            .eq('id', interview.id)

          throw new Error(`Vapi API error (${vapiResponse.status}): ${JSON.stringify(vapiData)}`)
        }

        // Update interview record with Vapi call ID
        await supabaseClient
          .from('ai_interviews')
          .update({
            vapi_call_id: vapiData.id,
            call_status: 'initiated'
          })
          .eq('id', interview.id)

        console.log('Successfully initiated call with ID:', vapiData.id)

        return new Response(
          JSON.stringify({ success: true, callId: vapiData.id, interviewId: interview.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (action === 'webhook') {
        // Handle Vapi webhook for call completion
        const webhookData = await req.json()
        console.log('Received Vapi webhook:', webhookData)

        if (webhookData.type === 'call-ended') {
          const { call } = webhookData
          
          // Find the interview record by Vapi call ID
          const { data: interview, error: findError } = await supabaseClient
            .from('ai_interviews')
            .select('*')
            .eq('vapi_call_id', call.id)
            .single()

          if (findError || !interview) {
            console.error('Interview not found for call ID:', call.id)
            return new Response('Interview not found', { status: 404, headers: corsHeaders })
          }

          // Process the transcript with ChatGPT
          const transcript = call.transcript || ''
          const analysisPrompt = `
Analyze this technical interview transcript and provide a detailed assessment:

TRANSCRIPT:
${transcript}

CANDIDATE: ${interview.candidate_name}
ROLE: ${interview.role}

Please provide a JSON response with:
1. overall_rating (1-10 scale)
2. communication_score (1-10)
3. cultural_fit_score (1-10)
4. technical_skills (object with skill names as keys and proficiency levels as values)
5. summary (detailed written assessment)
6. recommendation (hire/reject/further_interview with reasoning)

Focus on technical competency, communication clarity, and cultural fit based on their responses.
`

          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert technical interviewer. Analyze interview transcripts and provide detailed, objective assessments in JSON format.'
                },
                {
                  role: 'user',
                  content: analysisPrompt
                }
              ],
              temperature: 0.3,
            }),
          })

          const openaiData = await openaiResponse.json()
          console.log('OpenAI analysis:', openaiData)

          let analysis
          try {
            analysis = JSON.parse(openaiData.choices[0].message.content)
          } catch (e) {
            console.error('Failed to parse OpenAI response as JSON:', e)
            analysis = {
              overall_rating: 5,
              communication_score: 5,
              cultural_fit_score: 5,
              technical_skills: {},
              summary: 'Analysis failed - manual review required',
              recommendation: 'Manual review needed due to analysis error'
            }
          }

          // Update interview record with analysis
          await supabaseClient
            .from('ai_interviews')
            .update({
              call_status: 'completed',
              transcript: transcript,
              ai_rating: analysis.overall_rating,
              communication_score: analysis.communication_score,
              cultural_fit_score: analysis.cultural_fit_score,
              technical_skills: analysis.technical_skills,
              interview_summary: analysis.summary,
              recommendation: analysis.recommendation,
              recording_url: call.recordingUrl || null
            })
            .eq('id', interview.id)

          return new Response('Webhook processed', { headers: corsHeaders })
        }
      }
    }

    return new Response('Invalid request', { status: 400, headers: corsHeaders })
  } catch (error) {
    console.error('Error in vapi-interview function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
