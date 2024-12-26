const express = require('express');
const supabase = require('./supabaseClient'); // Ensure this connects to your Supabase project
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    console.log('Register request received');
    console.log(`Username: ${username}, Password: [REDACTED]`); // Redacted password for security

    try {
        // Insert the user into the USERS table
        console.log('Attempting to insert user into database...');
        const { data, error } = await supabase
            .from('USERS')
            .insert([{ username, password }]) // UUID auto-generated
            .select('id, username') // Return the id (uuid) and username
            .single();

        if (error) {
            console.error('Supabase Error during registration:', error);
            return res.status(400).json({ error: error.message });
        }

        console.log('User successfully registered:', data);
        res.status(201).json({
            message: 'User registered successfully',
            user: { uuid: data.id, username: data.username },
        });
    } catch (err) {
        console.error('Internal Server Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Login request received');
    console.log(`Username: ${username}, Password: [REDACTED]`); // Redacted password for security

    try {
        // Fetch the user from the USERS table
        console.log('Attempting to fetch user from database...');
        const { data, error } = await supabase
            .from('USERS')
            .select('id, username') // Select the uuid (id) and username
            .eq('username', username)
            .eq('password', password)
            .single(); // Ensure only one record is fetched

        if (error || !data) {
            console.error('Supabase Error during login:', error);
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Rename 'id' to 'uuid' for frontend compatibility
        const user = { uuid: data.id, username: data.username };

        console.log('User successfully logged in:', user);
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Internal Server Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add Appliance
router.post("/add-bill", async (req, res) => {
    const { uuid, applianceName, powerConsumption, hoursUsed, ratePerKwh } = req.body;
  
    if (!uuid || !applianceName || !powerConsumption || !hoursUsed || !ratePerKwh) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const { data, error } = await supabase
        .from("Bills")
        .insert([
          {
            uuid,
            applianceName,
            powerConsumption,
            hoursUsed,
            ratePerKwh,
          },
        ])
        .select();
  
      if (error) {
        console.error("Error adding bill:", error);
        return res.status(500).json({ error: "Failed to add bill" });
      }
  
      res.status(201).json({ message: "Bill added successfully", bill: data[0] });
    } catch (err) {
      console.error("Internal server error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get all bills for a specific user
  router.get("/get-bills/:uuid", async (req, res) => {
    const { uuid } = req.params;
  
    try {
      const { data, error } = await supabase.from("Bills").select("*").eq("uuid", uuid);
  
      if (error) {
        console.error("Error fetching bills:", error);
        return res.status(500).json({ error: "Failed to fetch bills" });
      }
  
      const totalCost = data.reduce(
        (sum, bill) => sum + bill.powerConsumption * bill.hoursUsed * bill.ratePerKwh,
        0
      );
  
      res.status(200).json({ bills: data, totalCost: totalCost.toFixed(2) });
    } catch (err) {
      console.error("Internal server error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Update a bill
  router.put("/update-bill/:billid", async (req, res) => {
    const { billid } = req.params;
    const { applianceName, powerConsumption, hoursUsed, ratePerKwh } = req.body;
  
    try {
      const { data, error } = await supabase
        .from("Bills")
        .update({ applianceName, powerConsumption, hoursUsed, ratePerKwh })
        .eq("billid", billid)
        .select();
  
      if (error) {
        console.error("Error updating bill:", error);
        return res.status(500).json({ error: "Failed to update bill" });
      }
  
      res.status(200).json({ message: "Bill updated successfully", bill: data[0] });
    } catch (err) {
      console.error("Internal server error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Delete a bill
  router.delete("/delete-bill/:billid", async (req, res) => {
    const { billid } = req.params;
  
    try {
      const { error } = await supabase.from("Bills").delete().eq("billid", billid);
  
      if (error) {
        console.error("Error deleting bill:", error);
        return res.status(500).json({ error: "Failed to delete bill" });
      }
  
      res.status(200).json({ message: "Bill deleted successfully" });
    } catch (err) {
      console.error("Internal server error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Add a new bill record
// Add a new record
router.post("/add-record", async (req, res) => {
  const { uuid, month, amount } = req.body;

  if (!uuid || !month || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from("RECORDS")
      .insert([{ uuid, month, amount }])
      .select();

    if (error) {
      console.error("Error adding record:", error);
      return res.status(500).json({ error: "Failed to add record" });
    }

    res.status(201).json({ message: "Record added successfully", record: data[0] });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all records for a user
router.get("/get-records/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    const { data, error } = await supabase
      .from("RECORDS")
      .select("*")
      .eq("uuid", uuid);

    if (error) {
      console.error("Error fetching records:", error);
      return res.status(500).json({ error: "Failed to fetch records" });
    }

    res.status(200).json({ records: data });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

  

module.exports = router;
