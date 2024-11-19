// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const courseRoutes = require('./courseRoutes');
const assignRoleRoutes = require('./assignRoleRoutes');

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/users', assignRoleRoutes);

// Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).send('API endpoint not found');
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
