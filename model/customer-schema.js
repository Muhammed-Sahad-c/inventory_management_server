import mongoose, { Schema } from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const customerModel = mongoose.model("customers", customerSchema);
