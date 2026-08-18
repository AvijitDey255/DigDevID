"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  User,
  Globe,
  Phone,
  Loader2,
  Camera,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setUserData } from "@/redux/Slices/userSlice";

/* =========================================================
   TYPES
========================================================= */

export interface SocialMedia {
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ProfileInfo {
  title?: string;
  address?: string;
  city?: string;
  state?: string;
  bio?: string;
  company?: string;
  country?: string;
}

export interface ProfileData {
  image?: string;
  mobile?: string;
  socialMedia?: SocialMedia;
  info?: ProfileInfo;
}

export interface EditProfileModalProps {
  onClose: () => void;
  initialData?: ProfileData;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function EditProfileModal({
  onClose,
  initialData,
}: EditProfileModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  /* =======================================================
     LOADING STATES
  ======================================================= */

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  /* =======================================================
     IMAGE STATES
  ======================================================= */

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image || ""
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] = useState<ProfileData>({
    image: initialData?.image || "",

    mobile: initialData?.mobile || "",

    socialMedia: {
      website: initialData?.socialMedia?.website || "",
      linkedin: initialData?.socialMedia?.linkedin || "",
      github: initialData?.socialMedia?.github || "",
    },

    info: {
      title: initialData?.info?.title || "",
      company: initialData?.info?.company || "",
      bio: initialData?.info?.bio || "",
      address: initialData?.info?.address || "",
      city: initialData?.info?.city || "",
      state: initialData?.info?.state || "",
      country: initialData?.info?.country || "",
    },
  });

  /* =======================================================
     SYNC INITIAL DATA
  ======================================================= */

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      image: initialData.image || "",

      mobile: initialData.mobile || "",

      socialMedia: {
        website: initialData.socialMedia?.website || "",
        linkedin: initialData.socialMedia?.linkedin || "",
        github: initialData.socialMedia?.github || "",
      },

