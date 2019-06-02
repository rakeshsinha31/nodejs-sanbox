import { Account } from "./models/db";

const resolvers = {
  Query: {
    //hello: (_: any, { name }: any) => `Hello ${name || "world"}`
    listAccounts: () => Account.find({})
  },
  Mutation: {
    createAccount: async (_: any, args: any) => {
      const newAccount = new Account({
        role: args.role,
        username: args.username,
        firstName: args.firstName,
        lastName: args.lastName
      });
      const error = await newAccount.save();
      if (error) return error;
      return newAccount;
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
