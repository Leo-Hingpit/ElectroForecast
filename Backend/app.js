const express = require('express');
const cors = require('cors'); // Import CORS
const authRoutes = require('./auth');

const app = express();

app.use(cors()); // Allow cross-origin requests
app.use(express.json());
app.use('/auth', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
