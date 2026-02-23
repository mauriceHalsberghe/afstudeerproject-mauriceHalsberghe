"use client";

import { createContext, useState, ReactNode } from "react";

type AuthUser = {
  token: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;

    const storedUser = window.localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;

    return window.localStorage.getItem("token");
  });

  function login(userData: AuthUser, jwtToken: string) {
    setUser(userData);
    setToken(jwtToken);

    if (userData) {
      window.localStorage.setItem("user", JSON.stringify(userData));
    }

    if (jwtToken) {
      window.localStorage.setItem("token", jwtToken);
    }
  }

  function logout() {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
