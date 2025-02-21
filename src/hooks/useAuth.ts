// src/hooks/useAuth.ts
import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post("/api/auth/login", credentials);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      // Set default authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post("/api/auth/register", data);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));

// Optional: Initialize auth state on app load
export const initializeAuth = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get("/api/auth/me");
    useAuth.setState({ user: response.data, isAuthenticated: true });
  } catch (error) {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }
};
