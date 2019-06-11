import { rpcClient } from "../rpcClient";

const resolvers = {
  Query: {
    me: () => rpcClient({ action: "me" })
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
      return rpcClient({
        action: "createCustomerAccount",
        args: {
          role: args.role,
          username: args.username,
          firstName: args.username,
          lastName: args.lastName
        }
      });
    },

    updateCustomerAccount(_: any, args: any) {
      return rpcClient({
        action: "updateCustomerAccount",
        args: { id: args.id }
      });
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
