import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    () =>
      localStorage.getItem("medicore-token") ||
      sessionStorage.getItem("medicore-token")
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================
  // Restore User Session
  // ==========================
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken =
        localStorage.getItem("medicore-token") ||
        sessionStorage.getItem("medicore-token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();

        setUser(res.user || res.data || null);
        setToken(savedToken);
      } catch (err) {
        console.error("Session Restore Error:", err);

        localStorage.removeItem("medicore-token");
        sessionStorage.removeItem("medicore-token");

        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ==========================
  // Login
  // ==========================
  const login = async (email, password, rememberMe) => {
    setError(null);

    try {
      const res = await authService.login(email, password);

      console.log("LOGIN RESPONSE:", res);

      setUser(res.user);
      setToken(res.token);

      if (rememberMe) {
        localStorage.setItem("medicore-token", res.token);
        sessionStorage.removeItem("medicore-token");
      } else {
        sessionStorage.setItem("medicore-token", res.token);
        localStorage.removeItem("medicore-token");
      }

      return {
        success: true,
      };
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const message =
        err.response?.data?.message || "Login failed, please try again";

      setError(message);

      return {
        success: false,
        error: message,
      };
    }
  };

  // ==========================
  // Logout
  // ==========================
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    setToken(null);

    localStorage.removeItem("medicore-token");
    sessionStorage.removeItem("medicore-token");
  };

  // ==========================
  // Refresh User
  // ==========================
  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      setUser(res.user || res.data || null);
    } catch (err) {
      console.error("Refresh User Error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================
// Custom Hook
// ==========================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};