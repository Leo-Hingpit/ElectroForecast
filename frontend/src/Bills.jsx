import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const [editBill, setEditBill] = useState(null); // Tracks the current bill being edited
  const [formState, setFormState] = useState({
    applianceName: "",
    powerConsumption: "",
    hoursUsed: "",
    ratePerKwh: "",
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser(user);
      fetchBills(user.uuid);
    } else {
      setError("You must be logged in to view your bills.");
    }
  }, []);

  // Fetch all bills for the logged-in user
  const fetchBills = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:3000/auth/get-bills/${uuid}`);
      const data = await response.json();

      if (response.status === 200) {
        const updatedBills = data.bills.map((bill) => ({
          ...bill,
          cost: (bill.powerConsumption * bill.hoursUsed * bill.ratePerKwh).toFixed(2),
        }));

        setBills(updatedBills);

        // Calculate total cost
        const total = updatedBills.reduce((sum, bill) => sum + parseFloat(bill.cost), 0);
        setTotalCost(total.toFixed(2));
      } else {
        setError(data.error || "Failed to fetch bills.");
      }
    } catch (err) {
      setError("An error occurred while fetching bills.");
    }
  };

  // Handle deleting a bill
  const handleDelete = async (billid) => {
    try {
      const response = await fetch(`http://localhost:3000/auth/delete-bill/${billid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedBills = bills.filter((bill) => bill.billid !== billid);
        setBills(updatedBills);

        // Recalculate total cost
        const newTotal = updatedBills.reduce((sum, bill) => sum + parseFloat(bill.cost), 0);
        setTotalCost(newTotal.toFixed(2));
      } else {
        setError("Failed to delete the bill.");
      }
    } catch {
      setError("An error occurred while deleting the bill.");
    }
  };

  // Handle starting to edit a bill
  const handleEdit = (bill) => {
    setEditBill(bill.billid);
    setFormState({
      applianceName: bill.applianceName,
      powerConsumption: bill.powerConsumption.toString(),
      hoursUsed: bill.hoursUsed.toString(),
      ratePerKwh: bill.ratePerKwh.toString(),
    });
  };

  // Handle updating a bill
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Ensure numeric values are parsed
      const updatedPowerConsumption = parseFloat(formState.powerConsumption);
      const updatedHoursUsed = parseFloat(formState.hoursUsed);
      const updatedRatePerKwh = parseFloat(formState.ratePerKwh);

      const response = await fetch(
        `http://localhost:3000/auth/update-bill/${editBill}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applianceName: formState.applianceName,
            powerConsumption: updatedPowerConsumption,
            hoursUsed: updatedHoursUsed,
            ratePerKwh: updatedRatePerKwh,
          }),
        }
      );

      if (response.ok) {
        const updatedBills = bills.map((bill) =>
          bill.billid === editBill
            ? {
                ...bill,
                applianceName: formState.applianceName,
                powerConsumption: updatedPowerConsumption,
                hoursUsed: updatedHoursUsed,
                ratePerKwh: updatedRatePerKwh,
                cost: (updatedPowerConsumption * updatedHoursUsed * updatedRatePerKwh).toFixed(2),
              }
            : bill
        );

        setBills(updatedBills);

        // Recalculate total cost
        const newTotalCost = updatedBills.reduce(
          (sum, bill) => sum + parseFloat(bill.cost),
          0
        );
        setTotalCost(newTotalCost.toFixed(2));

        setEditBill(null); // Clear edit state
      } else {
        setError("Failed to update the bill.");
      }
    } catch (err) {
      setError("An error occurred while updating the bill.");
    }
  };

  return (
    <div>
      <Navbar user={user} />
      <h2>Your Bills</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Appliance Name</th>
            <th>Power Consumption</th>
            <th>Hours Used</th>
            <th>Rate Per kWh</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.billid}>
              <td>{bill.applianceName}</td>
              <td>{bill.powerConsumption}</td>
              <td>{bill.hoursUsed}</td>
              <td>{bill.ratePerKwh}</td>
              <td>{bill.cost}</td>
              <td>
                <button onClick={() => handleEdit(bill)}>Edit</button>
                <button onClick={() => handleDelete(bill.billid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Cost: ₱{totalCost}</h3>

      {/* Edit Form */}
      {editBill && (
        <form onSubmit={handleUpdate}>
          <h3>Edit Bill</h3>
          <label>Appliance Name:</label>
          <input
            type="text"
            value={formState.applianceName}
            onChange={(e) => setFormState({ ...formState, applianceName: e.target.value })}
            required
          />
          <label>Power Consumption:</label>
          <input
            type="number"
            value={formState.powerConsumption}
            onChange={(e) => setFormState({ ...formState, powerConsumption: e.target.value })}
            required
          />
          <label>Hours Used:</label>
          <input
            type="number"
            value={formState.hoursUsed}
            onChange={(e) => setFormState({ ...formState, hoursUsed: e.target.value })}
            required
          />
          <label>Rate Per kWh:</label>
          <input
            type="number"
            value={formState.ratePerKwh}
            onChange={(e) => setFormState({ ...formState, ratePerKwh: e.target.value })}
            required
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditBill(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Bills;