      info: {
        title: initialData.info?.title || "",
        company: initialData.info?.company || "",
        bio: initialData.info?.bio || "",
        address: initialData.info?.address || "",
        city: initialData.info?.city || "",
        state: initialData.info?.state || "",
        country: initialData.info?.country || "",
      },
    });

    setImagePreview(initialData.image || "");
  }, [initialData]);

  /* =======================================================
     CLEAN PREVIEW URL
  ======================================================= */

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /* =======================================================
     INFO CHANGE
  ======================================================= */

  const handleInfoChange = (
    field: keyof ProfileInfo,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,

      info: {
        ...(prev.info || {}),
        [field]: value,
      },
    }));
  };

  /* =======================================================
     SOCIAL CHANGE
  ======================================================= */

  const handleSocialChange = (
    field: keyof SocialMedia,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,

      socialMedia: {
        ...(prev.socialMedia || {}),
        [field]: value,
      },
    }));
  };

  /* =======================================================
     IMAGE SELECT
  ======================================================= */

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    /* File type */

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    /* File size */

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    /* Remove previous preview */

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    /* Create preview */

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);

    /* Reset input so same file can be selected again */

    e.target.value = "";
  };

  /* =======================================================
     UPLOAD IMAGE
  ======================================================= */

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    setImageLoading(true);

    try {
      const uploadData = new FormData();

      uploadData.append("image", imageFile);

      const result = await axios.post(
        "/api/user/uploadImage",
        uploadData,
        {
          withCredentials: true,
        }
      );

      if (result.data?.user) {
        const updatedUser = result.data.user;

        /* Update Redux */

        dispatch(setUserData(updatedUser));

        /* Update form */

        setFormData((prev) => ({
          ...prev,
          image: updatedUser.image || "",
        }));

        /* Update preview */

        setImagePreview(updatedUser.image || "");

        /* Clear selected file */

        setImageFile(null);

        toast.success(
          result.data.message || "Profile image updated!"
        );
      }
    } catch (error: any) {
      console.error("IMAGE UPLOAD ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to upload image"
      );
    } finally {
      setImageLoading(false);
    }
  };

  /* =======================================================
     UPDATE PROFILE INFO
  ======================================================= */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    /* =====================================================
       FRONTEND VALIDATION
    ===================================================== */

    const requiredFields = [
      {
        name: "Title",
        value: formData.info?.title,
      },
      {
        name: "Company / Qualification",
        value: formData.info?.company,
      },
      {
        name: "Bio",
        value: formData.info?.bio,
      },
      {
        name: "City",
        value: formData.info?.city,
      },
      {
        name: "Country",
        value: formData.info?.country,
      },
    ];

    const emptyField = requiredFields.find(
      (field) => !field.value?.trim()
    );

    if (emptyField) {
      toast.error(`${emptyField.name} is required`);
      return;
    }

    setLoading(true);

    try {
      const result = await axios.patch(
        "/api/user/updateInfo",
        {
          mobile: formData.mobile,

          socialMedia: formData.socialMedia,

          info: formData.info,
        },
        {
          withCredentials: true,
        }
      );

      if (result?.data?.user) {
        const updatedUser = result?.data?.user;

        /* Update Redux */

        dispatch(setUserData(updatedUser));

        toast.success(
          result.data.message ||
            "Profile updated successfully!"
        );

        router.push("/");

        onClose();
      }
    } catch (error: any) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to update profile. Try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 10,
        }}
        transition={{
          duration: 0.2,
        }}
        className="relative w-full max-w-lg max-h-[90vh] bg-neutral-900 border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col text-neutral-100"
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">
              Edit Profile
            </h3>

            <p className="text-xs text-neutral-400">
              Update your public details and profile image
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading || imageLoading}
            aria-label="Close modal"
            className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =================================================
            SCROLLABLE FORM
        ================================================= */}

        <form
          id="edit-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto py-4 space-y-6 pr-1 text-xs"
        >
          {/* =================================================
              PROFILE IMAGE
          ================================================= */}

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-neutral-300 font-semibold uppercase tracking-wider text-[10px]">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />

              <span>Profile Image</span>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/60 border border-white/10">
              {/* IMAGE PREVIEW */}

              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/15 bg-neutral-900 flex items-center justify-center shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-neutral-600" />
                  )}
                </div>

                {/* CAMERA BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-cyan-500 text-black flex items-center justify-center border-2 border-neutral-900 hover:bg-cyan-400 transition shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* UPLOAD AREA */}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  Profile photo
                </p>

                <p className="text-[10px] text-neutral-500 mt-1">
                  JPG, PNG or WEBP · Maximum 5MB
                </p>

                {/* FILE INPUT */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* BUTTONS */}

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={imageLoading}
                    className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 text-white text-[11px] font-medium transition flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />

                    Choose Image
                  </button>

                  {imageFile && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={imageLoading}
                      className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-[11px] font-semibold transition flex items-center gap-1.5"
                    >
                      {imageLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />

                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />

                          Upload
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* SELECTED FILE */}

                {imageFile && (
                  <p className="text-[10px] text-cyan-400 truncate mt-2">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              GENERAL INFO
          ================================================= */}

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-neutral-300 font-semibold uppercase tracking-wider text-[10px]">
              <User className="w-3.5 h-3.5 text-cyan-400" />

              <span>General Info</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* TITLE */}

              <div>
                <label className="block text-neutral-400 mb-1">
                  Title{" "}
                  <span className="text-red-500 font-bold">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  required
                  value={formData.info?.title || ""}
                  onChange={(e) =>
                    handleInfoChange(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Senior Frontend Dev"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* COMPANY */}

              <div>
                <label className="block text-neutral-400 mb-1">
                  Company / Qualification{" "}
                  <span className="text-red-500 font-bold">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  required
                  value={formData.info?.company || ""}
                  onChange={(e) =>
                    handleInfoChange(
                      "company",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* BIO */}

            <div>
              <label className="block text-neutral-400 mb-1">
                Bio{" "}
                <span className="text-red-500 font-bold">
                  *
                </span>
              </label>

              <textarea
                rows={3}
                required
                value={formData.info?.bio || ""}
                onChange={(e) =>
                  handleInfoChange(
                    "bio",
                    e.target.value
                  )
                }
                placeholder="Short bio about yourself..."
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition resize-none"
              />
            </div>
          </div>

          {/* =================================================
              CONTACT & LOCATION
          ================================================= */}

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-neutral-300 font-semibold uppercase tracking-wider text-[10px]">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />

              <span>Contact & Location</span>
            </div>

            {/* MOBILE */}

            <div>
              <label className="block text-neutral-400 mb-1">
                Mobile Number
              </label>

              <input
                type="tel"
                value={formData.mobile || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mobile: e.target.value,
                  }))
                }
                placeholder="+1 (555) 000-0000"
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* ADDRESS */}

            <div>
              <label className="block text-neutral-400 mb-1">
                Address
              </label>

              <input
                type="text"
                value={formData.info?.address || ""}
                onChange={(e) =>
                  handleInfoChange(
                    "address",
                    e.target.value
                  )
                }
                placeholder="Street Address"
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* LOCATION */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* CITY */}

              <div>
                <label className="block text-neutral-400 mb-1">
                  City{" "}
                  <span className="text-red-500 font-bold">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  required
                  value={formData.info?.city || ""}
                  onChange={(e) =>
                    handleInfoChange(
                      "city",
                      e.target.value
                    )
                  }
                  placeholder="City"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* STATE */}

              <div>
                <label className="block text-neutral-400 mb-1">
                  State
                </label>

                <input
                  type="text"
                  value={formData.info?.state || ""}
                  onChange={(e) =>
                    handleInfoChange(
                      "state",
                      e.target.value
                    )
                  }
                  placeholder="State"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* COUNTRY */}

              <div>
                <label className="block text-neutral-400 mb-1">
                  Country{" "}
                  <span className="text-red-500 font-bold">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  required
                  value={formData.info?.country || ""}
                  onChange={(e) =>
                    handleInfoChange(
                      "country",
                      e.target.value
                    )
                  }
                  placeholder="Country"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              SOCIAL PROFILES
          ================================================= */}

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-neutral-300 font-semibold uppercase tracking-wider text-[10px]">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />

              <span>Social Profiles</span>
            </div>

            <div className="space-y-2">
              {/* WEBSITE */}

              <div>
                <label className="block text-neutral-400 mb-1">
                  Website URL
                </label>

                <input
                  type="url"
                  value={
                    formData.socialMedia?.website || ""
                  }
                  onChange={(e) =>
                    handleSocialChange(
                      "website",
                      e.target.value
                    )
                  }
                  placeholder="https://example.com"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* LINKEDIN */}

              <div>
                <label className="block text-neutral-400 mb-1">
                  LinkedIn URL
                </label>

                <input
                  type="url"
                  value={
                    formData.socialMedia?.linkedin || ""
                  }
                  onChange={(e) =>
                    handleSocialChange(
                      "linkedin",
                      e.target.value
                    )
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* GITHUB */}

              <div>
                <label className="block text-neutral-400 mb-1">
                  GitHub URL
                </label>

                <input
                  type="url"
                  value={
                    formData.socialMedia?.github || ""
                  }
                  onChange={(e) =>
                    handleSocialChange(
                      "github",
                      e.target.value
                    )
                  }
                  placeholder="https://github.com/username"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
          </div>
        </form>

        {/* =================================================
            MODAL ACTIONS
        ================================================= */}

        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
          {/* CANCEL */}

          <button
            type="button"
            onClick={onClose}
            disabled={loading || imageLoading}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-300 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            Cancel
          </button>

          {/* SAVE */}

          <button
            type="submit"
            form="edit-form"
            disabled={loading || imageLoading}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl text-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />

                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />

                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}