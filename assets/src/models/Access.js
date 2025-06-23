const mongoose = require('mongoose');

const accessSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: Number, required: true },
  group: { type: String, required: true }
});

module.exports = mongoose.model('Access', accessSchema);
