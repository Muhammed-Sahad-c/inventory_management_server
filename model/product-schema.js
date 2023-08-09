import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  imageUrl: { type: String },
  description: { type: String },
  stock: { type: Boolean, default: false },
  available: { type: Boolean, default: false },
});

export const productModel = mongoose.model("products", productSchema);
