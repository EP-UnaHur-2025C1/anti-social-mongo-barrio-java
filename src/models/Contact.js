const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: { type: String },
  email: { type: String }
});

module.exports = mongoose.model('Contact', contactSchema);
