const express = require('express');
const CommunityMessage = require('../models/CommunityMessage');
const auth = require('../middleware/auth');
const router = express.Router();

// GET messages (public, latest 50)
router.get('/', async (req, res) => {
  try {
    const { topic } = req.query;
    const query = topic && topic !== 'all' ? { topic } : {};
    const messages = await CommunityMessage.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(messages.reverse());
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST send message
router.post('/', auth, async (req, res) => {
  try {
    const msg = await CommunityMessage.create({ ...req.body, userId: req.userId });
    res.status(201).json(msg);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH like message
router.patch('/:id/like', async (req, res) => {
  try {
    const msg = await CommunityMessage.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(msg);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
