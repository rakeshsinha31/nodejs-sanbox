import mongoose from "mongoose";
import { Account } from "./models/db";
import { sign } from "jsonwebtoken";
import { hash, compare } from "bcrypt";

mongoose
  .connect("mongodb://127.0.0.1:27017/sandbox", {
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Error in connection to DB"));

async function login(args: { username: string; password: string }) {
  const account = await Account.findOne({ username: args.username }).select(
    "password"
  );

  if (!account) {
    throw new Error("No user with that username");
  } else {
    console.log("=======================");
    console.log(account);
    console.log(account.get("password"));
    console.log("======================");
  }

  const valid = await compare(args.password, account.get("password"));

  if (!valid) {
    throw new Error("Incorrect password");
  }

  //return json web token
  return sign({ id: account.id, username: account.get("password") }, "secret", {
    expiresIn: "1d"
  });
}
async function listCustomeraccounts(id: string = "") {
  if (id) {
    const account = await Account.find({ _id: id });
    if (!account) {
      throw new Error(`Error in list Account with id: ${id}`);
    }
    return account;
  } else {
    const accounts = await Account.find({});
    if (!accounts) {
      throw new Error("Error in list Account");
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
  listCustomeraccounts,
  createCustomerAccount,
  updateCustomerAccount
};
