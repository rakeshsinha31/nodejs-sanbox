import { connect } from "amqplib";

async function rpcClient(arg: any): Promise<any> {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  const createdQeue = await channel.assertQueue("", { exclusive: true });

  const correlationId = await generateUuid();
  console.log(" [x] Requesting ", arg);

  channel.sendToQueue("rpc_queue", Buffer.from(JSON.stringify(arg)), {
    correlationId: correlationId,
    replyTo: createdQeue.queue
  });
  return new Promise((resolve, reject) => {
    channel.consume(createdQeue.queue, async function(msg: any) {
      let msgBody = msg.content.toString();
      console.log(JSON.parse(msg.content).error);
      if (JSON.parse(msg.content).error) {
        reject(JSON.parse(msg.content).error);
      }
      if (msg.properties.correlationId == correlationId) {
        resolve(JSON.parse(msgBody));
      }
      await channel.ack(msg);
    });
  });
}

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
export { rpcClient };
