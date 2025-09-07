import mongoose from "mongoose";

const outboxSchema = new mongoose.Schema(
  {
    aggregateType: { type: String, required: true },
    aggregateId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    payload: { type: Object, required: true },
    processed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Outbox = mongoose.model("Outbox", outboxSchema);

export default Outbox;
