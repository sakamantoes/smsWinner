import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
      index: true,
    },
    depositorName: {
      type: String,
      index: true,
    },
    type: {
      type: String,
      enum: ["DEPOSIT", "PURCHASE"],
      default: "DEPOSIT",
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
    referenceId: {
      type: String,
      unique: true,
      index: true,
    },
    orderId: String,

    paymentMethod: {
      type: String,
      enum: ["ALAT", "SQUAD", "MANUAL_TRANSFER"],
    },

    balanceBefore: Number,
    balanceAfter: Number,
  },
  {
    timestamps: true,
  },
);

const WalletTransaction = mongoose.model(
  "walletTransaction",
  walletTransactionSchema,
);

export default WalletTransaction;

/**
squad response:  {
  status: 200,
  success: true,
  message: 'Success',
  data: {
    merchant_info: { merchant_name: 'Jab Engineering ', merchant_id: 'SBBHFY3B8W' },
    currency: 'NGN',
    recurring: { type: 0 },
    is_recurring: false,
    callback_url: 'https://untendered-atlantal-florance.ngrok-free.dev/',
    transaction_ref: 'SQJABE6391403060598900002',
    transaction_amount: 50000,
    authorized_channels: [ 'card', 'bank' ],
    checkout_url: 'https://sandbox-pay.squadco.com/SQJABE6391403060598900002',
    allow_recurring: false,
    bank_list: [ [Object], [Object] ]
  }
}
 * 
 */
