// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [authChanged, setAuthChanged] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("AuthContext useEffect: token:", token);
    if (!token) {
      setUser(null);
      return;
    }
    console.log(token);
    axios
      .get("http://localhost:5000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(
          "AuthContext: token invalid, removing it.",
          err?.response?.status
        );
        localStorage.removeItem("token"); // <<< EZ KELL!
        setUser(null);
      });
  }, []);

  const login = (userData, token) => {
    console.log("LOGIN: userData érkezett:", userData);
    localStorage.setItem("token", token);
    setUser(userData);
    setAuthChanged((prev) => prev + 1); // trigger újra
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setAuthChanged((prev) => prev + 1);
    navigate("/"); // vagy "/login", ha azt szeretnéd
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
