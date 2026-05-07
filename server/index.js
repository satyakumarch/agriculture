const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));

// ── Connect MongoDB ─────────────────────────────────────────────────────────
connectDB();

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',             require('./routes/auth'));
app.use('/api/expenses',         require('./routes/expenses'));
app.use('/api/listings',         require('./routes/listings'));
app.use('/api/dronebookings',    require('./routes/dronebookings'));
app.use('/api/community',        require('./routes/community'));
app.use('/api/contact',          require('./routes/contact'));
app.use('/api/seedcalculations', require('./routes/seedcalculations'));
app.use('/api/farmanalyses',     require('./routes/farmanalyses'));
app.use('/api/profitpredictions',require('./routes/profitpredictions'));

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AgriAssist API running', db: 'mongodb://localhost:27017/agriassist' });
});

// ── Start server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AgriAssist API running on http://localhost:${PORT}`);
  console.log(`📦 MongoDB: mongodb://localhost:27017/agriassist`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/expenses`);
  console.log(`   POST   /api/expenses`);
  console.log(`   DELETE /api/expenses/:id`);
  console.log(`   GET    /api/listings`);
  console.log(`   POST   /api/listings`);
  console.log(`   GET    /api/dronebookings`);
  console.log(`   POST   /api/dronebookings`);
  console.log(`   GET    /api/community`);
  console.log(`   POST   /api/community`);
  console.log(`   POST   /api/contact`);
});
