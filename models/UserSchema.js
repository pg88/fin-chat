const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
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
    },
    trim: true,
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
    required: true,
    minlenght: 6
  }
});

userSchema.pre("save", function(next) {
  var user = this;
  //ONLY HASH THE PASSWORD IF IT HAS BEEN MODIFIED (OR IS NEW)
  if (!user.isModified('password')) return next();

  //GENERATE A SALT
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);
    //HASH THE PASSWORD USING OUR NEW SALT
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      //OVERRIDE THE CLEARTEXT PASSWORD WITH THE HASHED ONE
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};


const user = mongoose.model("User", userSchema);

module.exports = user;