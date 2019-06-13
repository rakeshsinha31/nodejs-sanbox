import { rpcClient } from "../rpcClient";

const resolvers = {
  Query: {
    account: (_: any, args: { id: string }) =>
      rpcClient({ action: "account", id: args.id }),

    login(_: any, args: { username: string; password: string }) {
      return rpcClient({
        action: "login",
        username: args.username,
        password: args.password
      });
    }
  },
  Mutation: {
    createCustomerAccount(
      _: any,
      args: {
        role: String;
        username: String;
        password: String;
        firstName?: String;
        lastName?: String;
      }
    ) {
      return rpcClient({
        action: "createCustomerAccount",
        args: {
          role: args.role,
          username: args.username,
          password: args.password,
          firstName: args.firstName,
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
