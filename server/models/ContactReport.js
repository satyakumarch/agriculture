// Collection: contactreports
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  address:     { type: String },
  phone:       { type: String, required: true },
  email:       { type: String, required: true },
  subject:     { type: String, required: true },
  description: { type: String, required: true },
  status:      { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('ContactReport', contactSchema);
