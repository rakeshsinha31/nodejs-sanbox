import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
//import mongoose from "mongoose";
const mongoose = require("mongoose");

const startServer = async () => {
  const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers
  });
  await mongoose.connect("mongodb://localhost:27017/sandbox", {
    useNewUrlParser: true
  });
  server.start(() => console.log("Server is  running on localhost:4000"));
};
startServer();
