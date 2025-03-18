// src/App.tsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Only navigate if we're on the homepage
      if (window.location.pathname === "/") {
        navigate("/dashboard");
      }
    }
  }, []); // Empty dependency array - run only once on mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Auth page component
  const AuthPage = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 ${
              mode === "login"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 ${
              mode === "register"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        {mode === "login" ? (
          <LoginForm
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              navigate("/dashboard");
            }}
          />
        ) : (
          <RegisterForm setMode={setMode} />
        )}
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />
          }
        />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
