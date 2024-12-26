import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import ApplianceCalculator from "./ApplianceCalculator";
import Bills from "./Bills";
import Home from "./Home";
import Records from "./Records"; // Import the Records component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/appliance" element={<ApplianceCalculator />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/records" element={<Records />} /> {/* Add Records Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
