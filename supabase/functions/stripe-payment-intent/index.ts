import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.20.0";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2023-10-16",
});

interface Profile {
  id: string;
  stripe_customer_id?: string;
  email?: string;
}

// (getOrCreateStripeCustomer function remains the same as in stripe-setup-intent)
async function getOrCreateStripeCustomer(
  supabaseClient: SupabaseClient,
  userId: string,
  userEmail?: string
): Promise<string> {
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles") 
    .select("stripe_customer_id, email")
    .eq("id", userId)
    .single<Profile>();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Error fetching profile:", profileError);
    throw new Error("Error fetching user profile: " + profileError.message);
  }

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const customerParams: Stripe.CustomerCreateParams = { metadata: { supabase_user_id: userId } };
  if (userEmail || profile?.email) {
    customerParams.email = userEmail || profile?.email;
  }
  const customer = await stripe.customers.create(customerParams);
  
  await supabaseClient
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);
  return customer.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, currency, description, payment_method_types } = await req.json(); // Expect amount and currency from client

    if (!amount || !currency) {
      return new Response(JSON.stringify({ error: "Missing amount or currency" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeCustomerId = await getOrCreateStripeCustomer(supabase, user.id, user.email);

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: amount, // Amount in the smallest currency unit (e.g., cents)
      currency: currency, // e.g., 'usd', 'eur'
      customer: stripeCustomerId,
      // payment_method_types: payment_method_types || ['card'], // Default to card
      automatic_payment_methods: { enabled: true }, // Stripe will manage payment method types
      description: description || "Klarus HR Payment", // Optional description
      // confirm: true, // Set to true if you want to attempt payment immediately (requires payment_method on creation)
      // setup_future_usage: 'on_session', // Optional: save card for future use if payment is one-time
    };

    // If you want to save the card even for one-time payments, add setup_future_usage
    // This is useful if you want the card to be available for later without a separate setup flow.
    // if (req.body.saveCard) { // Example: client sends a flag
    //   paymentIntentParams.setup_future_usage = 'on_session';
    // }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        stripeCustomerId: stripeCustomerId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in Stripe PaymentIntent function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}); 