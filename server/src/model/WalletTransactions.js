import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["DEPOSIT", "PURCHASE"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },
  reference: {
    type: String,
    unique: true,
  },
  orderId: String,
  paymentMethod: {
    type: String,
    enum: ["BANK_TRANSFER", "CARD", "CASH"],
  },
  balanceBefore: Number,
  balanceAfter: Number,
});

const WalletTransaction = mongoose.model(
  "walletTransaction",
  walletTransactionSchema,
);

export default WalletTransaction;
