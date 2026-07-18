import { createContext, useContext, useState } from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);

      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    const res = await api.post("/auth/register", data);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
