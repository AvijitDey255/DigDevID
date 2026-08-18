import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// ===============================
// Cloudinary Configuration
// ===============================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ===============================
// JWT Type
// ===============================

interface AuthToken extends JwtPayload {
  id: string;
}

// ===============================
// Upload Helper
// ===============================

async function uploadToCloudinary(
  file: File,
  userId: string,
): Promise<{
  secure_url: string;
  public_id: string;
}> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `${process.env.CLOUDINARY_FOLDER_NAME}/profile_image`,
          public_id: `user_${userId}`,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result?.secure_url || !result?.public_id) {
            reject(new Error("Cloudinary upload failed"));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      )
      .end(buffer);
  });
}

// ===============================
// POST - Upload Profile Image
// ===============================

export async function POST(request: NextRequest) {
  try {
    // ===============================
    // Database
    // ===============================

    await dbConnect();

    // ===============================
    // Authentication
    // ===============================

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

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is missing");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        { status: 500 },
      );
    }

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      !("id" in decoded) ||
      typeof decoded.id !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 },
      );
    }

    const userId = decoded.id;

    // ===============================
    // Get FormData
    // ===============================

    const formData = await request.formData();

    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Image is required",
        },
        { status: 400 },
      );
    }

    // ===============================
    // Validate File Type
    // ===============================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG, WEBP and GIF images are allowed",
        },
        { status: 400 },
      );
    }

    // ===============================
    // Validate File Size
    // Maximum: 5MB
    // ===============================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be less than 5MB",
        },
        { status: 400 },
      );
    }

    // ===============================
    // Check User
    // ===============================

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // ===============================
    // Upload Image
    // ===============================
    const oldPublicId = existingUser.imageID;

    const imageUrl = await uploadToCloudinary(file, userId);

    // ===============================
    // Update User
    // ===============================

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          image: imageUrl.secure_url,
          imageID: imageUrl.public_id,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("-password")
      .lean();

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // Delete old image AFTER successful DB update
    if (oldPublicId && oldPublicId !== imageUrl.public_id) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (deleteError) {
        // Don't fail the whole request because old image deletion failed
        console.error("OLD IMAGE DELETE ERROR:", deleteError);
      }
    }

    // ===============================
    // Response
    // ===============================

    return NextResponse.json(
      {
        success: true,
        message: "Profile image uploaded successfully",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("UPLOAD PROFILE IMAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload profile image",
      },
      { status: 500 },
    );
  }
}
