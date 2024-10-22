const mongoose = require("mongoose");
const mongooseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["income", "expense"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

const TransactionSchema = mongoose.model("Transaction", mongooseSchema);
module.exports = TransactionSchema;
