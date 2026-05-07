// Collection: seedcalculations
const mongoose = require('mongoose');

const seedCalcSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seedType:  { type: String, required: true },
  area:      { type: Number, required: true },
  areaUnit:  { type: String, required: true },
  seedQtyKg: { type: Number, required: true },
  estCost:   { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SeedCalculation', seedCalcSchema);
