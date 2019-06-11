import { connect } from "amqplib";
import { acc } from "./accountServices/account";

async function rpcServer(me: any): Promise<any> {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  var queue = "rpc_queue";
  channel.assertQueue(queue, {
    durable: false
  });
  channel.prefetch(1);
  console.log(" [x] Awaiting RPC requests");

  channel.consume(queue, function reply(msg: any) {
    console.log("API - ", msg.content.toString());
    if (me == "me") {
      acc.then(data => {
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(data)),
          {
            correlationId: msg.properties.correlationId
          }
        );
      });
    }
    channel.ack(msg);
  });
}
rpcServer("me");
