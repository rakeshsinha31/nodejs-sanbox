import { rpcClient } from "../rpcClient";
import { hash } from "bcrypt";

const resolvers = {
  Query: {
    account: (_: any, args: { id: string }) => {
      return rpcClient({ action: "account", id: args.id });
    },
    accounts: () => {
      return rpcClient({ action: "account" });
    }
  },
  Mutation: {
    async createCustomerAccount(
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
          password: await hash(args.password, 10),
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
