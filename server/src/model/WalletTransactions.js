import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wallet",
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

  productId: {
    type: String,
    required: true,
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
