// model/systemSettingsSchema.js (add adminProfitConfig)

import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
  profitMarkup: {
    type: Number,
    default: 0,
    description: "Legacy profit markup (deprecated, use adminProfitConfig)"
  },
  adminProfitConfig: {
    enabled: {
      type: Boolean,
      default: false,
      description: "Enable/disable admin profit addition"
    },
    profitType: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'fixed',
      description: "Type of profit calculation"
    },
    profitValue: {
      type: Number,
      default: 0,
      description: "Profit value (amount for fixed, percentage for percentage)"
    },
    minProfit: {
      type: Number,
      default: 0,
      description: "Minimum profit amount (applies to percentage mode)"
    },
    maxProfit: {
      type: Number,
      default: null,
      description: "Maximum profit amount (applies to percentage mode)"
    },
    applicableServices: {
      type: [String],
      default: [],
      description: "Services this profit applies to (empty = all services)"
    },
    applicableCountries: {
      type: [String],
      default: [],
      description: "Countries this profit applies to (empty = all countries)"
    }
  }
}, {
  timestamps: true
});

export default mongoose.model("SystemSettings", systemSettingsSchema);