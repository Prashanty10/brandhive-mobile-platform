import mongoose from "mongoose";

const adspaceSchema = mongoose.Schema(
  {
    sellerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      address: String,
      city: String,
      state: String,
      latitude: Number,
      longitude: Number,
    },
    price: {
      type: mongoose.Schema.Types.Mixed,
    },
    images: {
      type: [String],
      default: [],
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active"],
      default: "active",
    },
  },
  { timestamps: true }
);

const AdSpace = mongoose.model("adspaces", adspaceSchema, "adspaces");

export default AdSpace;
