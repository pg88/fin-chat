const amqp = require("amqplib/callback_api");
const amqpURL = "amqp://cxealfby:Gg6vf4Yg2KwbsTwMyu38vT-f9K1fbqCD@wasp.rmq.cloudamqp.com/cxealfby";
const rabbitBot = "RABBITBOT";
const amqpMethods = {
  produce: function(stock) {
    amqp.connect(amqpURL, (err, conn) => {
      if(err) {
        throw err;
      }
      conn.createChannel((err, channel) => {
        const q = 'STOCK_CHANNEL';
        const msg = `${stock.Symbol} quote is $${stock.Close} per share`;
        channel.assertQueue(q, { durable: false });
        channel.sendToQueue(q, Buffer.from(msg));
      });
    });
  },
  consume: function(socket) {
    amqp.connect(amqpURL, (err, conn) => {
      if(err) {
        throw err;
      }
      return conn.createChannel((err, channel) => {
        const q = 'STOCK_CHANNEL';
        channel.assertQueue(q, { durable: false });
        channel.consume(q, (msg) => {
          socket.broadcast.emit("received", { ownerName: "RABBITBOT", message: msg.content.toString(), isTemp: true });
        }, { ack: true })
      })
    })
  }
};


module.exports = amqpMethods;