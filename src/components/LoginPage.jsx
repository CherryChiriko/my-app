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
        // Validate inputs
        if (!email || !username || !password) {
          throw new Error("All fields are required");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        // Check if username already exists
        const { data: existingUsername, error: usernameCheckError } =
          await supabase
            .from("profiles")
            .select("id")
            .eq("username", username)
            .single();

        if (existingUsername) {
          throw new Error("Username already exists");
        }

        // Check if email already exists in profiles
        const { data: existingEmail, error: emailCheckError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email)
          .single();

        if (existingEmail) {
          throw new Error("Email already registered");
        }

        // Sign up: create user with email & password
        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } },
          });

        if (signUpError) throw signUpError;
        if (!authData.user) throw new Error("Failed to create user");

        // Create row in "profiles" table
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            username,
            email,
            global_streak: 0,
            global_max_streak: 0,
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) throw profileError;

        setError(null);
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        // Login using username
        if (!username || !password) {
          throw new Error("Username and password are required");
        }

        // Fetch the email associated with the username
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", username)
          .single();

        if (profileError || !profile) {
          throw new Error("Username not found. Please sign up instead");
        }

        // Login with email + password
        const { data: authData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: profile.email,
            password,
          });

        if (signInError) throw signInError;

        navigate("/");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user logged in");
      }

      // Delete from profiles table
      const { error: profileDeleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileDeleteError) throw profileDeleteError;

      // Delete auth user
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
        user.id
      );

      if (authDeleteError) throw authDeleteError;

      setSuccessMessage("Account deleted successfully");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to delete account");
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
          {isSigningUp && (
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
                placeholder="Choose a username"
                required
              />
            </div>
          )}
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
                placeholder="Enter your email"
                required
              />
            </div>
          )}
          {!isSigningUp && (
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
          )}
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
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${activeTheme.button.accent2} ${activeTheme.text.primary} mt-4 py-2 rounded transition disabled:opacity-50`}
          >
            {loading ? "Loading..." : isSigningUp ? "Sign Up" : "Login"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm mt-2">{successMessage}</p>
        )}
        <div className="text-center mt-4">
          <button
            type="button"
            className={`${activeTheme.text.accent1} hover:underline`}
            onClick={() => {
              setIsSigningUp(!isSigningUp);
              setError(null);
              setEmail("");
              setUsername("");
              setPassword("");
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
