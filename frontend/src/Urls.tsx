import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import PasswordUpdate from "./components/PasswordUpdate";
import { Props } from "./App";

const Urls: React.FC<Props> = (props) => {
  const PrivateElement: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return props.isAuthenticated ? (
      <>{children}</>
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login {...props} />} />
          <Route
            path="/"
            element={
              <PrivateElement>
                <Home {...props} />
              </PrivateElement>
            }
          />
          <Route
            path="/update_password"
            element={
              <PrivateElement>
                <PasswordUpdate {...props} />
              </PrivateElement>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Urls;