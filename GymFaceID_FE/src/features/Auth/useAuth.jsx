import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const connectionStatus = "connectionDown";
    try {
      const response = await axios.post(
        "http://157.230.40.203:8080/gym-face-id-access/api/v1/auth/login",
        { username, password }
      );

      // console.log("Login Response:", response);

      if (response.status === 200 && response.data.success) {
        const token = response.data.data; // JWT Token
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const { sub, role } = payload; // Extract username & role

        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("username", sub);
        sessionStorage.setItem("selectedRole", role);

        setUser({ username: sub, role });

        return role; // Return the role
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") return connectionStatus;
      console.error("Login error:", error);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};