import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    index: true,
    unique: true,

  },
  balance: {
    type: Number,
    default: 0,
  },
});

const Wallet = mongoose.model("wallet", WalletSchema);

export default Wallet;
