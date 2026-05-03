import { createContext, useContext, useMemo, useState } from "react";
import { api, clearSession, getStoredUser, storeSession } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = async (payload) => {
    const data = await api.login(payload);
    storeSession(data);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    storeSession(data);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      login,
      register,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
