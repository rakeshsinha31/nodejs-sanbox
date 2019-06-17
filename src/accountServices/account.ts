import mongoose from "mongoose";
import { Account } from "./models/db";
import { sign } from "jsonwebtoken";
import { hash } from "bcrypt";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, ".env") });

mongoose
  .connect("mongodb://127.0.0.1:27017/sandbox", {
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Error in connection to DB"));

interface IreturnValue {
  error: string;
  token: string;
}

async function login(args: { username: string; password: string }) {
  let returnValue = {} as IreturnValue;
  const account = await Account.findOne({ username: args.username }).select(
    "password username"
  );
  if (!account) {
    returnValue.error = "Invalid username";
    return returnValue;
  }
  // const valid = await compare(args.password, account.get("password"));
  // if (!valid) {
  //   returnValue.error = "Incorrect Password";
  //   return returnValue;
  // }
  //return json web token
  returnValue.token = sign(
    { id: account.id, username: account.get("username") },
    "secret",
    { expiresIn: "1d" }
  );
  return returnValue;
}
async function listCustomerAccounts(id: string = "") {
  let account, accounts;
  let returnValue = {} as IreturnValue;
  if (id) {
    try {
      account = await Account.find({ _id: id });
    } catch (error) {
      returnValue.error = `Error in list Account with id: ${id}, Error: ${error}`;
      return returnValue;
    }
    return account;
  } else {
    try {
      accounts = await Account.find({});
    } catch (error) {
      returnValue.error = `Error in retrieving accounts: ${error}`;
      return returnValue;
    }
    return accounts;
  }
}
async function createCustomerAccount(args: {
  role: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  let returnValue = {} as IreturnValue;
  const newAccount = new Account({
    role: args.role,
    username: args.username,
    password: await hash(args.password, 10),
    firstName: args.firstName,
    lastName: args.lastName
  });
  try {
    await newAccount.save();
  } catch (error) {
    returnValue.error = `Error while creating new Account: ${error}`;
    return returnValue;
  }
  return newAccount;
}

async function updateCustomerAccount(args: {
  id: string;
  role?: string;
  username?: string;
  firstName?: string;
  lastName: string;
}) {
  let returnValue = {} as IreturnValue;
  try {
    await Account.updateOne(
      { _id: args.id },
      { $set: { firstName: args.firstName, lastName: args.lastName } }
    );
  } catch (error) {
    returnValue.error = `Error in update Account: ${error}`;
    return returnValue;
  }
  return true;
}

export {
  login,
  listCustomerAccounts,
  createCustomerAccount,
  updateCustomerAccount
};
