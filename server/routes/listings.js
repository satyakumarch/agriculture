const express = require('express');
const Listing = require('../models/Listing');
const router = express.Router();

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try { const jwt = require('jsonwebtoken'); req.userId = jwt.verify(token, process.env.JWT_SECRET).id; } catch {}
  }
  next();
};

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { available: true };
    if (category && category !== 'all') query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { seller: { $regex: search, $options: 'i' } },
    ];
    const listings = await Listing.find(query).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', optionalAuth, async (req, res) => {
  try {
    const data = req.userId ? { ...req.body, userId: req.userId } : req.body;
    const listing = await Listing.create(data);
    res.status(201).json(listing);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
