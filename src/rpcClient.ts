import { connect } from "amqplib";
import { rpcServer } from "./rpcServer";

async function rpcClient(api: string, args: any): Promise<any> {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  const createdQeue = await channel.assertQueue("", { exclusive: true });

  const correlationId = await generateUuid();
  console.log(" [x] Requesting ", api);

  channel.sendToQueue("rpc_queue", Buffer.from(api), {
    correlationId: correlationId,
    replyTo: createdQeue.queue
  });
  rpcServer(api, args);
  return new Promise(resolve => {
    channel.consume(createdQeue.queue, async function(msg: any) {
      let msgBody = msg.content.toString();
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