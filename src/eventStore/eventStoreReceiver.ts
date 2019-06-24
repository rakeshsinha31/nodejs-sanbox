import { connect } from "amqplib";
import { resolve } from "path";
import { config } from "dotenv";
import { Event } from "./db";
import { publish } from "./eventStorePublisher";

config({ path: resolve(__dirname, "./.env") });
// import {
//   login,
//   listCustomerAccounts,
//   createCustomerAccount,
//   updateCustomerAccount
// } from "./account";

async function eventRPCServer(): Promise<any> {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  var queue = "eventQueue";
  channel.assertQueue(queue, {
    durable: false
  });
  channel.prefetch(1);
  console.log(" [x] Event store Awaiting RPC requests");

  channel.consume(queue, async function reply(msg: any) {
    //let data;
    console.log(JSON.parse(msg.content));
    const eventData = JSON.parse(msg.content);
    const newEvent = new Event({
      eventType: eventData.eventType,
      aggregateType: eventData.aggregateType,
      aggregateId: eventData.aggregateId,
      version: eventData.version
    });
    try {
      await newEvent.save();
    } catch (error) {
      console.log("Erorr in creating new event:", error);
    }
    sendToQueue(channel, msg, newEvent);
    publish(msg).then(() => console.log("pulished"));
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
eventRPCServer();
