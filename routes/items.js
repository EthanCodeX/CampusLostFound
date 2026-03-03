const express = require('express');
const router = express.Router();
const Item = require('../models/item'); // make sure path is correct

// POST: create new item
router.post('/', async (req, res) => {
  try {
    const { title, description, type, itemCategory, location, date, contactInfo, createdBy } = req.body;
    const newItem = new Item({
      title,
      description,
      type,
      itemCategory,
      location,
      date,
      contactInfo,
      createdBy
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET: get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET: Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid ID format' });
  }
});

// PUT: Update item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid ID format or update error' });
  }
});

// DELETE: Delete item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid ID format' });
  }
});

module.exports = router;