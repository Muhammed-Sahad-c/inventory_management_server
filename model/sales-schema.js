import mongoose, { Schema } from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    customerName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    revenue: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const salesModel = mongoose.model("salesdata", salesSchema);
