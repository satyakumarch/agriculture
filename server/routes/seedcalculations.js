const express = require('express');
const SeedCalculation = require('../models/SeedCalculation');
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
    const calcs = await SeedCalculation.find(query).sort({ createdAt: -1 }).limit(20);
    res.json(calcs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', optionalAuth, async (req, res) => {
  try {
    const data = req.userId ? { ...req.body, userId: req.userId } : req.body;
    const calc = await SeedCalculation.create(data);
    res.status(201).json(calc);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
