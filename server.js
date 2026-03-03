require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (no options needed in Mongoose >=7)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies
app.use(express.static('public')); // serve static files from public/

// Import item routes
const itemRoutes = require('./routes/items');

// Use item routes
app.use('/items', itemRoutes);

// Test root route
app.get('/', (req, res) => {
  res.send('Campus Lost & Found Server Running');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});