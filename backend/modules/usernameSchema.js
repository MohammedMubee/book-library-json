const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  userid: String,
  books: [Number]
});
const User = mongoose.model('User', userSchema);
module.exports = User; 
