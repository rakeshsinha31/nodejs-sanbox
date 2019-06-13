import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
const AccountSchema = new Schema({
  role: { type: String },
  username: { type: String },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String }
});
const Account = mongoose.model("Account", AccountSchema);

export { Account };
