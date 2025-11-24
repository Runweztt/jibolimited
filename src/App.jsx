
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Finance from "./Pages/Finance/Finance";
import Logistics from "./Pages/Logistics/Logistics";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Footer from "./Components/Footer";
import Jibochatbot from "./Pages/Jibochatbot";
import { AuthProvider } from "./Context/AuthContext";

const App = () => (
  <div className="font-sans bg-gray-950 text-white min-h-screen">
    <AuthProvider>
      <Navbar />
      <Jibochatbot />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* PUBLIC: finance and logistics must be public pages */}
        <Route path="/finance" element={<Finance />} />
        <Route path="/logistics" element={<Logistics />} />

        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* keep other routes here */}
      </Routes>

      <Footer />
    </AuthProvider>
  </div>
);

export default App;
