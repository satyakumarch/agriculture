const express = require('express');
const ContactReport = require('../models/ContactReport');
const router = express.Router();

// POST submit contact/issue report
router.post('/', async (req, res) => {
  try {
    const report = await ContactReport.create(req.body);
    res.status(201).json({ message: 'Report submitted successfully', id: report._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all reports (admin only - no auth for demo)
router.get('/', async (req, res) => {
  try {
    const reports = await ContactReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
