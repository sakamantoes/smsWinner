import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    profitMarkup: {
      type: Number,
      default: 1.0,
    },
  },
  {
    timestamps: true,
  },
);

const systemSettingsModel = mongoose.model("SystemSettings", systemSettingsSchema);
export default systemSettingsModel;
