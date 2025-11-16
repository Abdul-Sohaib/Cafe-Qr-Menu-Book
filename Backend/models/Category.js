const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true }, // Cloudinary image URL
  imagePublicId: { type: String, required: true }, // Cloudinary public ID for deletion
   quote: { type: String, trim: true, default: ''},
});

module.exports = mongoose.model('Category', categorySchema);