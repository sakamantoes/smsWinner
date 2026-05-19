import mongoose from "mongoose";

const AvailableServiceSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
      index: true,
    },
    country: {
      type: String,
      required: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      index: true,
    },

    providerPrice: {
      type: Number,
      required: true,
    },
    
    customPrice: {
      type: Number,
      default: null,
    },

    stock: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: false,
    },
    providerId: {
      type: Number,
    },
    lastFetchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

AvailableServiceSchema.index(
  {
    service: 1,
    country: 1,
    provider: 1,
  },
  {
    unique: true,
  },
);

const AvailableService = mongoose.model(
  "AvailableService",
  AvailableServiceSchema,
);

export default AvailableService;
