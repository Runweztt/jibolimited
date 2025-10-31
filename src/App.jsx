// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import About from "./Pages/About";
import Finance from "./Pages/Finance/Finance";
import Logistics from "./Pages/Logistics/Logistics";
import Contact from "./Pages/Contact";
import Footer from "./Components/Footer";
import Jibochatbot from "./Pages/Jibochatbot";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute"; // keep for other uses
import Home from "./Components/Home";

const App = () => {
  return (
    <div className="font-sans bg-gray-950 text-white min-h-screen">
      <AuthProvider>
        <Navbar />

        <Jibochatbot />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* PUBLIC: pages are viewable by everyone */}
          <Route path="/finance" element={<Finance />} />
          <Route path="/logistics" element={<Logistics />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Example of how to use ProtectedRoute elsewhere:
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          */}
        </Routes>

        <Footer />
      </AuthProvider>
    </div>
  );
};

export default App;
