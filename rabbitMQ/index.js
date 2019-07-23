const amqp = require("amqplib/callback_api");
const amqpURL = "amqp://cxealfby:Gg6vf4Yg2KwbsTwMyu38vT-f9K1fbqCD@wasp.rmq.cloudamqp.com/cxealfby";

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
  consume: function() {
    amqp.connect(amqpURL, (err, conn) => {
      if(err) {
        throw err;
      }
      return conn.createChannel((err, channel) => {
        const q = 'STOCK_CHANNEL';
        channel.assertQueue(q, { durable: false });
        channel.consume(q, (msg) => {
          console.log("RABBIT__", msg.content.toString());
          return channel.ack(msg);
        }, { ack: true })
      })
    })
  }
};


module.exports = amqpMethods;