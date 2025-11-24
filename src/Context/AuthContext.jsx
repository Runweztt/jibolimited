// AUTH CONTEXT – LISTENS TO LOGIN/LOGOUT STATE
// Provides "user" and "logout" to all components

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Firebase";

const AuthContext = createContext();

// Hook for easy use
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores logged-in user
  const [loading, setLoading] = useState(true); // Prevents flicker

  useEffect(() => {
    // Fires whenever login/logout happens
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // Cleanup
  }, []);

  // Log user out
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {/* Don't render children until Firebase knows if user is logged in */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
