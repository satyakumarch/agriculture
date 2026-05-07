// Collection: dronebookings
const mongoose = require('mongoose');

const droneBookingSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  service:   { type: String, required: true },
  field:     { type: String, required: true },
  date:      { type: String, required: true },
  time:      { type: String, required: true },
  price:     { type: Number, required: true },
  status:    { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  pilot:     { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DroneBooking', droneBookingSchema);
