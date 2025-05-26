
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
    console.log('=== CV Processing Started ===')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { fileUrl } = await req.json()
    
    if (!fileUrl) {
      console.error('No file URL provided')
      return new Response(
        JSON.stringify({ error: 'File URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing CV from URL:', fileUrl)

    // Step 1: Extract text from PDF using PDF.co
    console.log('Step 1: Extracting text from PDF using PDF.co...')
    const pdfCoResponse = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
      method: 'POST',
      headers: {
        'x-api-key': 'haidarahmd@gmail.com_6m5Y008B1rO0bpaIPG7LQjwuPSFEcvAQKRb1zs6tLh9MU9o3PXWbEAgwEzUoeNWW',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: fileUrl,
        async: false
      })
    })

    const pdfCoData = await pdfCoResponse.json()
    console.log('PDF.co response status:', pdfCoResponse.status)
    console.log('PDF.co response:', JSON.stringify(pdfCoData, null, 2))
    
    if (pdfCoData.error || !pdfCoData.url) {
      console.error('PDF.co error:', pdfCoData)
      throw new Error('Failed to extract text from PDF: ' + (pdfCoData.error || 'No output URL provided'))
    }

    // Step 1.5: Fetch the actual text content from the URL provided by PDF.co
    console.log('Step 1.5: Fetching extracted text from URL:', pdfCoData.url)
    const textResponse = await fetch(pdfCoData.url)
    const extractedText = await textResponse.text()
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF')
    }

    console.log('Extracted text from PDF (first 200 chars):', extractedText.substring(0, 200) + '...')

    // Step 2: Process with ChatGPT
    console.log('Step 2: Processing with ChatGPT...')
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment')
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are an advanced HR assistant AI. Your job is to evaluate each candidate to the best of its potential and reject the candidates that do not match the company's requirements. 
for each job: please evaluate the candidates. Be very very critical of your choices. if the candidate's degree, job positions and work experience does not align with the job applying for, give candidate a very low score. Below is the full raw text of a candidate's CV:
"""

${extractedText}
"""

Your task:
1. Extract all structured information from the CV (name, email, phone, job title, skills, education, companies, etc.).
2. Format **every field as plain text** except \`ai_rating\`, which must be a number.
3. If a field contains multiple values (e.g., skills, companies, degrees), separate them using commas.
4. Ensure the phone number includes a \`+\` and appropriate country code (e.g., +92 for Pakistan, +1 for US).
5. Perform AI analysis:
   - Detect potential exaggeration or fake content in the CV (ai_content).
   - Write a complete candidate evaluation as an HR professional (ai_summary).
   - Rate the candidate out of 10 for fit and credibility (ai_rating).

Return only the following valid JSON structure (no extra text):

\`\`\`json
{
  "full_name": "Text",
  "email": "Text",
  "phone": "Text (with country code)",
  "location": "Text",
  "linkedin": "Text",
  "current_job_title": "Text",
  "years_experience": "Text",
  "skills": "Comma-separated text",
  "certifications": "Comma-separated text",
  "companies": "Comma-separated text",
  "job_titles": "Comma-separated text",
  "degrees": "Comma-separated text",
  "institutions": "Comma-separated text",
  "graduation_years": "Comma-separated text",
  "experience_level": "Text",
  "ai_rating": 0,
  "ai_summary": "Text",
  "ai_content": "Text",
  "timestamp": "${new Date().toISOString()}",
  "source": "PDF Upload"
}
\`\`\``

    const chatGPTResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    })

    console.log('ChatGPT response status:', chatGPTResponse.status)
    const chatGPTData = await chatGPTResponse.json()
    
    if (!chatGPTData.choices || !chatGPTData.choices[0]) {
      console.error('ChatGPT error:', chatGPTData)
      throw new Error('Failed to process CV with ChatGPT: ' + (chatGPTData.error?.message || 'Unknown error'))
    }

    console.log('ChatGPT response received, processing...')

    // Parse the JSON response from ChatGPT
    let candidateData
    try {
      const responseText = chatGPTData.choices[0].message.content
      console.log('Raw ChatGPT response:', responseText)
      
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/)
      const jsonText = jsonMatch ? jsonMatch[1] : responseText
      candidateData = JSON.parse(jsonText)
      console.log('Parsed candidate data:', candidateData)
    } catch (parseError) {
      console.error('Failed to parse ChatGPT response:', parseError)
      console.error('Raw ChatGPT response:', chatGPTData.choices[0].message.content)
      throw new Error('Failed to parse candidate data from AI response')
    }

    // Step 3: Store in candidates table
    console.log('Step 3: Storing candidate in database...')
    const { data: insertedCandidate, error: insertError } = await supabaseClient
      .from('candidates')
      .insert({
        full_name: candidateData.full_name || '',
        email: candidateData.email || '',
        phone: candidateData.phone || '',
        location: candidateData.location || '',
        linkedin: candidateData.linkedin || '',
        current_job_title: candidateData.current_job_title || '',
        years_experience: candidateData.years_experience || '',
        skills: candidateData.skills || '',
        certifications: candidateData.certifications || '',
        companies: candidateData.companies || '',
        job_titles: candidateData.job_titles || '',
        degrees: candidateData.degrees || '',
        institutions: candidateData.institutions || '',
        graduation_years: candidateData.graduation_years || '',
        experience_level: candidateData.experience_level || '',
        ai_rating: candidateData.ai_rating || 0,
        ai_summary: candidateData.ai_summary || '',
        ai_content: candidateData.ai_content || '',
        source: candidateData.source || 'PDF Upload',
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting candidate:', insertError)
      throw new Error('Failed to save candidate data: ' + insertError.message)
    }

    console.log('Successfully created candidate with ID:', insertedCandidate.id)
    console.log('=== CV Processing Completed Successfully ===')

    return new Response(
      JSON.stringify({ 
        success: true, 
        candidate: insertedCandidate,
        message: 'CV processed successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing CV:', error)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the edge function logs for more details'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
