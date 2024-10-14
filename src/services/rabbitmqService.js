const amqp = require("amqplib");

let channel;

const connect = async () => {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("email_queue");
};

connect().catch(console.error);

const sendToQueue = (queue, message) => {
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};

module.exports = { sendToQueue };
