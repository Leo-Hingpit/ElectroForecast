const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Supabase Configuration
const supabaseUrl = 'https://svtjwxsxfvhqoaucfsmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dGp3eHN4ZnZocW9hdWNmc21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMzkwMDAsImV4cCI6MjA0OTYxNTAwMH0.-ZRnlQwqCzVIWgSB-plAZEhM-PVt9WOGFJkalDH0G84';
const supabase = createClient(supabaseUrl, supabaseKey);

router.get('/generate', async (req, res) => {
  try {
    const uuid = "26c73663-6471-47a4-8512-c875823da67a";
    const records = [];
    const startYear = 2022;
    const endYear = 2024;

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const date = new Date(year, month - 1, 1).toISOString().split('T')[0];

        let amount;
        if (month >= 3 && month <= 5) {
          amount = Math.floor(Math.random() * (5000 - 4000 + 1)) + 4000;
        } else if (month >= 11 || month <= 2) {
          amount = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
        } else {
          amount = Math.floor(Math.random() * (4000 - 3000 + 1)) + 3000;
        }

        records.push({
          recordID: uuidv4(),
          uuid: uuid,
          month: date,
          amount: amount,
        });
      }
    }

    const { data, error } = await supabase.from('RECORDS').insert(records);

    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ message: 'Error inserting data', error });
    }

    res.status(200).json({ message: 'Data generated and inserted successfully!', data });
  } catch (error) {
    console.error('Error generating data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

module.exports = router; // Export as a Router
