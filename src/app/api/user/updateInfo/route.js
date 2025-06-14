import connectDB from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectDB();

    const { email, name, phone, bio } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { name, phone, bio },
      { new: true } // ✅ return updated user
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated", user });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
