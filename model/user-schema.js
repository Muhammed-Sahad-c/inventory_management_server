import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String },
  userName: { type: String },
  password: { type: String },
});

export const userModel = mongoose.model("users", userSchema);
