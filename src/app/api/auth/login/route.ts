// app/api/auth/login/route.ts

import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();


    // Validate input
    if (!email) {
      return NextResponse.json(
        { message:"Email is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { message:"Password is required" },
        { status: 400 }
      );
    }

    

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
            message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Compare password
    const comparePass = await bcrypt.compare(
      password,
      user.password!
    );

    if (!comparePass) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // JWT secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    // Response
    const response = NextResponse.json(
      {
        message: "User login successfully",
        user
      },
      { status: 200 }
    );

    // Set token in browser cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        message: "Login failed",
      },
      { status: 500 }
    );
  }
}