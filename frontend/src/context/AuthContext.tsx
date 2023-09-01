import React, { createContext, ReactNode, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import * as settings from "../settings";
import axios from "axios";

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextProps {
  user: any | null; // Replace 'any' with your User type
  authTokens: AuthTokens | null;
  loginUser: (e: React.FormEvent) => Promise<void>;
  logoutUser: () => void;
  loading: boolean;
}

// Create the context with initial undefined values
export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedTokens = localStorage.getItem("authTokens");
  const parsedTokens = storedTokens ? JSON.parse(storedTokens) : null;
  let [user, setUser] = useState(() =>
    parsedTokens ? jwtDecode(parsedTokens.access) : null
  );
  let [authTokens, setAuthTokens] = useState<AuthTokens | null>(parsedTokens);
  let [loading, setLoading] = useState(!authTokens);
  const navigate = useNavigate();

  // For the initial load
  useEffect(() => {
    if (loading) {
      if (authTokens) {
        updateToken().then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [loading, authTokens]);

  // For refreshing tokens at intervals
  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 10 * 1; // 4 minutes
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [authTokens]);

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const response = await fetch(settings.API_SERVER + "/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username: target.username.value,
        password: target.password.value,
      }),
    });
    const data = await response.json();

    if (data) {
      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      navigate("/");
    } else {
      alert("Something went wrong while loggin in the user!");
    }
    setLoading(false);
  };

  const logoutUser = () => {
    setLoading(true);
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    navigate("/login");
    setLoading(false);
  };

  const contextData: AuthContextProps = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    loading: loading,
  };

  const updateToken = async () => {
    try {
      const response = await axios.post(
        `${settings.API_SERVER}/api/token/refresh/`,
        { refresh: authTokens?.refresh },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          logoutUser();
        }
      }
    }

    if (loading) {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
