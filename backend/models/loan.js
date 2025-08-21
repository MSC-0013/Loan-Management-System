const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  borrower: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Loan", loanSchema);
