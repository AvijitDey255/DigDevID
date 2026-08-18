import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
  id: string;
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    // =========================
    // Get token
    // =========================

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // =========================
    // Verify JWT
    // =========================

    let decoded: AuthPayload;

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);

      if (
        typeof payload === "string" ||
        !("id" in payload) ||
        typeof payload.id !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid token",
          },
          { status: 401 },
        );
      }

      decoded = payload as AuthPayload;
    } catch (error) {
      console.error("JWT ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 },
      );
    }

    const userId = decoded.id;

    // =========================
    // Get request body
    // =========================

    const body = await request.json();

    const { mobile, socialMedia, info } = body;

    // =========================
    // Required fields
    // =========================

    const requiredFields = {
      title: info?.title,
      company: info?.company,
      bio: info?.bio,
      city: info?.city,
      country: info?.country,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (typeof value !== "string" || !value.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required`,
          },
          { status: 400 },
        );
      }
    }

    // =========================
    // Update user
    // =========================

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isEditInfo: true,
          mobile: typeof mobile === "string" ? mobile.trim() : "",

          "socialMedia.website":
            typeof socialMedia?.website === "string"
              ? socialMedia.website.trim()
              : "",

          "socialMedia.linkedin":
            typeof socialMedia?.linkedin === "string"
              ? socialMedia.linkedin.trim()
              : "",

          "socialMedia.github":
            typeof socialMedia?.github === "string"
              ? socialMedia.github.trim()
              : "",

          "info.title": info.title.trim(),

          "info.company": info.company.trim(),

          "info.bio": info.bio.trim(),

          "info.address":
            typeof info.address === "string" ? info.address.trim() : "",

          "info.city": info.city.trim(),

          "info.state": typeof info.state === "string" ? info.state.trim() : "",

          "info.country": info.country.trim(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("-password -refreshToken")
      .lean();

    // =========================
    // User not found
    // =========================

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // =========================
    // Success
    // =========================

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
