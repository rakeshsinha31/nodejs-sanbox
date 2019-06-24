import mongoose from "mongoose";
import { Balance } from "./models/db";

mongoose
  .connect("mongodb://127.0.0.1:27017/balancedb", {
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to Balance DB"))
  .catch(() => console.log("Error in connection to Balance DB"));

interface IreturnValue {
  error: string;
  token: string;
}

async function accountBalance(token: string) {
  const buff = Buffer.from(token.split(".")[1];, "base64");
  const user = JSON.parse(buff.toString("ascii"));
  console.log(user.id);
  let returnValue = {} as IreturnValue;
  let data;
  try {
    data = await Balance.find({});
  } catch (error) {
    returnValue.error = `Error in  data query: ${error}`;
    return returnValue;
  }
  return data;
}

export { accountBalance };
