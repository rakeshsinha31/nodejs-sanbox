import { connect } from "amqplib";

async function publish(message: any): Promise<any> {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  var exchange = "EventExchange";

  channel.assertExchange(exchange, "direct", {
    durable: true
  });
  channel.publish(exchange, "", Buffer.from(message.content));
  console.log(" [x] Publish message - ", JSON.parse(message.content));
}

export { publish };
