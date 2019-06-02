const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AccountSchema = new Schema({
  role: { type: String },
  userName: { type: String },
  password: { type: String },
  fisrtName: { type: String },
  lastName: { type: String }
});
const Account = mongoose.model("Account", AccountSchema);

export { Account };
