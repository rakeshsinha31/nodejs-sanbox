import { connect } from "amqplib";
import { createCustomerAccount, acc } from "./accountServices/account";

async function rpcServer(api: any, args: any): Promise<any> {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  var queue = "rpc_queue";
  channel.assertQueue(queue, {
    durable: false
  });
  channel.prefetch(1);
  console.log(" [x] Awaiting RPC requests");

  channel.consume(queue, async function reply(msg: any) {
    if (api == "me") {
      acc.then(data => {
        sendToQueue(channel, msg, data);
      });
    }
    if (api == "createCustomerAccount") {
      const data = await createCustomerAccount(args);
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
export { rpcServer };
