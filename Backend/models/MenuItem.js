const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isOutOfStock: { type: Boolean, default: false },
  varieties: [{
    name: { type: String, required: true },
    additionalPrice: { type: Number, required: true, default: 0 }
  }]
});

module.exports = mongoose.model('MenuItem', menuItemSchema);