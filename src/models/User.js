const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickName: { type: String, unique: true, required: true },
  // otros campos opcionales
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
