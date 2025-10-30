const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  oauthId: String, // id from provider
  provider: String,
  displayName: String,
  email: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
