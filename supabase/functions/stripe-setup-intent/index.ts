import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.20.0"; // Use a specific version
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  // Stripe SDK Deno runtime configuration
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2023-10-16", // Use a fixed API version
});

interface Profile {
  id: string;
  stripe_customer_id?: string;
  // add other profile fields if needed for context, e.g., email
  email?: string; 
}

async function getOrCreateStripeCustomer(
  supabaseClient: SupabaseClient,
  userId: string,
  userEmail?: string
): Promise<string> {
  // 1. Check if user already has a stripe_customer_id in their profile
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles") // ASSUMPTION: using 'profiles' table
    .select("stripe_customer_id, email") // Also fetch email if needed for Stripe customer creation
    .eq("id", userId)
    .single<Profile>();

  if (profileError && profileError.code !== "PGRST116") { // PGRST116: row not found
    console.error("Error fetching profile:", profileError);
    throw new Error("Error fetching user profile: " + profileError.message);
  }

  if (profile?.stripe_customer_id) {
    console.log("Found existing Stripe Customer ID:", profile.stripe_customer_id);
    return profile.stripe_customer_id;
  }

  // 2. Create a new Stripe customer if none exists
  console.log("No Stripe Customer ID found, creating new one...");
  const customerParams: Stripe.CustomerCreateParams = {};
  if (userEmail || profile?.email) {
    customerParams.email = userEmail || profile?.email;
  }
  // You can add more details like name, metadata (linking to Supabase user ID)
  customerParams.metadata = {
    supabase_user_id: userId,
  };

  const customer = await stripe.customers.create(customerParams);
  console.log("Created Stripe Customer:", customer.id);

  // 3. Save the new stripe_customer_id to the user's profile
  const { error: updateProfileError } = await supabaseClient
    .from("profiles") // ASSUMPTION: using 'profiles' table
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  if (updateProfileError) {
    console.error("Error updating profile with Stripe Customer ID:", updateProfileError);
    // Don't throw here, as the customer was created. Log and proceed.
    // Critical error, but the main goal (customer creation for SI) is achieved.
  }
  return customer.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User authentication error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("User authenticated:", user.id, user.email);

    const stripeCustomerId = await getOrCreateStripeCustomer(supabase, user.id, user.email);

    // Create a SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      // usage: 'on_session', // or 'off_session' if you plan to charge later
      automatic_payment_methods: { enabled: true }, // Recommended by Stripe
    });

    console.log("Created SetupIntent:", setupIntent.id);

    return new Response(
      JSON.stringify({
        clientSecret: setupIntent.client_secret,
        stripeCustomerId: stripeCustomerId, // good to return for client-side reference
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in Stripe SetupIntent function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}); 