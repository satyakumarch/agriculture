const express = require('express');
const DroneBooking = require('../models/DroneBooking');
const auth = require('../middleware/auth');
const router = express.Router();

// GET user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await DroneBooking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = await DroneBooking.create({ ...req.body, userId: req.userId });
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH update booking status
router.patch('/:id', auth, async (req, res) => {
  try {
    const booking = await DroneBooking.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
