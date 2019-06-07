import { GraphQLServer } from "graphql-yoga";
import { connect } from "amqplib";

const typeDefs = `
  type Query {
    listAccounts: String
  }`;

const resolvers = {
  Query: {
    listAccounts: () => rpcClient("listAccounts")
  }
};
const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers
});
server.start(() => console.log("Server is  running on localhost:4000"));

async function rpcClient(listAccounts: any): Promise<any> {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  const createdQeue = await channel.assertQueue("", { exclusive: true });
  const correlationId = await generateUuid();
  console.log(" [x] Requesting ", listAccounts);

  function consume(channel: any, createdQeue: any): Promise<any> {
    console.log("inside consume...");
    return new Promise(resolve => {
      channel.consume(createdQeue.queue, async function(msg: any) {
        let msgBody = msg.content.toString();

        console.log("inside promise...");
        console.log(msgBody);

        if (true) {
          console.log(msg);
          resolve(JSON.parse(msgBody));
        }
        await channel.ack(msg);
      });
    });
  }
  // consume(channel, createdQeue)
  //   .then(() => console.log("THEN"))
  //   .catch(() => console.log("CATCH"));

  consume(channel, createdQeue).then(() =>
    channel.sendToQueue("rpc_queue", Buffer.from(listAccounts), {
      correlationId: correlationId,
      replyTo: createdQeue.queue
    })
  );
}

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
