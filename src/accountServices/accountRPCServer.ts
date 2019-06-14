import { connect } from "amqplib";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "./.env") });
import {
  login,
  listCustomerAccounts,
  createCustomerAccount,
  updateCustomerAccount
} from "./account";

async function rpcServer(): Promise<any> {
  const connection = await connect(String(process.env.RMQ_URI));
  const channel = await connection.createChannel();
  var queue = "rpc_queue";
  channel.assertQueue(queue, {
    durable: false
  });
  channel.prefetch(1);
  console.log(" [x] Awaiting RPC requests");

  channel.consume(queue, async function reply(msg: any) {
    const payload = JSON.parse(msg.content) as {
      action: string;
      id: string;
      username: string;
      password: string;
      args: any;
    };
    let data;
    if (payload.action == "login") {
      try {
        data = await login(payload);
      } catch (error) {
        data = error;
      }
      sendToQueue(channel, msg, data);
    }
    if (payload.action == "account") {
      try {
        data = await listCustomerAccounts(payload.id);
      } catch (error) {
        data = error;
      }
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
