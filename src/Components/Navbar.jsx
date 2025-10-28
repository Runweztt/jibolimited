import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setShowMobileMenu(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const imgOnError = (e) => {
    console.warn("Img failed to load:", e?.target?.src);
    e.target.style.display = "none";
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-[#0b1020] shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32">
        {/* Logo */}
        <img
          src={assets.logo}
          alt="logo"
          className="w-9 md:w-20 cursor-pointer"
          onClick={() => navigate("/")}
          onError={imgOnError}
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-white font-medium">
          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-400 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-400 transition">
            Contact
          </Link>
          <Link to="/finance" className="hover:text-blue-400 transition">
            Finance
          </Link>
          <Link to="/logistics" className="hover:text-blue-400 transition">
            Logistics
          </Link>
        </ul>

        {/* Auth Button */}
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(true)}
          className="md:hidden w-8 h-8 p-1 flex items-center justify-center cursor-pointer"
          aria-label="Open menu"
        >
          <img
            src={assets.menu_icon}
            alt="menu"
            className="w-7 h-7"
            onError={imgOnError}
            style={{ filter: "invert(1)" }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full bg-[#0b0b25] text-white transition-all duration-300 ease-in-out shadow-lg ${
          showMobileMenu ? "w-64" : "w-0 overflow-hidden"
        }`}
        style={{ zIndex: 60 }}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6 cursor-pointer">
          <button
            onClick={() => setShowMobileMenu(false)}
            aria-label="Close menu"
          >
            {assets.cross_icon ? (
              <img
                src={assets.cross_icon}
                alt="close"
                className="w-6 invert" // makes it white
                onError={imgOnError}
              />
            ) : (
              // fallback SVG (white)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M6 6L18 18M6 18L18 6" stroke="white" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>

        {/* Links */}
        <ul className="flex flex-col items-center gap-6 text-lg font-medium mt-5">
          {["Home", "About", "Contact", "Finance", "Logistics"].map((item) => (
            <Link
              key={item}
              to={`/${item === "Home" ? "" : item.toLowerCase()}`}
              onClick={() => setShowMobileMenu(false)}
              className="hover:text-blue-400 transition"
            >
              {item}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
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
