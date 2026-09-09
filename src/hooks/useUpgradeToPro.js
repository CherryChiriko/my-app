import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useUpgradeToPro() {
  const [status, setStatus] = useState("idle"); // idle | redirecting | error

  const getValidToken = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      throw new Error("You must be logged in to manage your subscription.");
    }

    return session.access_token;
  };

  const startCheckout = async (planId, billingCycle = "monthly") => {
    setStatus("redirecting");
    try {
      const token = await getValidToken();

      const res = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId, // 'pro' | 'ai' | 'lifetime'
            billingCycle, // 'monthly' | 'annual'
          }),
        },
      );

      const { url, error } = await res.json();
      if (error || !url) throw new Error(error || "No checkout URL returned");

      window.location.href = url; // Redirect to Stripe Checkout
    } catch (err) {
      console.error("Checkout error:", err);
      setStatus("error");
    }
  };

  const openBillingPortal = async () => {
    setStatus("redirecting");
    try {
      const token = await getValidToken();

      const res = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/create-billing-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { url, error } = await res.json();
      if (error || !url) throw new Error(error || "No portal URL returned");

      window.location.href = url; // Redirect to Stripe Billing Portal
    } catch (err) {
      console.error("Billing portal error:", err);
      setStatus("error");
    }
  };

  return { startCheckout, openBillingPortal, status };
}
