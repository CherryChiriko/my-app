import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Load initial session + subscribe to changes
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, data) => {
      setSession(data.session ?? null);

      // auto-redirect on login
      if (event === "SIGNED_IN") {
        navigate("/", { replace: true });
      }
      if (event === "SIGNED_OUT") {
        navigate("/", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // SIGNUP
  const signup = useCallback(async (username, email, password) => {
    setAuthLoading(true);
    setError(null);

    try {
      // Username uniqueness
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (existing) throw new Error("Username already exists");

      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: { username },
          },
        }
      );

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Failed to create user");

      // Create profile record
      const { error: pErr } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          email,
          username,
          global_streak: 0,
          global_max_streak: 0,
        },
      ]);
      if (pErr) throw pErr;

      // Auto-login happens because session is returned
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // LOGIN
  const login = useCallback(async (username, password) => {
    setAuthLoading(true);
    setError(null);

    try {
      // Lookup email
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", username)
        .single();

      if (pErr || !profile) throw new Error("Invalid username or password");

      // Login with email+password
      const { data: authData, error: sErr } =
        await supabase.auth.signInWithPassword({
          email: profile.email,
          password,
        });

      if (sErr) throw sErr;
      if (!authData.session) throw new Error("Login failed");

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    loading, // initial session check
    authLoading, // login/signup in progress
    error,
    login,
    signup,
    logout,
  };
}
