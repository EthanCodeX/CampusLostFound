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

module.exports = router;