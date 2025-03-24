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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Only navigate if we're on the homepage
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/login"
      ) {
        navigate("/dashboard");
      }
    }
    setIsLoading(false);
  }, []); // Empty dependency array - run only once on mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Auth page component
  const AuthPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                width="48"
                height="48"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 3C8.82 3 3 8.82 3 16C3 23.18 8.82 29 16 29C23.18 29 29 23.18 29 16C29 8.82 23.18 3 16 3ZM16 7C18.76 7 21 9.24 21 12C21 14.76 18.76 17 16 17C13.24 17 11 14.76 11 12C11 9.24 13.24 7 16 7ZM16 25.4C12.5 25.4 9.44 23.66 7.6 21C7.64 18.5 12.8 17.1 16 17.1C19.2 17.1 24.36 18.5 24.4 21C22.56 23.66 19.5 25.4 16 25.4Z"
                  fill="#1D4ED8"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">WingPro</h2>
            <p className="text-gray-600 mb-8">Task management made simple</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 font-medium text-center ${
                mode === "login"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 font-medium text-center ${
                mode === "register"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <div className="p-6">
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
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#333",
            borderRadius: "0.5rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />
          }
        />
        <Route
          path="/login"
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
