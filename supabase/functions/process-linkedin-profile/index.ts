
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ProcessProfileRequest {
  profileUrl: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileUrl, userId }: ProcessProfileRequest = await req.json();

    if (!profileUrl || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: profileUrl, userId" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // For now, we'll create a basic lead entry
    // In a real implementation, you would scrape or use LinkedIn API to get profile data
    const leadData = {
      user_id: userId,
      full_name: "LinkedIn Profile", // This would be extracted from LinkedIn
      prospect_status: "Lead",
      linkedin_url: profileUrl,
      notes: `Profile imported from LinkedIn: ${profileUrl}`,
    };

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (leadError) {
      console.error("Error creating lead:", leadError);
      throw leadError;
    }

    console.log("LinkedIn profile processed successfully:", lead);

    return new Response(
      JSON.stringify({ 
        success: true, 
        lead,
        message: "LinkedIn profile processed successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error processing LinkedIn profile:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
