const express = require('express');
const router = express.Router();
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Supabase Configuration
const supabaseUrl = 'https://svtjwxsxfvhqoaucfsmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dGp3eHN4ZnZocW9hdWNmc21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMzkwMDAsImV4cCI6MjA0OTYxNTAwMH0.-ZRnlQwqCzVIWgSB-plAZEhM-PVt9WOGFJkalDH0G84'; // Found in your Supabase dashboard
const supabase = createClient(supabaseUrl, supabaseKey);

// Flask API URL
const flaskApiUrl = "http://localhost:8080/electricity-forecast";
 // Update the URL if Flask runs on a different host/port

/**
 * Fetch records from Supabase and send them to the Flask API for forecasting.
 */
router.post('/forecast', async (req, res) => {
  try {
    // Fetch records from Supabase
    const { data: records, error } = await supabase
      .from('RECORDS')
      .select('month, amount')
      .order('month', { ascending: true });

    if (error) {
      console.error("Error fetching records:", error);
      return res.status(500).json({ error: "Failed to fetch records from the database." });
    }

    // Transform data into the required format for the Flask API
    const formattedData = records.map(record => ({
      ds: record.month, // Ensure this is in YYYY-MM-DD format
      y: record.amount,
    }));

    // Send the formatted data to the Flask API
    const response = await axios.post(flaskApiUrl, formattedData);
    const forecastData = response.data;

    // Return the forecast data to the frontend
    res.json(forecastData);
  } catch (err) {
    console.error("Error during forecasting:", err.message || err);
    res.status(500).json({ error: "An error occurred while fetching the forecast." });
  }
});

module.exports = router;
