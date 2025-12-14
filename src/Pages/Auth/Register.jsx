
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../../Firebase";
import { useNavigate, Link } from "react-router-dom";


const Register = () => {
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error display
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("handleRegister started");
    setError("");
    setLoading(true);

    try {
      console.log("Creating user with email:", email);
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log("User created successfully:", user.uid);

      // Save user info to Firestore with timeout
      console.log(" Saving user data to Firestore...");
      try {
        // Add a timeout to prevent hanging
        await Promise.race([
          setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            email,
            createdAt: new Date(),
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Firestore timeout")), 3000)
          )
        ]);
        console.log(" User data saved to Firestore");
      } catch (firestoreError) {
        console.error(" Firestore error:", firestoreError);
        console.warn(" Continuing without saving to Firestore. Please check Firestore rules.");
        // Continue anyway - user is created in Auth
      }

      // Wait a moment for auth state to propagate
      // This prevents race condition with ProtectedRoute
      console.log(" Waiting for auth state to propagate...");
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(" Auth state should be ready");

      // Redirect after success with replace to prevent back button issues
      console.log("Navigating to /finance...");
      navigate("/finance", { replace: true });
      console.log(" Navigate called");
    } catch (err) {
      console.error(" Registration error:", err);
      let msg = "Failed to register.";
      if (err.code === "auth/email-already-in-use") msg = "This email is already registered.";
      if (err.code === "auth/weak-password") msg = "Password should be at least 6 characters.";
      if (err.code === "auth/invalid-email") msg = "Invalid email address.";
      setError(msg);
      setLoading(false);
    }
    // Note: Don't set loading to false on success - let navigation happen
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document exists, if not create it (with timeout)
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await Promise.race([
          getDoc(userDocRef),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Firestore timeout")), 3000)
          )
        ]);

        if (!userDoc.exists()) {
          // New user - save their info (with timeout)
          const nameParts = user.displayName?.split(" ") || ["", ""];
          await Promise.race([
            setDoc(userDocRef, {
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" ") || "",
              email: user.email,
              createdAt: new Date(),
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Firestore timeout")), 3000)
            )
          ]);
        }
      } catch (firestoreError) {
        console.warn(" Firestore error during Google sign-in:", firestoreError);
        console.warn(" Continuing without Firestore. Please check Firestore rules.");
      }

      // Wait for auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to finance page
      navigate("/finance", { replace: true });
    } catch (err) {
      console.error(err);
      let msg = "Failed to sign in with Google.";
      if (err.code === "auth/popup-closed-by-user") msg = "Sign-in cancelled.";
      if (err.code === "auth/popup-blocked") msg = "Popup blocked. Please allow popups for this site.";
      setError(msg);
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030318]">
      <div className="bg-[#0b0b25] p-8 rounded-2xl w-96 border border-blue-900 shadow-2xl">
        <h1 className="text-2xl text-center font-bold mb-6 text-blue-400">
          Create Account
        </h1>

        {error && <p className="text-red-400 text-sm mb-3 bg-red-900/20 p-2 rounded border border-red-900/50">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            className="input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            className="input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            required
          />

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
            placeholder="Password (min 6 chars)"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-2.5 rounded-lg font-semibold transition-colors ${
              loading 
                ? "bg-blue-800 text-blue-300 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
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
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
