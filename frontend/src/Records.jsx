import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./App.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Records = () => {
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser(user);
      fetchRecords(user.uuid);
    } else {
      setError("You must be logged in to view your records.");
    }
  }, []);

  const fetchRecords = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:3000/auth/get-records/${uuid}`);
      const data = await response.json();

      if (response.status === 200) {
        setRecords(data.records);
      } else {
        setError(data.error || "Failed to fetch records.");
      }
    } catch (err) {
      setError("An error occurred while fetching records.");
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();

    try {
      const formattedMonth = `${month}-01`; // Ensure valid date format

      const response = await fetch("http://localhost:3000/auth/add-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: user.uuid,
          month: formattedMonth,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setRecords([...records, data.record]);
        setMonth("");
        setAmount("");
      } else {
        setError("Failed to add record.");
      }
    } catch {
      setError("An error occurred while adding the record.");
    }
  };

  const chartData = {
    labels: records.map((record) => record.month), // X-axis: Months
    datasets: [
      {
        label: "Monthly Electrical Bill",
        data: records.map((record) => record.amount), // Y-axis: Amounts
        borderColor: "blue",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div>
      <Navbar user={user} />
      <h2>Monthly Electrical Bill Records</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Line Chart */}
      <div style={{ width: "80%", margin: "0 auto" }}>
        {records.length > 0 ? <Line data={chartData} /> : <p>No records found.</p>}
      </div>

      {/* Add Record Form */}
      <form onSubmit={handleAddRecord} className="form-container">
        <h3>Add New Record</h3>
        <label>Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        <label>Amount Paid:</label>
        <input
          type="number"
          placeholder="e.g., 1500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Add Record</button>
      </form>
    </div>
  );
};

export default Records;
