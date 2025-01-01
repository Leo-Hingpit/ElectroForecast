const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
const apiRoutes = require('./api'); // Import API routes
const generateSeasonalDataRoutes = require('./generateSeasonalData'); // Import seasonal data routes

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes); // Add API routes
app.use('/generate-data', generateSeasonalDataRoutes); // Add seasonal data generation routes

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
