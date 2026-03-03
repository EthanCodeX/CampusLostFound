// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- MONGODB CONNECTION -------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ------------------- MIDDLEWARE -------------------
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies
app.use(express.static('public')); // serve static files

// ------------------- ROUTES -------------------
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');

app.use('/items', itemRoutes);
app.use('/auth', authRoutes);

// Test root route
app.get('/', (req, res) => {
  res.send('Campus Lost & Found Server Running');
});

// ------------------- 404 HANDLER -------------------
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

// ------------------- GLOBAL ERROR HANDLER -------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// ------------------- START SERVER -------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});