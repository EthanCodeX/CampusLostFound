const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/authMiddleware');

const multer = require("multer");
const path = require("path");


// ========================
// MULTER CONFIG (Image Upload)
// ========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// ========================
// POST: Create LOST item (authenticated)
// ========================
router.post('/', auth, upload.single("image"), async (req, res) => {
  try {

    const newItem = new Item({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type || "LOST",   // use frontend value, default LOST
      itemCategory: req.body.itemCategory,
      location: req.body.location,
      date: req.body.date,
      contactInfo: req.body.contactInfo,
      image: req.file ? req.file.path : null,
      status: "active",
      createdBy: req.user.id
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// ========================
// GET: All items (public)
// ========================
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// ========================
// GET: Current user's items
// ========================
router.get('/user/me', auth, async (req, res) => {
  try {
    const items = await Item.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(items);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// ========================
// GET: Single item by ID
// ========================
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid ID format' });
  }
});


// ========================
// PATCH: Update item (owner only)
// ========================
router.patch('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(item, req.body);
    await item.save();

    res.json(item);

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Update error' });
  }
});


// ========================
// DELETE: Remove item (owner only)
// ========================
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid ID format' });
  }
});

module.exports = router;