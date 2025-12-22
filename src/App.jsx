
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Finance from "./Pages/Finance/Finance";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Footer from "./Components/Footer";
import Jibochatbot from "./Pages/Jibochatbot";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => (
  <div className="font-sans bg-gray-950 text-white min-h-screen">
    <AuthProvider>
      <Navbar />
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* PROTECTED: finance must be a private page */}
        <Route path="/finance" element={
          <ProtectedRoute>
            <Finance />
          </ProtectedRoute>
        } />

        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* keep other routes here */}
      </Routes>
      <Jibochatbot />
      <Footer />
    </AuthProvider>
  </div>
);

export default App;
