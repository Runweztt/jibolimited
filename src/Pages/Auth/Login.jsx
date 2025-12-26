import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Login = () => {
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error display
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || "/finance";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Wait for auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate(redirectPath, { replace: true });
    } catch (err) {
      let msg = "Failed to login.";
      if (err.message?.includes("Invalid login credentials")) {
        msg = "Invalid email or password.";
      } else if (err.message?.includes("Email not confirmed")) {
        msg = "Please verify your email address.";
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/finance`,
        }
      });

      if (error) throw error;

      // OAuth will redirect, so we don't need to navigate manually
    } catch (err) {
      let msg = "Failed to sign in with Google.";
      if (err.message) {
        msg = err.message;
      }
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030318]">
      <div className="bg-[#0b0b25] p-8 rounded-2xl w-96 border border-blue-900 shadow-2xl">
        <h1 className="text-2xl text-center font-bold mb-6 text-blue-400">
          Login to Jibo
        </h1>

        {error && <p className="text-red-400 text-sm mb-3 bg-red-900/20 p-2 rounded border border-red-900/50">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-2.5 rounded-lg font-semibold transition-colors ${
              loading 
                ? "bg-blue-800 text-blue-300 cursor-not-allowed" 
                : "bg-[#002B5C] hover:bg-[#003d7a] text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            loading 
              ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
              : "bg-white hover:bg-gray-100 text-gray-900"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
