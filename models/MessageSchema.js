const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  ownerId: {
    type: ObjectId
  }
});

var message = mongoose.model('Messages', messageSchema);

module.exports = message;