// Collection: farmanalyses (AI Decision Engine submissions)
const mongoose = require('mongoose');

const farmAnalysisSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cropType:        { type: String, required: true },
  soilType:        { type: String, required: true },
  cropStage:       { type: String, required: true },
  season:          { type: String, required: true },
  irrigationSource:{ type: String },
  stateRegion:     { type: String },
  farmArea:        { type: Number },
  temperature:     { type: Number },
  soilMoisture:    { type: Number },
  recommendations: { type: Object }, // stores the full AI report
  createdAt:       { type: Date, default: Date.now },
});

module.exports = mongoose.model('FarmAnalysis', farmAnalysisSchema);
