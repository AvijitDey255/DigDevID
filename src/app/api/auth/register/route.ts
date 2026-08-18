// api/auth/register

import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, userName, email, password } = await req.json();
    const errors: any = {};
    const exisUser = await User.findOne({ email });
    if (exisUser) {
      errors.email = "Email already Exist!";
    }
    const exisUserName = await User.findOne({ userName });
    if (exisUserName) {
      errors.userName = "UserName already Exist!";
    }
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
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
