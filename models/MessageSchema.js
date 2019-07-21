const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
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
  },
  ownerName: {
    type: String
  }
});

var message = mongoose.model('Messages', messageSchema);

module.exports = message;