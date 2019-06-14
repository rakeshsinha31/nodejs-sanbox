import mongoose from "mongoose";
import { Account } from "./models/db";
import { sign } from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, ".env") });

mongoose
  .connect("mongodb://127.0.0.1:27017/sandbox", {
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Error in connection to DB"));

async function login(args: { username: string; password: string }) {
  const account = await Account.findOne({ username: args.username }).select(
    "password username"
  );
  if (!account) {
    return "Invalid username";
  }
  const valid = await compare(args.password, account.get("password"));
  if (!valid) {
    return "Incorrect password";
  }
  //return json web token
  return sign({ id: account.id, username: account.get("username") }, "secret", {
    expiresIn: "1d"
  });
}
async function listCustomerAccounts(id: string = "") {
  let account, accounts;
  if (id) {
    try {
      account = await Account.find({ _id: id });
    } catch (error) {
      return `Error in list Account with id: ${id} Error: ${error}`;
    }
    return account;
  } else {
    try {
      accounts = await Account.find({});
    } catch (error) {
      return `Error in retrieving accounts: ${error}`;
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
  const newAccount = new Account({
    role: args.role,
    username: args.username,
    password: await hash(args.password, 10),
    firstName: args.firstName,
    lastName: args.lastName
  });
  const error = await newAccount.save();
  if (error) return error;
  return newAccount;
}

async function updateCustomerAccount(args: {
  id: string;
  role?: string;
  username?: string;
  firstName?: string;
  lastName: string;
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

export {
  login,
  listCustomerAccounts,
  createCustomerAccount,
  updateCustomerAccount
};
