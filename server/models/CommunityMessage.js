// Collection: communitymessages
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName:  { type: String, required: true },
  text:      { type: String, required: true },
  topic:     { type: String, default: 'General' },
  likes:     { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunityMessage', messageSchema);
