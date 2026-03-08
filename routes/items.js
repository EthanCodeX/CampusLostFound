const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const auth = require('../middleware/authMiddleware');
const multer = require("multer");
const fs = require('fs');
const sanitize = require('../utils/sanitize');

// -------------------- MULTER --------------------
const upload = multer({ storage: multer.memoryStorage() }); // memoryStorage: no disk file

// -------------------- POST: Create LOST/FOUND item --------------------
router.post('/', auth, upload.single("image"), async (req, res) => {
  try {
    const newItem = new Item({
      title: sanitize(req.body.title),
      description: sanitize(req.body.description),
      type: req.body.type || "LOST",
      itemCategory: sanitize(req.body.itemCategory),
      location: sanitize(req.body.location),
      date: req.body.date,
      contactInfo: sanitize(req.body.contactInfo),
      status: "active",
      createdBy: req.user.id
    });

    // Save uploaded image to DB
    if (req.file) {
      newItem.image.data = req.file.buffer;
      newItem.image.contentType = req.file.mimetype;
    }

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// -------------------- GET ALL ITEMS --------------------
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).populate("createdBy", "name");
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

// -------------------- GET IMAGE --------------------
router.get('/:id/image', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || !item.image?.data) return res.status(404).send('No image found');
    res.set('Content-Type', item.image.contentType);
    res.send(item.image.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// -------------------- OTHER ROUTES (GET ONE, PATCH, DELETE, USER ITEMS) --------------------
router.get('/user/me', auth, async (req, res) => {
  try {
    const items = await Item.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

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

router.patch('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    if (req.body.title) item.title = sanitize(req.body.title);
    if (req.body.description) item.description = sanitize(req.body.description);
    if (req.body.itemCategory) item.itemCategory = sanitize(req.body.itemCategory);
    if (req.body.location) item.location = sanitize(req.body.location);
    if (req.body.contactInfo) item.contactInfo = sanitize(req.body.contactInfo);
    if (req.body.type) item.type = req.body.type;
    if (req.body.status) item.status = req.body.status;
    if (req.body.date) item.date = req.body.date;

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Update error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid ID format' });
  }
});

module.exports = router;