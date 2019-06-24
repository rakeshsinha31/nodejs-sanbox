import { connect } from "amqplib";

import {
  createCustomerAccount
  //   listCustomerAccounts,
  //   updateCustomerAccount
} from "./account";

async function rpcServer(exchange: string): Promise<any> {
  //let account: any;
  const conn = await connect("amqp://localhost");
  const channel = await conn.createChannel();
  channel.assertExchange(exchange, "direct", { durable: true });
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
      console.log("------in if ------");
      const account = await createCustomerAccount(payload.data.args);
      return account;
    }
    channel.ack(msg);
  }
}
rpcServer("EventExchange");
