import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signin");
  };

  return (
    <div className="App">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="main-content">
        {user ? (
          <h1>Welcome, {user.username}!</h1>
        ) : (
          <>
            <h1>Welcome to the Electrical Bill System</h1>
            <p>Manage your appliances, track your bills, and forecast your usage.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
