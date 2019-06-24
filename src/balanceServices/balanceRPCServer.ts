import { connect } from "amqplib";
import { accountBalance } from "./balance";

async function rpcServer(): Promise<any> {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  var queue = "rpc_queue";
  channel.assertQueue(queue, {
    durable: false
  });
  channel.prefetch(1);
  console.log(" [x] Awaiting RPC requests");

  channel.consume(queue, async function reply(msg: any) {
    const payload = JSON.parse(msg.content);
    console.log("===================");
    console.log(payload);
    console.log("===================");
    let data;
    if (payload.action == "balance") {
      data = await accountBalance(payload.token);
      sendToQueue(channel, msg, data);
    }
    channel.ack(msg);
  });
}

function sendToQueue(channel: any, msg: any, val: any) {
  channel.sendToQueue(
    msg.properties.replyTo,
    Buffer.from(JSON.stringify(val)),
    {
      correlationId: msg.properties.correlationId
    }
  );
}
rpcServer();
