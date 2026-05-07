const express = require('express');
const ProfitPrediction = require('../models/ProfitPrediction');
const router = express.Router();

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try { const jwt = require('jsonwebtoken'); req.userId = jwt.verify(token, process.env.JWT_SECRET).id; } catch {}
  }
  next();
};

router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = req.userId ? { userId: req.userId } : {};
    const predictions = await ProfitPrediction.find(query).sort({ createdAt: -1 }).limit(10);
    res.json(predictions);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', optionalAuth, async (req, res) => {
  try {
    const data = req.userId ? { ...req.body, userId: req.userId } : req.body;
    const prediction = await ProfitPrediction.create(data);
    res.status(201).json(prediction);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
