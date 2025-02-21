import { useState } from "react";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { Toaster } from "react-hot-toast";

function App() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <>
      <Toaster position="top-right" />
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
            <LoginForm />
          ) : (
            <RegisterForm setMode={setMode} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
