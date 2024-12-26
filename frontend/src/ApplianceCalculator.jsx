import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./App.css";

const ApplianceCalculator = () => {
  const [applianceName, setApplianceName] = useState("");
  const [powerConsumption, setPowerConsumption] = useState("");
  const [hoursUsed, setHoursUsed] = useState("");
  const [ratePerKwh, setRatePerKwh] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.uuid) {
      setError("You must be logged in to save appliance data.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/add-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: user.uuid,
          applianceName,
          powerConsumption: parseFloat(powerConsumption),
          hoursUsed: parseFloat(hoursUsed),
          ratePerKwh: parseFloat(ratePerKwh),
        }),
      });

      if (response.ok) {
        setError("");
        alert("Bill added successfully!");
      } else {
        setError("Failed to add the bill.");
      }
    } catch {
      setError("An error occurred while adding the bill.");
    }
  };

  return (
    <div>
      <Navbar user={user} />
      <h2>Add Appliance Bill</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Appliance Name:</label>
        <input type="text" onChange={(e) => setApplianceName(e.target.value)} required />
        <label>Power Consumption:</label>
        <input type="number" onChange={(e) => setPowerConsumption(e.target.value)} required />
        <label>Hours Used:</label>
        <input type="number" onChange={(e) => setHoursUsed(e.target.value)} required />
        <label>Rate Per kWh:</label>
        <input type="number" onChange={(e) => setRatePerKwh(e.target.value)} required />
        <button type="submit">Add Bill</button>
      </form>
    </div>
  );
};

export default ApplianceCalculator;
