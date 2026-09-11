import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },

    change: {
      type: Number,
      default: 0,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    change: {
      type: Number,
      default: 0,
    },

    supplier: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    demand: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    currency: {
      type: String,
      default: "INR",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    priceHistory: {
      type: [priceHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Material =
  mongoose.models.Material ||
  mongoose.model("Material", materialSchema);

export default Material;