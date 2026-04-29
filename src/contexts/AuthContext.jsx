import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  async function login(email, senha) {
    try {
      setAuthLoading(true);

      const response = await api.post("/login", {
        email,
        password: senha,
      });

      const token = response.data?.token;
      const educator = response.data?.educator;

      if (!token || !educator) {
        return false;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(educator));

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(educator);

      return true;
    } catch (error) {
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common.Authorization;
  }

  const value = useMemo(
    () => ({
      user,
      authLoading,
      login,
      logout,
      setUser,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  }
  return ctx;
}