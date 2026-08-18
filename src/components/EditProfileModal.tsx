import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, User, Globe, Phone, Loader2 } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setUserData } from "@/redux/Slices/userSlice";

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
  mobile?: string;
  socialMedia?: SocialMedia;
  info?: ProfileInfo;
}

export interface EditProfileModalProps {
  onClose: () => void;
  initialData?: ProfileData;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function EditProfileModal({
  onClose,
  initialData,
}: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<ProfileData>({
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

  // Sync state if initialData arrives after mount
  useEffect(() => {
    if (initialData) {
      setFormData({
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
    }
  }, [initialData]);

  const handleInfoChange = (field: keyof ProfileInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      info: { ...(prev.info || {}), [field]: value },
    }));
  };

  const handleSocialChange = (field: keyof SocialMedia, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...(prev.socialMedia || {}), [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(
        `${API_BASE_URL}/user/updateInfo`,
        formData,
        { withCredentials: true },
      );

      if (result?.data?.user) {
        dispatch(setUserData(result.data.user));
      }

      toast.success("Profile updated successfully!");
      router.refresh();
      onClose();
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      const message =
        err?.response?.data?.message || "Failed to update profile. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg max-h-[90vh] bg-neutral-900 border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col text-neutral-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">Edit Profile</h3>
            <p className="text-xs text-neutral-400">
              Update your public details and social links
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form
          id="edit-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto py-4 space-y-5 pr-1 text-xs"
        >
          {/* General Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-neutral-300 font-semibold uppercase tracking-wider text-[10px]">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>General Info</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">
                  Title <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.info?.title || ""}
                  onChange={(e) => handleInfoChange("title", e.target.value)}
                  placeholder="e.g. Senior Frontend Dev"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Company / Qualification{" "}
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.info?.company || ""}
                  onChange={(e) => handleInfoChange("company", e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                Bio <span className="text-red-500 font-bold">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.info?.bio || ""}
                onChange={(e) => handleInfoChange("bio", e.target.value)}
                placeholder="Short bio about yourself..."
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition resize-none"
              />
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-neutral-300 font-semibold uppercase tracking-wider text-[10px]">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contact & Location</span>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.mobile || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                }
                placeholder="+1 (555) 000-0000"
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Address</label>
              <input
                type="text"
                value={formData.info?.address || ""}
                onChange={(e) => handleInfoChange("address", e.target.value)}
                placeholder="Street Address"
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-neutral-400 mb-1">
                  City <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.info?.city || ""}
                  onChange={(e) => handleInfoChange("city", e.target.value)}
                  placeholder="City"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">State</label>
                <input
                  type="text"
                  value={formData.info?.state || ""}
                  onChange={(e) => handleInfoChange("state", e.target.value)}
                  placeholder="State"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Country <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.info?.country || ""}
                  onChange={(e) => handleInfoChange("country", e.target.value)}
                  placeholder="Country"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-neutral-300 font-semibold uppercase tracking-wider text-[10px]">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Social Profiles</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-neutral-400 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.socialMedia?.website || ""}
                  onChange={(e) =>
                    handleSocialChange("website", e.target.value)
                  }
                  placeholder="https://example.com"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.socialMedia?.linkedin || ""}
                  onChange={(e) =>
                    handleSocialChange("linkedin", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.socialMedia?.github || ""}
                  onChange={(e) => handleSocialChange("github", e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-300 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-form"
            disabled={loading}
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
