//REQUIRE THE MONGOOSE MODULE
const mongoose = require("mongoose");
//REQUIRE THE EXPRESS MODULE
const express = require("express");
//CREATE EXPRESS APPLICATION
const app = express();
//REQUIRE THE HTTP MODULE
const http = require("http")
    .Server(app);
//REQUIRE THE BODY PARSER MODULE
const  bodyParser  = require("body-parser");
//REQUIRE THE SOCKET.IO MODULE
const io = require("socket.io");
//REQUIRE THE PATH MODULE
const path = require("path");
//SET UP THE PORT FOR THE APP
const port = 3666;
//SET UP THE SOCKET
const socket = io(http);
//REQUIRE THE MODELS FOR MONGO
const Message  = require("./models/MessageSchema");
///REQUIRE THE ROUTER API
const messageRouter  = require("./api/Messages");
const userRouter  = require("./api/User");
//REQUIRE CORS
const cors = require('cors');
//REQUIRE ERROR HANDLER
const errorHandler = require('errorhandler');
//REQUIRE SESSION FOR EXPRESS
const session = require('express-session');
//REQUIRE AMQP
const rabbitAMQP = require("./rabbitMQ/index");
//REQUIRE STOOQ
const stockBot = require("./api/Stooq");
//CHECK ENV VARIABLE
const isProduction = process.env.NODE_ENV === 'production';

//TODO MOVE HANDLER FUNCTIONS TO CORRECT FILE
var handleRegister = function(newUser) {
  return userRouter.signup(newUser);
};
var handleLogin = function(user) {
  return userRouter.login(user);
};
var handleMessage = function(params) {
  let  chatMessage  =  new Message({ message: params.message, ownerName: params.ownerName });
  if (!params.isTemp) {
    chatMessage.save();
  }
};
var consume = function(socket) {
  socket.broadcast.emit("notifierTyping", { user: "RABBITBOT", message: "is calculating..."});
  rabbitAMQP.consume(socket);
  setTimeout(() => {
    socket.broadcast.emit("notifyStopTyping");
  }, 850);
};


var handleBot = function(socket, stockCode) {
  if(stockCode !== null && stockCode !== "") {
    stockBot.getStooq(stockCode).then(val => {
      rabbitAMQP.produce(val);
    })
    .finally(val => {
      consume(socket);
    })
  }
};

//LISTEN TO SET PORT
http.listen(port, () => {
  console.log("connected to port: "+ port)
});
//SERVE APP
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/index.html'));
});

//APP USES
//ERROR HANDLER
if(!isProduction) {
  app.use(errorHandler());
}
app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));


//SOCKET EVENTS
socket.on("connection", socket => {
  console.log("user connected");
  socket.on("sendMessage", data => {
    socket.broadcast.emit("received", { message: data });
    handleMessage(data);
  });
  socket.on("userTyping", data => {
    socket.broadcast.emit("notifierTyping", { user: data.user, message: data.message });
  });
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });
  socket.on("callingBot", data => {
    handleBot(socket, data);
  });
});

