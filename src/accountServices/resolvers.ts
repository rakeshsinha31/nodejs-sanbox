import { Account } from "./models/db";

const resolvers = {
  Query: {
    me: () => Account.find({})
  },
  Mutation: {
    createCustomerAccount: async (
      _: any,
      args: {
        role: String;
        username: String;
        firstName?: String;
        lastName?: String;
      }
    ) => {
      const newAccount = new Account({
        role: args.role,
        username: args.username,
        firstName: args.firstName,
        lastName: args.lastName
      });
      const error = await newAccount.save();
      if (error) return error;
      return newAccount;
    },
    updateCustomerAccount: async (_: any, args: any) => {
      const updateAccount = await Account.updateOne(
        { _id: args.id },
        { $set: { firstName: args.firstName, lastName: args.lastName } }
      );
      if (!updateAccount) {
        throw new Error("Error in update Account");
      }
      return true;
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
