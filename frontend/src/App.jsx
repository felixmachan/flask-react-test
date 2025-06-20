import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom"; // Router, useNavigate
import { useEffect, useState } from "react";
import BasicExample from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import Appointments from "./components/Appointments.jsx";
import Contact from "./components/Contact.jsx";
import Home from "./components/Home.jsx";
import Services from "./components/Services.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Profile from "./components/Profile.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import ConfirmEmail from "./components/ConfirmEmail.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";

// 👇 Új komponens, ami Router-en belül lesz, így működik benne a useNavigate

function App() {
  return (
    <div className="root">
      <Router>
        <AuthProvider>
          <BasicExample />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/confirm/:token" element={<ConfirmEmail />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
