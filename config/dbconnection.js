const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/fin-chat";
const settings = {
  useCreateIndex: true,
  useNewUrlParser: true
};
const  connect  =  mongoose.connect(url, settings);
module.exports  =  connect;