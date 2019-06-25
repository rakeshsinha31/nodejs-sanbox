import { connect } from "amqplib";

import {
  createCustomerAccount
  //   listCustomerAccounts,
  //   updateCustomerAccount
} from "./account";

async function rpcServer(exchange: string): Promise<any> {
  const conn = await connect("amqp://localhost");
  const channel = await conn.createChannel();
  channel.assertExchange(exchange, "fanout", { durable: true });
  channel.assertQueue("someQue", { exclusive: true });
  channel.bindQueue("someQue", exchange, "");
  channel.consume("someQue", reply);
  async function reply(msg: any) {
    const payload = JSON.parse(msg.content) as {
      eventType: string;
      aggregateId: string;
      aggregateType: string;
      version: number;
      data: any;
    };

    if (payload.eventType == "craeteCustomerAccount") {
      await createCustomerAccount(payload.data.args);
    }
    channel.ack(msg);
  }
}
rpcServer("EventExchange");
