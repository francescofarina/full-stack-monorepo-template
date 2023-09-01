import React, { ReactNode, useState, useContext } from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

//@ts-ignore
interface PrivateRouteProps extends RouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const context = useContext(AuthContext);

  if (!context) {
    return <div>Error: Context not provided</div>; // Or handle this scenario differently
  }

  const { user } = context;

  return !user ? <Navigate to="/login" /> : <>{children}</>;
};

export default PrivateRoute;
