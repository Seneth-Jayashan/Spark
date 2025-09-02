// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios"; // Axios instance
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // logged-in user object
  const [loading, setLoading] = useState(true); // initial auth check
  const [error, setError] = useState(null);

  // ---- Refresh token & auto-login ----
  const refreshToken = async () => {
    try {
      const res = await api.post("/auth/refresh"); // server reads httpOnly cookie
      if (res.data.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Refresh failed", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  // ---- SIGNUP ----
  const signup = async (formData) => {
    try {
      setError(null);
      const res = await api.post("/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Signup only sends email verification, no tokens stored yet
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      setError(msg);
      throw new Error(msg);
    }
  };

  // ---- LOGIN ----
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post("/auth/signin", { email, password });
      // server sets httpOnly refresh token cookie
      if (res.data.user) setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      throw new Error(msg);
    }
  };

  // ---- LOGOUT ----
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // server clears refresh token cookie
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  // ---- EMAIL VERIFICATION ----
  const verifyEmail = async (token) => {
    try {
      const res = await api.post(`/auth/verify/${token}`);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Email verification failed";
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        signup,
        login,
        logout,
        verifyEmail,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
