import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import mongoose from "mongoose";

const typeDefs = `
  type Query {
    listAccounts: String!
  }`;

var amqp = require("amqplib/callback_api");

const startServer = async () => {
  const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers
  });
  await mongoose
    .connect("mongodb://127.0.0.1:27017/sandbox", {
      useNewUrlParser: true
    })
    .then(() => console.log("Connected to DB"))
    .catch(() => console.log("Error in connection to DB"));
  server.start(() => console.log("Server is  running on localhost:5000"));
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

      // Call list account API here

      console.log(msg);
      channel.sendToQueue(msg.properties.replyTo, Buffer.from(msg.toString()), {
        correlationId: msg.properties.correlationId
      });

      channel.ack(msg);
    });
  });
});
