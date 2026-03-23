import { useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  // Initialize user directly from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("teacher-app-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Since we already checked localStorage, loading can start as false
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("teacher-app-user");
    setLoading(true);
    setUser(null);
  };

  const authInfo = {
    user,
    setUser,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
