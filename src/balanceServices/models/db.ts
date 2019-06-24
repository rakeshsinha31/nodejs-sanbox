import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
const BalanceSchema = new Schema({
  account: { type: String },
  serialCode: { type: String },
  delta: { type: Number },
  balance: { type: Number },
  source: {
    type: String,
    enum: ["DEPOSIT", "WITHDRAW", "PLACE_BET", "SETTLE_BET"]
  },
  dateTimeProcessed: { type: Date, default: Date.now }
});
const Balance = mongoose.model("balance", BalanceSchema);
export { Balance };
