import mongoose from "mongoose";
import { Account } from "./models/db";

mongoose
  .connect("mongodb://127.0.0.1:27017/sandbox", {
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Error in connection to DB"));

async function listCustomeraccounts() {
  const accounts = await Account.find({});
  if (!accounts) {
    throw new Error("Error in list Account");
  }
  return accounts;
}

async function createCustomerAccount(args: {
  role: String;
  username: String;
  firstName?: String;
  lastName?: String;
}) {
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

async function updateCustomerAccount(args: {
  id: String;
  role?: String;
  username?: String;
  firstName?: String;
  lastName?: String;
}) {
  const updateAccount = await Account.updateOne(
    { _id: args.id },
    { $set: { firstName: args.firstName, lastName: args.lastName } }
  );
  if (!updateAccount) {
    throw new Error("Error in update Account");
  }
  return true;
}

export { listCustomeraccounts, createCustomerAccount, updateCustomerAccount };
