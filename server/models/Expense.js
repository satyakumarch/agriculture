// Collection: expenses
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['expense', 'income'], required: true },
  category:  { type: String, required: true }, // seeds, fertilizer, labor, equipment, irrigation, other
  amount:    { type: Number, required: true },
  description: { type: String },
  date:      { type: Date, default: Date.now },
  crop:      { type: String },
  field:     { type: String },
});

module.exports = mongoose.model('Expense', expenseSchema);
