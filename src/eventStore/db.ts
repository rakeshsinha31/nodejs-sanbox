import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1:27017/eventstore", {
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to event DB"))
  .catch(() => console.log("Error in connection to DB"));

const Schema = mongoose.Schema;
const EventSchema = new Schema({
  aggregateId: { type: String },
  aggregateType: { type: String },
  eventType: { type: String },
  version: { type: Number }
});
const Event = mongoose.model("Event", EventSchema);

export { Event };
