const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['LOST', 'FOUND', 'CLOSED'], 
    required: true,
    trim: true,
  },
  itemCategory: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
  data: Buffer,
  contentType: String
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { timestamps: true });

// ========================
// Pre-save middleware: auto-uppercase all string fields
// ========================
itemSchema.pre('save', function() {
  // 'this' is the document
  for (let key in this._doc) {
    if (typeof this[key] === 'string') {
      this[key] = this[key].toUpperCase();
    }
  }
});

module.exports = mongoose.model('Item', itemSchema);