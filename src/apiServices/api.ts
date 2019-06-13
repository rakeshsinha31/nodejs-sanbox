import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { verify } from "jsonwebtoken";

const authenticate = async (
  resolve: any,
  root: any,
  args: any,
  context: any,
  info: any
) => {
  try {
    verify(context.request.get("Authorization"), "secret");
  } catch (e) {
    return new Error("Not authorised");
  }
  const result = await resolve(root, args, context, info);
  return result;
};

const server = new GraphQLServer({
  typeDefs: "./apiServices/schema.graphql",
  resolvers,
  context: req => ({ ...req }),
  middlewares: [authenticate]
});

server.start(() => console.log("Server is  running on localhost:4000"));
