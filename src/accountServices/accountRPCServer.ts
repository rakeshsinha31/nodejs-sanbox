import { connect } from "amqplib";
import {
  listCustomeraccounts,
  createCustomerAccount,
  updateCustomerAccount
} from "./account";

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

    if (payload.action == "account") {
      const data = await listCustomeraccounts(payload.id);
      sendToQueue(channel, msg, data);
    }
    if (payload.action == "accounts") {
      const data = await listCustomeraccounts();
      sendToQueue(channel, msg, data);
    }
    if (payload.action == "createCustomerAccount") {
      const data = await createCustomerAccount(payload.args);
      sendToQueue(channel, msg, data);
    }
    if (payload.action == "updateCustomerAccount") {
      const data = await updateCustomerAccount(payload.args);
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
