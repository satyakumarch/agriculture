// Collection: listings (Marketplace)
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title:     { type: String, required: true },
  category:  { type: String, enum: ['seeds', 'tools', 'equipment', 'labor', 'tractor'], required: true },
  price:     { type: String, required: true },
  unit:      { type: String, default: '/unit' },
  seller:    { type: String, required: true },
  location:  { type: String, required: true },
  description: { type: String, required: true },
  whatsapp:  { type: String, required: true },
  image:     { type: String },
  available: { type: Boolean, default: true },
  rating:    { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Listing', listingSchema);
