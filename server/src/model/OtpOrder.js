import mongoose from "mongoose";

const otpOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: String,
      enum: ["nodeotp", "smsactivate", "smsbower"],
      default: "smsbower",
      required: true,
    },

    service: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    activationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,

      enum: [
        "PENDING",
        "WAITING_FOR_SMS",
        "OTP_RECEIVED",
        "COMPLETED",
        "CANCELLED",
        "FAILED",
      ],

      default: "PENDING",
    },

    otpCode: {
      type: String,
    },

    otpMessage: {
      type: String,
    },

    sellingPrice: {
      type: Number,
      default: 0,
    },

    providerPrice: {
      type: Number,
      default: 0,
    },
    activationOperator: {
      type: String,
    },
    canGetAnotherSms: {
      type: Boolean,
    },
    expiresAt: Date,

    completedAt: Date,

    cancelReason: String,

    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("OtpOrder", otpOrderSchema);
