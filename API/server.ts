import { GraphQLServer } from "graphql-yoga";
const amqp = require("amqplib/callback_api");

const typeDefs = `
  type Query {
    listAccounts: String!
  }`;

const resolvers = {
  Query: {
    listAccounts: () => rpc_client("listAccounts")
  }
};
const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers
});
server.start(() => console.log("Server is  running on localhost:4000"));

function rpc_client(listAccounts: any): any {
  amqp.connect("amqp://localhost", function(error0: any, connection: any) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1: any, channel: any) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(
        "",
        {
          exclusive: true
        },
        function(error2: any, q: any) {
          if (error2) {
            throw error2;
          }
          var correlationId = generateUuid();
          console.log(" [x] Requesting ", listAccounts);
          channel.consume(
            q.queue,
            function(msg: any) {
              console.log(msg);
              if (msg.properties.correlationId == correlationId) {
                console.log(" [.] Got %s", msg.content.toString());
                setTimeout(function() {
                  connection.close();
                  process.exit(0);
                }, 500);
              }
            },
            {
              noAck: true
            }
          );
          channel.sendToQueue("rpc_queue", Buffer.from(listAccounts), {
            correlationId: correlationId,
            replyTo: q.queue
          });
        }
      );
    });
  });
}
function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
