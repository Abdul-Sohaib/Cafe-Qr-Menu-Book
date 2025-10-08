const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isOutOfStock: { type: Boolean, default: false } // New field for out-of-stock status
});

module.exports = mongoose.model('MenuItem', menuItemSchema);