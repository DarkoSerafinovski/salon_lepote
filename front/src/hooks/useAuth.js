// hooks/useAuth.js
import { useState } from "react";
import api from "../api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthSuccess = (response) => {
    const { access_token, type, data } = response.data;
    sessionStorage.setItem("token", access_token);
    sessionStorage.setItem("user_type", type || data.type);
    sessionStorage.setItem("user_name", data.ime);
  };

  const login = async (formData) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/login", formData);
      handleAuthSuccess(response);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Greška pri prijavi");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError("");
    try {
      const { password_confirmation, ...dataToSend } = formData;
      const response = await api.post("/register", dataToSend);
      handleAuthSuccess(response);
      return { success: true };
    } catch (err) {
      const errorMessage =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Greška prilikom registracije.";
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (finalData) => {
    setLoading(true);
    try {
      await api.post("/register", finalData);
      return { success: true };
    } catch (err) {
      const errorMsg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Greška pri registraciji";
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Greška pri logout-u na serveru", error);
    } finally {
      sessionStorage.clear();
      return true;
    }
  };

  const getUserData = () => ({
    type: sessionStorage.getItem("user_type"),
    name: sessionStorage.getItem("user_name"),
  });

  return { login, register, logout, addEmployee, getUserData, loading, error };
};
