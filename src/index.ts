import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import mongoose from "mongoose";

const startServer = async () => {
  const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers
  });
  await mongoose
    .connect("mongodb://127.0.0.1:27017/sandbox", {
      useNewUrlParser: true
    })
    .then(() => console.log("Connected to DB"))
    .catch(() => console.log("Error in connection to DB"));
  server.start(() => console.log("Server is  running on localhost:4000"));
};
startServer();
