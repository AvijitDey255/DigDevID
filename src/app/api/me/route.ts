import User from "@/models/user";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get token from cookie
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Verify and decode token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      email: string;
    };

    // Get user from MongoDB
    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Authentication error:", error);

    return NextResponse.json(
      {
        message: "Authentication error",
      },
      { status: 401 }
    );
  }
}