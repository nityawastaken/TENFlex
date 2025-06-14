import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "freelancer"], required: true },
    profileImage: { type: String },
    phone: { type: String }, // ✅ new
    bio: { type: String },   // ✅ new
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
