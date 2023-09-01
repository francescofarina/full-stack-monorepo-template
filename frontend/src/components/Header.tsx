import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const context = useContext(AuthContext);

  if (!context) {
    return <div>Error: Context not provided</div>; // Or handle this scenario differently
  }

  const { user, logoutUser } = context;

  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      {user ? (
        <p onClick={logoutUser}>Logout</p>
      ) : (
        <Link to="/login">Login</Link>
      )}
      {user && <p>Hello {user.username}!</p>}
    </div>
  );
};

export default Header;
