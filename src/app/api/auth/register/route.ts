// api/auth/register

import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, userName, email, password } = await req.json();
    const exisEmail = await User.findOne({ email });
    if (exisEmail) {
      return NextResponse.json({ message:"Email already Exist!" }, { status: 400 });
    }
    const exisUserName = await User.findOne({ userName });
    if (exisUserName) {
      return NextResponse.json({ message:"UserName already Exist!" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message:"Password must be at least 6 characters" }, { status: 400 });
    }
    
    const hashpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      userName,
      email,
      password: hashpassword,
    });

    return NextResponse.json(
      { message: "User register successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `register error ${error}` },
      { status: 500 },
    );
  }
}
