import { connect } from "amqplib";
import { resolve } from "path";
import { config } from "dotenv";
import { rpcClient } from "../rpcClient";

config({ path: resolve(__dirname, "./.env") });
import {
  login
  //   listCustomerAccounts,
  //   //createCustomerAccount,
  //   updateCustomerAccount
} from "./account";

interface IntEvent {
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  version: number;
  data: any;
}

async function rpcServer(): Promise<any> {
  const connection = await connect(String(process.env.RMQ_URI));
  const channel = await connection.createChannel();
  var queue = "accountQueue";
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
      data = await login(payload);
      sendToQueue(channel, msg, data);
    }

    const my_event = {
      eventType: "craeteCustomerAccount",
      aggregateType: "someType",
      aggregateId: "abc1001xyz",
      version: 1,
      data: payload
    } as IntEvent;
    rpcClient("eventQueue", my_event);
    sendToQueue(channel, msg, data);

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
