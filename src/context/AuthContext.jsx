import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medicore-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // Placeholder login — Step 2 me isko services/authService.js se connect karenge (backend API call)
  const login = async (email, password) => {
    setLoading(true);
    try {
      // TODO: replace with real axios call -> services/authService.js
      const fakeUser = { name: 'Dr. Admin', email, role: 'admin' };
      setUser(fakeUser);
      localStorage.setItem('medicore-user', JSON.stringify(fakeUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicore-user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
