const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const SALT_FACTOR = 10;
const userSchema = new Schema({
  firstName: {
    type: String
  },
  lastName : {
    type: String
  },
  email : {
    type: String,
    index: {
      unique: true
    }
  },
  userName: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  }
});


var user = mongoose.model('User', userSchema);

module.exports = user;