// src/Components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Defensive logout: catch errors and log them so we know why it might fail
  const handleLogout = async () => {
    try {
      await logout();         // ensure logout() returns a Promise (eg. signOut(auth))
      navigate("/");         // navigate after successful logout
    } catch (err) {
      // surface the error so it's visible in DevTools
      console.error("Logout failed:", err);
      // optionally display a UI error state here
    }
  };

  // small helper: image onError fallback to console and mark hidden so SVG fallback shows
  const imgOnError = (e) => {
    console.warn("Img failed to load:", e?.target?.src);
    e.target.style.display = "none";
  };

  return (
    <div className="absolute top-0 left-0 w-full z-50  bg-[#0b1020]"> {/* bumped z-index */}
      <div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32">
        {/* Logo */}
        <img src={assets.logo} alt="logo" className="w-9 md:w-20" onError={imgOnError} />

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-white font-medium">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          <Link to="/about" className="hover:text-blue-400 transition">About</Link>
          <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
          <Link to="/finance" className="hover:text-blue-400 transition">Finance</Link>
          <Link to="/logistics" className="hover:text-blue-400 transition">Logistics</Link>
        </ul>

        {/* Auth Button (desktop) */}
        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="hidden md:block bg-red-600 hover:bg-red-700 px-8 py-2 rounded-full text-white font-semibold transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-full text-white font-semibold transition"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Icon (button + fallback SVG) */}
        <button
          onClick={() => setShowMobileMenu(true)}
          className="md:hidden w-8 h-8 p-1 flex items-center justify-center cursor-pointer"
          aria-label="Open menu"
        >
          {/* primary: external asset */}
          <img
            src={assets.menu_icon}
            alt="menu"
            className="w-7 h-7"
            onError={imgOnError}
            style={{ display: assets?.menu_icon ? "block" : "none" }}
          />

          {/* fallback: inline SVG (shows if image fails) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-7 h-7 text-white"
            fill="currentColor"
            role="img"
            aria-hidden="true"
          >
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full bg-[#0b0b25] text-white transition-all duration-300 ease-in-out shadow-lg ${
          showMobileMenu ? "w-64" : "w-0 overflow-hidden"
        }`}
        style={{ zIndex: 60 }}
      >
        <div className="flex justify-end p-6 cursor-pointer">
          <img
            src={assets.cross_icon}
            onClick={() => setShowMobileMenu(false)}
            className="w-6"
            alt="close"
            onError={imgOnError}
          />
        </div>

        <ul className="flex flex-col items-center gap-6 text-lg font-medium mt-5">
          <Link onClick={() => setShowMobileMenu(false)} to="/">Home</Link>
          <Link onClick={() => setShowMobileMenu(false)} to="/about">About</Link>
          <Link onClick={() => setShowMobileMenu(false)} to="/contact">Contact</Link>
          <Link onClick={() => setShowMobileMenu(false)} to="/finance">Finance</Link>
          <Link onClick={() => setShowMobileMenu(false)} to="/logistics">Logistics</Link>

          {user ? (
            <button
              onClick={async () => {
                // await logout to ensure navigation happens after signout
                await handleLogout();
                setShowMobileMenu(false);
              }}
              className="mt-4 bg-red-600 hover:bg-red-700 px-8 py-2 rounded-full text-white font-semibold transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setShowMobileMenu(false);
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-full text-white font-semibold transition"
            >
              Sign In
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
