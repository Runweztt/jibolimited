

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Login = () => {
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error display
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // This remembers where the user came from before login
  const redirectPath = location.state?.from?.pathname || "/finance";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to original page
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030318]">
      <div className="bg-[#0b0b25] p-8 rounded-2xl w-96 border border-blue-900 shadow-2xl">
        <h1 className="text-2xl text-center font-bold mb-6 text-blue-400">
          Login to Jibo
        </h1>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
