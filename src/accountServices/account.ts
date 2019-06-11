import mongoose from "mongoose";
import { Account } from "./models/db";

mongoose
  .connect("mongodb://127.0.0.1:27017/sandbox", {
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Error in connection to DB"));

const acc = Account.find({});

const Mutation = {
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
};

export { acc, Mutation };
