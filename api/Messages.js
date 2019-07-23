const express  = require("express");
const connectdb  = require("./../config/dbconnection");
const Messages  = require("./../models/MessageSchema");

const  router  =  express.Router();

router.route("/").get((req, res, next) =>  {
  res.setHeader("Content-Type", "application/json");
  connectdb.then(db  =>  {
    Messages.find().sort({ date: "desc" }).limit(50).then(messages  =>  {
      if (messages) {
        messages = messages.reverse()
        res.statusCode  =  200;
        return res.json({
          total: messages.length,
          messages
        });
      }
    });
  });
});



module.exports  =  router;