import { GraphQLServer } from "graphql-yoga";
import { connect } from "amqplib";

const d = rpcClient("listAccounts");
console.log(d);
const resolvers = {
  Query: {
    listAccounts: () => rpcClient("listAccounts")
  }
};
const server = new GraphQLServer({
  typeDefs: "./accountServices/schema.graphql",
  resolvers
});
server.start(() => console.log("Server is  running on localhost:4000"));

async function rpcClient(listAccounts: any): Promise<any> {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  const createdQeue = await channel.assertQueue("", { exclusive: true });
  const correlationId = await generateUuid();
  console.log(" [x] Requesting ", listAccounts);

  function consume(): Promise<any> {
    channel.sendToQueue("rpc_queue", Buffer.from(listAccounts), {
      correlationId: correlationId,
      replyTo: createdQeue.queue
    });
    return new Promise(resolve => {
      channel.consume(createdQeue.queue, async function(msg: any) {
        let msgBody = msg.content.toString();
        if (msg.properties.correlationId == correlationId) {
          resolve(JSON.parse(msgBody));
        }
        await channel.ack(msg);
      });
    });
  }
  consume().then(msgBody => {
    console.log(msgBody);
    return msgBody;
  });
}

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
