import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ activeTheme }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSigningUp) {
        // Basic validation
        if (!username || !email || !password) {
          throw new Error("All fields are required");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        // Check username uniqueness
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", username)
          .single();

        if (existingUser) {
          throw new Error("Username already exists");
        }

        // Create auth user
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { username },
            },
          });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error("Failed to create user");

        // Create profile row
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: signUpData.user.id,
            username,
            email,
            global_streak: 0,
            global_max_streak: 0,
          },
        ]);

        if (profileError) throw profileError;

        setSuccessMessage("Account created successfully! Logging you in...");

        // Auto-login after sign up
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (loginError) throw loginError;
        if (!loginData.session) throw new Error("Login failed after signup");

        navigate("/");
        return;
      }

      // LOGIN FLOW
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      // Look up email by username
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", username)
        .single();

      if (profileError || !profile) {
        throw new Error("Invalid username or password");
      }

      // Login with email/password
      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: profile.email,
          password,
        });

      if (signInError) throw signInError;
      if (!authData.session) {
        throw new Error("Login failed. Please check your credentials.");
      }
      console.log("success!", authData);
      navigate("/");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`h-screen flex flex-col items-center justify-center ${activeTheme.background.app}`}
    >
      <div
        className={`w-full max-w-md ${activeTheme.background.secondary} ${activeTheme.border.card} shadow-md rounded-lg p-6`}
      >
        <h2
          className={`text-2xl ${activeTheme.text.primary} font-bold mb-4 text-center`}
        >
          {isSigningUp ? "Sign Up" : "Login"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Username Field */}
          <div>
            <label
              className={`${activeTheme.text.secondary} block mb-1 font-semibold`}
            >
              Username
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email only for signup */}
          {isSigningUp && (
            <div>
              <label
                className={`${activeTheme.text.secondary} block mb-1 font-semibold`}
              >
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (required only for signup)"
                required
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label
              className={`${activeTheme.text.secondary} block mb-1 font-semibold`}
            >
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${activeTheme.button.accent2} ${activeTheme.text.primary} mt-4 py-2 rounded transition disabled:opacity-50`}
          >
            {loading ? "Loading..." : isSigningUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            className={`${activeTheme.text.accent1} hover:underline`}
            onClick={() => {
              setIsSigningUp(!isSigningUp);
              setError(null);
              setSuccessMessage(null);
            }}
          >
            {isSigningUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
