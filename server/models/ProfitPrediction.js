// Collection: profitpredictions
const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cropType:     { type: String, required: true },
  farmArea:     { type: Number, required: true },
  areaUnit:     { type: String, default: 'acres' },
  soilType:     { type: String },
  season:       { type: String },
  inputCost:    { type: Number },
  expectedYield:{ type: Number },
  marketPrice:  { type: Number },
  grossRevenue: { type: Number },
  netProfit:    { type: Number },
  roi:          { type: String },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProfitPrediction', profitSchema);
