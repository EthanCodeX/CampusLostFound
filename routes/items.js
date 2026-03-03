const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/authMiddleware');

// ========================
// POST: Create new item
// ========================
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, itemCategory, location, date, contactInfo } = req.body;

    const newItem = new Item({
      title,
      description,
      type,
      itemCategory,
      location,
      date,
      contactInfo,
      createdBy: req.user // <-- MUST come from JWT
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
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
    res.status(500).json({ error: 'Server Error' });
  }
});

// ========================
// GET: Single item by ID (public)
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
// PUT: Update item (owner only)
// ========================
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Only owner can update
    if (item.createdBy.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid ID format or update error' });
  }
});

// ========================
// DELETE: Remove item (owner only)
// ========================
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Only owner can delete
    if (item.createdBy.toString() !== req.user) {
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