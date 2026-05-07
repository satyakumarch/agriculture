const express = require('express');
const FarmAnalysis = require('../models/FarmAnalysis');
const router = express.Router();

// Optional auth — saves userId if token present, otherwise saves as anonymous
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch {}
  }
  next();
};

// GET user's farm analyses history
router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = req.userId ? { userId: req.userId } : {};
    const analyses = await FarmAnalysis.find(query).sort({ createdAt: -1 }).limit(10);
    res.json(analyses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST save farm analysis — works with or without login
router.post('/', optionalAuth, async (req, res) => {
  try {
    const data = req.userId ? { ...req.body, userId: req.userId } : req.body;
    const analysis = await FarmAnalysis.create(data);
    res.status(201).json(analysis);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
