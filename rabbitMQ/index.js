const amqp = require("amqplib/callback_api");
const amqpURL = "amqp://cxealfby:Gg6vf4Yg2KwbsTwMyu38vT-f9K1fbqCD@wasp.rmq.cloudamqp.com/cxealfby";

const amqpMethods = {
  produce: function() {
    amqp.connect(amqpURL, (err, conn) => {
      conn.createChannel((err, channel) => {
        var q = 'CLOUD';
        var msg = 'HELLO ALL';
        channel.assertQueue(q, { durable: false });
        setInterval(() => {
          console.log("AMPQ__",q);
          channel.sendToQueue(q, Buffer.from(msg))
        }, 2000)
      });
    });
  },
  consume: function() {
    amqp.connect(amqpURL, (err, conn) => {
      conn.createChannel((err, channel) => {
        var q = 'CLOUD';
        var msg = 'HELLO ALL';
        channel.assertQueue(q, { durable: false });
        channel.consume(q, (msg) => {
          console.log("RECEIVED %s", msg.content.toString());
        }, { noAck: true })
      })
    })
  }
};


module.exports = amqpMethods;