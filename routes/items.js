const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/authMiddleware');
const multer = require("multer");
const path = require("path");
const sanitize = require('../utils/sanitize'); // <-- import sanitizer

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
// POST: Create LOST/FOUND item (authenticated)
// ========================
router.post('/', auth, upload.single("image"), async (req, res) => {
  try {
    const newItem = new Item({
      title: sanitize(req.body.title),
      description: sanitize(req.body.description),
      type: req.body.type || "LOST", // frontend value
      itemCategory: sanitize(req.body.itemCategory),
      location: sanitize(req.body.location),
      date: req.body.date,
      contactInfo: sanitize(req.body.contactInfo),
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
    // populate createdBy name from User model
    const items = await Item.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name"); // only fetch the 'name' field

    // Map to include createdByName directly
    const itemsWithName = items.map(i => ({
      ...i.toObject(),
      createdByName: i.createdBy?.name || "Anonymous"
    }));

    res.json(itemsWithName);
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
    const items = await Item.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
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

    // Only sanitize text fields
    if (req.body.title) item.title = sanitize(req.body.title);
    if (req.body.description) item.description = sanitize(req.body.description);
    if (req.body.itemCategory) item.itemCategory = sanitize(req.body.itemCategory);
    if (req.body.location) item.location = sanitize(req.body.location);
    if (req.body.contactInfo) item.contactInfo = sanitize(req.body.contactInfo);
    if (req.body.type) item.type = req.body.type; // type not sanitized (fixed enum)
    if (req.body.date) item.date = req.body.date; // date is already a string/Date

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