const express = require('express');
const Expense = require('../models/Expense');
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
    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', optionalAuth, async (req, res) => {
  try {
    const data = req.userId ? { ...req.body, userId: req.userId } : req.body;
    const expense = await Expense.create(data);
    res.status(201).json(expense);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
