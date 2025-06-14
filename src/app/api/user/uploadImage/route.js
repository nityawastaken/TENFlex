import connectDB from "@/utils/db";
import User from "@/models/User";
import cloudinary from "@/utils/cloudinary"; // <- you must configure this
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // ✅ Required


export async function PUT(req) {
  try {
    await connectDB();
    const { email, imageData } = await req.json();

    if (!email || !imageData) {
      return NextResponse.json({ message: "Email and image data required" }, { status: 400 });
    }

    const uploadRes = await cloudinary.uploader.upload(imageData, {
      folder: "user_profiles",
    });

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { profileImage: uploadRes.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image uploaded successfully", user: updatedUser });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
