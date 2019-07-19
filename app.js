//REQUIRE THE MONGOOSE MODULE
const mongoose = require("mongoose");
//REQUIRE THE EXPRESS MODULE
const express = require("express");
//CREATE EXPRESS APPLICATION
const app = express();
//REQUIRE THE HTTP MODULE
const http = require("http")
    .Server(app);
//REQUIRE THE SOCKET.IO MODULE
const io = require("socket.io");
//REQUIRE THE PATH MODULE
const path = require("path");
//SET UP THE PORT FOR THE APP
const port = 3666;
//SET UP THE SOCKET
const socket = io(http);
//REQUIRE THE USER MODEL FOR MONGO
const  User  = require("./models/UserSchema");
//REQUIRE THE MONGO DB CONNECTOR
const  connect  = require("./config/dbconnection");

//CONNECT TO MONGO DB
connect.then(db => {
  try {
    console.log("CONNECTED");
  } catch(error) {
    handleError(error)
  }
})

const handleError = (error) => {
  console.log(error)
}

//LISTEN TO SET PORT
http.listen(port, () => {
  console.log("connected to port: "+ port)
});
//SERVE APP
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/index.html'));
});


//SOCKET EVENTS
socket.on("connection", socket => {


  console.log("user connected");
  socket.on('register', handleRegister);
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  //Someone is typing
  socket.on("typing", data => {
      socket.broadcast.emit("notifyTyping", {
        user: data.user,
        message: data.message
      });
  });
});

