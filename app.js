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
//REQUIRE THE MONGO DB CONNECTOR
const connect  = require("./config/dbconnection");
///REQUIRE THE MESSAGES ROUTER API
const messageRouter  = require("./api/Messages");
//REQUIRE CORS
const cors = require('cors');
//REQUIRE ERROR HANDLER
const errorHandler = require('errorhandler');
//REQUIRE SESSION FOR EXPRESS
const session = require('express-session');
//REQUIRE UTILS
const utils = require("./utils/index");
//REQUIRE AMQP
const rabbitAMQP = require("./rabbitMQ/index");
//REQUIRE STOOQ
const stock = require("./api/Stooq");
//CHECK ENV VARIABLE
const isProduction = process.env.NODE_ENV === 'production';


//TODO MOVE HANDLER FUNCTIONS TO CORRECT FILE
var handleRegister = function(param) {
  return param;
};
var handleMessage = function(message) {
  let  chatMessage  =  new Message({ message: message, objectId: "0"});
  chatMessage.save();
};
var handleBot = function(stockCode) {
  if(stockCode !== null && stockCode !== "") {
    /*rabbitAMQP.produce();
    rabbitAMQP.consume();*/
    return stock(stockCode);
  }
}

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
app.use(bodyParser.json());
app.use(cors());
app.use("/api/messages", messageRouter);
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));



//SOCKET EVENTS
socket.on("connection", socket => {
  console.log("user connected");
  socket.on("register", handleRegister);
  socket.on("sendMessage", handleMessage);
  socket.on("userTyping", data => {
    socket.broadcast.emit("notifierTyping", { user: data.user, message: data.message });
  });
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });
  socket.on("callingBot", handleBot);
});

