const connectdb  = require("./../config/dbconnection");
const User  = require("./../models/UserSchema");
const express  = require("express");
const  router  =  express.Router();

router.route("/signup").post((req, res, next) =>  {
  res.setHeader("Content-Type", "application/json");
  connectdb.then(db  =>  {
    const user = new User(req.body);
      user.save(function (err) {
        if (err) {
          return err;
        };
        res.statusCode = 200;
        return res.json({
          created: true
        });
      });
  });
});


module.exports  =  router;