require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- MONGO --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images, assets)
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- UPLOADS FOLDER --------------------
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/favicon.ico', (req, res) => res.status(204).end());

// -------------------- API ROUTES --------------------
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');

app.use('/items', itemRoutes);
app.use('/auth', authRoutes);

// -------------------- FRONTEND ROUTES --------------------
// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve other HTML files dynamically
app.get('/:page', (req, res, next) => {
  const filePath = path.join(__dirname, 'public', `${req.params.page}.html`);
  res.sendFile(filePath, err => {
    if (err) {
      console.log(`File not found: ${filePath}`);
      next(); // trigger 404
    }
  });
});

// -------------------- 404 --------------------
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// -------------------- GLOBAL ERROR --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));