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
router.route("/signin").post((req, res, next) =>  {
  res.setHeader("Content-Type", "application/json");
  connectdb.then(db  =>  {
    User.find({ email: req.body.email }, (err, user) => {
      if(!user) {
        return res.statusCode = 500;
      }
      user[0].comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          throw err;
        }
        if(!isMatch) {
          res.statusCode = 400;
          return res.json({
              message: "Wrong password"
          })
        }
        res.statusCode = 200;
        return res.json({
          auth: true
        });
      })

    })
  })
})

module.exports  =  router;