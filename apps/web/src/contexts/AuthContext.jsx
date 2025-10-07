import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCalled = useRef(false);


  // ---- Auto-login & token refresh ----
  const refreshToken = async () => {
    try {
      const res = await api.post("/auth/refresh");
      const token = res.data.accessToken;

      if (token) {
        sessionStorage.setItem("accessToken", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        await fetchMe(); // fetch user after refresh
      } else {
        setUser(null);
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Refresh failed", err);
      setUser(null);
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // ---- Get current logged-in user ----
  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      console.error("Fetch user failed", err);
      setUser(null);
      return null;
    }
  };

  // ---- Update profile ----
  const updateProfile = async (formData) => {
    try {
      const res = await api.put("/auth/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = res.data?.user || res.data;
      setUser(updated);
      sessionStorage.setItem("user", JSON.stringify(updated));
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || "Profile update failed";
      setError(msg);
      throw new Error(msg);
    }
  };

  // ---- FORGOT PASSWORD ----
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const res = await api.post("/auth/forgotpassword", { email });
      return res.data; // { message: "Reset link sent successfully" }
    } catch (err) {
      const msg = err.response?.data?.message || "Forgot password failed";
      setError(msg);
      throw new Error(msg);
    }
  };

  // ---- RESET PASSWORD ----
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      const res = await api.post(`/auth/reset-password/${token}`, { password: newPassword });
      return res.data; // { message: "Password reset successful" }
    } catch (err) {
      const msg = err.response?.data?.message || "Reset password failed";
      setError(msg);
      throw new Error(msg);
    }
  };

  // ---- SIGNUP ----
  const signup = async (formData) => {
    try {
      setError(null);
      const res = await api.post("/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

      if (res.data.accessToken) sessionStorage.setItem("accessToken", res.data.accessToken);
      if (res.data.user) {
        setUser(res.data.user);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }

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
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
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

  // ---- INIT ----
  useEffect(() => {
    if (!refreshCalled.current) {
      refreshCalled.current = true;
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      refreshToken();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        fetchMe,
        updateProfile,
        signup,
        login,
        logout,
        verifyEmail,
        refreshToken,
        forgotPassword,  // ✅
        resetPassword,   // ✅
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
