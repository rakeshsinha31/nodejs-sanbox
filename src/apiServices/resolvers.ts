import { rpcClient } from "../rpcClient";

const resolvers = {
  Query: {
    me: () => rpcClient("me", {})
  },
  Mutation: {
    createCustomerAccount(
      _: any,
      args: {
        role: String;
        username: String;
        firstName?: String;
        lastName?: String;
      }
    ) {
      rpcClient("createCustomerAccount", {
        role: args.role,
        username: args.username,
        firstName: args.username,
        lastName: args.lastName
      }); // TODO
      //updateCustomerAccount: rpcClient("me") // TODO
    }
  },
  Account: {
    __resolveType(obj: any) {
      if (obj.role === "ADMIN") {
        return "AdminAccount";
      } else if (obj.role === "VENDOR") {
        return "VendorAccount";
      } else if (obj.role === "CUSTOMER") {
        return "CustomerAccount";
      }
    }
  }
};

export { resolvers };
