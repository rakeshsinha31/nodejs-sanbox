const { GraphQLServer } = require("graphql-yoga");

let accounts = [];
const resolvers = {
  Mutation: {
    CreateAccount: (_obj, args) => {
      const account = {
        role: args.role,
        username: args.username,
        url: args.password,
        firstName: args.firstName,
        lastName: args.lastName
      };
      accounts.push(account);
      return account;
    }
  },

  Account: {
    __resolveType(obj) {
      if (obj.role === "ADMIN") {
        return "AdminAccount";
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
