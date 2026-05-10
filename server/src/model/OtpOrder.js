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

      enum: ["nodeotp", "smsactivate"],

      required: true,
    },

    orderId: {
      type: String,

      required: true,
    },

    phone: {
      type: String,

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

    operator: {
      type: String,

      default: "any",
    },

    otpCode: {
      type: String,

      default: null,
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

    cost: {
      type: Number,

      default: 0,
    },

    providerCost: {
      type: Number,

      default: 0,
    },

    profit: {
      type: Number,

      default: 0,
    },

    rawResponse: {
      type: Object,

      default: {},
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("OtpOrder", otpOrderSchema);
