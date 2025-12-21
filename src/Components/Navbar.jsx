import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuth } from "../Context/AuthContext";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Crypto", path: "/finance" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowMobileMenu(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // disable background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "auto";
  }, [showMobileMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowMobileMenu(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const navTo = (path) => {
    navigate(path);
    setShowMobileMenu(false);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-[#0b1020]/90 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between py-3 px-6 md:px-10 lg:px-20">
        {/* Logo */}
        <button
          onClick={() => navTo("/")}
          className="flex items-center gap-3"
        >
          <img
            src={assets.logo}
            alt="Jibo logo"
            className="w-12 md:w-14"
            onError={(e) => (e.target.style.display = "none")}
          />
        </button>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-8 text-white font-medium">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => navTo(link.path)}
              className="hover:text-blue-400 transition"
            >
              {link.name}
            </button>
          ))}
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:block">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-full text-white font-semibold transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navTo("/login")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full text-white font-semibold transition"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setShowMobileMenu(true)}
          className="md:hidden p-2"
        >
          <svg
            className="w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </button>
      </div>

      {/* Overlay behind the menu */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-[400]"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <aside
        style={{ backgroundColor: '#0b1020' }}
        className={`fixed top-0 right-0 h-full w-72 text-white shadow-2xl z-[500] transform transition-transform duration-300 ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-6">
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M6 6L18 18M6 18L18 6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className="px-6">
          <ul className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => navTo(link.path)}
                  className="w-full text-left text-lg font-medium hover:text-blue-400 transition"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full text-white font-semibold transition"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navTo("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full text-white font-semibold transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navTo("/register")}
                  className="w-full border border-blue-600 text-blue-400 px-5 py-2 rounded-full font-semibold transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        
        </nav>
      </aside>
    </header>
  );
};

export default Navbar;
