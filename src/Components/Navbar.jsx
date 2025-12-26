import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuth } from "../Context/AuthContext";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Crypto", path: "/finance" },
  { name: "Contact", path: "/contact" },
];

/**
 * Navbar Component - Built from scratch with mobile-first approach
 * 
 * Architecture:
 * - Mobile: Full-screen menu panel with CENTERED content
 * - Desktop: Horizontal navigation bar
 * - Z-Index: navbar(50) < overlay(60) < mobile-menu(70)
 * - Backgrounds: ALWAYS solid on mobile (no transparency)
 * - Animations: Smooth 500ms with fade + slide
 */
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      // Silent error - user will see auth state change
    }
  };

  return (
    <>
      {/* NAVBAR - Fixed header with solid background */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "#0b1020" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Go to home"
            >
              <img
                src={assets.jibo_currency_logo}
                alt="Jibo Currency"
                className="h-12 w-auto"
                onError={(e) => (e.target.style.display = "none")}
              />
            </button>

            {/* DESKTOP Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* DESKTOP Auth Button */}
            <div className="hidden md:block">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation("/login")}
                  className="bg-[#002B5C] hover:bg-[#003d7a] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* MOBILE Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-60 md:hidden transition-opacity duration-500"
          style={{ background: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MOBILE MENU PANEL - Centered Content */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 z-70 md:hidden transform transition-all duration-500 ease-out ${
          isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{ background: "#0b1020" }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="flex flex-col h-full">
          
          {/* Mobile Menu Header - Centered */}
          <div className="flex items-center justify-center px-4 h-16 border-b border-gray-800 relative">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-4 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Content - Centered & Vertically Aligned */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center">
            
            {/* Navigation Links - Centered */}
            <nav className="w-full max-w-md space-y-3">
              {NAV_LINKS.map((link, index) => (
                <button
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className="w-full text-center px-6 py-4 text-xl font-semibold text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isMobileMenuOpen ? 'fadeInUp 0.4s ease-out forwards' : 'none'
                  }}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Auth Section - Centered */}
            <div className="w-full max-w-md mt-12 pt-8 border-t border-gray-800">
              {user ? (
                <div className="space-y-4">
                  <div className="px-6 py-4 bg-gray-900 rounded-xl border border-gray-800 text-center">
                    <p className="text-sm text-gray-400 mb-1">Signed in as</p>
                    <p className="text-white font-semibold truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="w-full bg-[#002B5C] hover:bg-[#003d7a] text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation("/register")}
                    className="w-full border-2 border-[#002B5C] text-white hover:bg-[#002B5C]/20 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
