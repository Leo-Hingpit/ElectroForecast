import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <nav>
      <button onClick={() => navigate("/")}>Home</button>
      {user ? (
        <>
          <button onClick={() => navigate("/appliance")}>Appliance</button>
          <button onClick={() => navigate("/bills")}>Bills</button>
          <button onClick={() => navigate("/records")}>Records</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/signin")}>Sign In</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
