//import { resolvers } from "./resolvers";
import mongoose from "mongoose";
var amqp = require("amqplib/callback_api");
//import { Account } from "./models/db";

const startServer = async () => {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/sandbox", {
      useNewUrlParser: true
    })
    .then(() => console.log("Connected to DB"))
    .catch(() => console.log("Error in connection to DB"));
};
startServer();

amqp.connect("amqp://localhost", function(error0: any, connection: any) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1: any, channel: any) {
    if (error1) {
      throw error1;
    }
    var queue = "rpc_queue";

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(" [x] Awaiting RPC requests");
    channel.consume(queue, function reply(msg: any) {
      var s = msg.content.toString();

      console.log("API - ", s);
      //const r = "FAKE";
      // Get the account list from the Database

      const data = [{ role: "ADMIN", usename: "user1" }];

      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(data)),
        {
          correlationId: msg.properties.correlationId
        }
      );

      channel.ack(msg);
    });
  });
});
