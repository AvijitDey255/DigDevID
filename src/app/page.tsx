"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import {
  Share2,
  Download,
  RotateCw,
  QrCode,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  Check,
  Camera,
  Copy,
  CircleUserRound,
  X,
  Palette,
} from "lucide-react";
import axios from "axios";
import { logout } from "@/redux/Slices/userSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import EditProfileModal from "@/components/EditProfileModal";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

// --- Card Themes Definition ---
interface Theme {
  id: string;
  name: string;
  cardBg: string;
  border: string;
  accent: string;
  glare: string;
  text: string;
  badge: string;
}

const THEMES: Record<string, Theme> = {
  obsidian: {
    id: "obsidian",
    name: "Matte Obsidian",
    cardBg: "bg-gradient-to-br from-neutral-900 via-neutral-950 to-black",
    border: "border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]",
    accent: "from-amber-400 to-orange-500",
    glare:
      "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.12), transparent 70%)",
    text: "text-neutral-100",
    badge: "bg-neutral-800 text-amber-300 border-neutral-700",
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    cardBg: "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950",
    border: "border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.25)]",
    accent: "from-cyan-400 via-fuchsia-500 to-pink-500",
    glare:
      "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34,211,238,0.2), transparent 60%)",
    text: "text-white",
    badge: "bg-cyan-950/80 text-cyan-300 border-cyan-500/30",
  },
  gold: {
    id: "gold",
    name: "24K Luxury",
    cardBg: "bg-gradient-to-br from-[#1c1810] via-[#0f0e0b] to-[#251f14]",
    border: "border-amber-500/40 shadow-[0_20px_50px_rgba(245,158,11,0.15)]",
    accent: "from-amber-200 via-yellow-400 to-amber-600",
    glare:
      "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(251,191,36,0.18), transparent 65%)",
    text: "text-amber-50",
    badge: "bg-amber-950/60 text-amber-400 border-amber-500/30",
  },
  glass: {
    id: "glass",
    name: "Frosted Glass",
    cardBg: "bg-white/[0.04] backdrop-blur-xl",
    border: "border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
    accent: "from-blue-400 to-emerald-400",
    glare:
      "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.25), transparent 60%)",
    text: "text-white",
    badge: "bg-white/10 text-emerald-300 border-white/20",
  },
};

export default function NxtCardApp() {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const userData = useSelector((state: RootState) => state.user.userData) as {
    userName?: string;
    email?: string;
    mobile?: string;
    image?: string;
    isEditInfo?: boolean;
    info?: {
      title?: string;
      company?: string;
      city?: string;
      bio?: string;
    };
    socialMedia?: {
      website?: string;
      linkedin?: string;
      github?: string;
    };
  } | null;

  const [themeKey, setThemeKey] = useState<string>("obsidian");
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [copied, setCopied] = useState(false);
  //logout
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(logout());
      setLoading(false);
      toast.success("logout successful!");
      router.push("/auth");
      return;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "logout faileds");
      setLoading(false);
    }
  };

  const activeTheme = THEMES[themeKey];

  // User Profile State
  const profile = {
    userName: userData?.userName,
    title: userData?.info?.title || "---",
    company: userData?.info?.company || "---",
    nfcUid: "NXT-8842-PRO", // delete
    email: userData?.email || "---",
    phone: userData?.mobile || "---",
    website: userData?.socialMedia?.website || process.env.FRONTEND_URL! || "---",
    github: userData?.socialMedia?.github || "---",
    linkedin: userData?.socialMedia?.linkedin || "---",

    location: userData?.info?.city,
    bio: userData?.info?.bio,
    avatarUrl:
      userData?.image ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  };

  const GithubIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );

  const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );

  const TwitterIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );

  const InstagramIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );

  const socialLinks = [
    {
      label: "LinkedIn",
      icon: LinkedinIcon,
      url: profile.linkedin,
      color: "hover:text-blue-400",
    },
    {
      label: "GitHub",
      icon: GithubIcon,
      url: profile.github,
      color: "hover:text-neutral-200",
    },
    {
      label: "X (Twitter)",
      icon: TwitterIcon,
      url: "https://twitter.com",
      color: "hover:text-sky-400",
    },
    {
      label: "Instagram",
      icon: InstagramIcon,
      url: "https://instagram.com",
      color: "hover:text-pink-400",
    },
  ];

  // --- 3D Mouse Parallax Mechanics ---
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [18, -18]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-18, 18]),
    springConfig,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouseX.set(clientX / width - 0.5);
    mouseY.set(clientY / height - 0.5);

    // Set CSS variable for glare effect
    cardRef.current.style.setProperty(
      "--mouse-x",
      `${(clientX / width) * 100}%`,
    );
    cardRef.current.style.setProperty(
      "--mouse-y",
      `${(clientY / height) * 100}%`,
    );
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // --- Action Handlers ---
  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${profile.userName}
ORG:${profile.company}
TITLE:${profile.title}
EMAIL:${profile.email}
TEL:${profile.phone}
URL:${profile.website}
ADR:;;${profile.location};;;;
NOTE:NFC Smart Card UID: ${profile.nfcUid}
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(
      typeof window !== "undefined" ? window.location.href : profile.website,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#08080c] text-white flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-cyan-500/30">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center gap-6">
        {/* Top Header Controls */}
        <header className="w-full flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20">
              <div className="relative">
                <CircleUserRound className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <span className="font-mono text-xs font-semibold tracking-[0.18em] uppercase text-neutral-300">
              Digital ID
            </span>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 px-3">
            <Palette className="w-3.5 h-3.5 text-neutral-400" />
            <div className="flex gap-1.5">
              {Object.keys(THEMES).map((key) => (
                <button
                  key={key}
                  onClick={() => setThemeKey(key)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    key === "obsidian"
                      ? "bg-neutral-800"
                      : key === "cyberpunk"
                        ? "bg-cyan-500"
                        : key === "gold"
                          ? "bg-amber-500"
                          : "bg-emerald-400"
                  } ${themeKey === key ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110" : "opacity-60 hover:opacity-100"}`}
                  title={THEMES[key].name}
                />
              ))}
            </div>
          </div>
          {/* logout button */}
          <div className="relative group inline-block">
            {/* Subtle Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-300" />

            {/* Button Body */}
            <motion.button
              onClick={handleClick}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="relative flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-950 border border-slate-800 rounded-lg shadow-sm hover:border-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait" initial={false}>
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 text-slate-400"
                  >
                    <motion.div
                      className="w-3.5 h-3.5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        ease: "linear",
                      }}
                    />
                    <span>process...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <span>Logout</span>
                    <motion.span
                      className="text-slate-400 group-hover:text-white transition-colors"
                      initial={{ x: 0 }}
                      whileHover={{ x: 2 }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </header>

        {/* --- 3D Interactive Card Showcase --- */}
        <div className="w-full flex justify-center [perspective:1400px]">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className={`relative w-full aspect-[1.586/1] rounded-2xl p-6 sm:p-7 border backdrop-blur-md cursor-pointer select-none transition-colors duration-500 ${activeTheme.cardBg} ${activeTheme.border}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Dynamic Glass / Sheen Overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-overlay transition-opacity duration-300"
              style={{ background: activeTheme.glare }}
            />

            {/* FRONT FACE */}
            <div
              className={`absolute inset-0 p-6 sm:p-7 flex flex-col justify-between [backface-visibility:hidden] ${
                isFlipped ? "pointer-events-none" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => {
                      // Trigger your file upload or edit modal here
                    }}
                  >
                    <img
                      src={profile.avatarUrl}
                      alt={profile.userName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-md"
                    />

                    {/* Hover Overlay with Edit Icon */}
                    <div className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera className="w-4 h-4 text-white" />
                    </div>

                    {/* Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-black/80 rounded-full p-1 border border-white/20 z-10">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </div>
                  </div>

                  <div>
                    <h2 className="font-bold text-lg leading-tight tracking-tight">
                      {profile.userName}
                    </h2>
                    <p className="text-xs text-neutral-400">{profile.title}</p>
                    <p className="text-[11px] font-medium tracking-wide bg-gradient-to-r bg-clip-text text-transparent from-neutral-200 to-neutral-400">
                      {profile.company}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div
                    className={`relative p-2 rounded-xl border backdrop-blur-md ${activeTheme.badge}`}
                  >
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-xl" />

                    {/* QR container */}
                    <div className="relative p-1.5 bg-white rounded-lg shadow-lg">
                      <QRCodeSVG
                        value={profile.website}
                        size={100}
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#08080c"
                      />
                    </div>

                    {/* Scan indicator */}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed opacity-90">
                  {profile.bio}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-neutral-400 font-mono">
                  <span>{profile.location}</span>
                  <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                    <RotateCw className="w-3 h-3" /> Tap to Flip
                  </span>
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div
              className={`absolute inset-0 p-6 sm:p-7 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] ${
                !isFlipped ? "pointer-events-none" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    Smart Contact123
                  </p>
                  <p className="text-xs font-mono text-neutral-200 mt-0.5">
                    {profile.nfcUid || "frfrg"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQrModal(true);
                  }}
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition"
                >
                  <QrCode className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 my-auto">
                <div className="p-2.5 bg-white rounded-xl shadow-lg">
                  <QRCodeSVG value={profile.website} size={84} level="M" />
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300 font-mono">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />{" "}
                    Instant Scan
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Scan camera or tap with any NFC phone
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-white/10 pt-2">
                <span>{profile.email}</span>
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Flip Back
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            // onClick={downloadVCard}
            className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-medium text-sm text-black bg-gradient-to-r ${activeTheme.accent} shadow-lg transition duration-200`}
            onClick={() => setShowEditModal(true)}
          >
            <Download className="w-4 h-4" />
            <span>Edit Info</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQrModal(true)}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-medium text-sm text-white bg-neutral-900/90 border border-white/15 hover:bg-neutral-800 transition duration-200 shadow-md"
          >
            <QrCode className="w-4 h-4" />
            <span>Show QR</span>
          </motion.button>
        </div>

        {/* Contact Quick-Actions Hub */}
        <div className="w-full bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-800 text-neutral-300">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-neutral-400">Email Address</p>
                <p className="text-sm font-medium text-white">
                  {profile.email}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
          </a>

          <a
            href={`tel:${profile.phone}`}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-800 text-neutral-300">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-neutral-400">Direct Line</p>
                <p className="text-sm font-medium text-white">
                  {profile.phone}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
          </a>

          {/* Social Hub Links */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {socialLinks.map((s, idx) => {
              const Icon = s.icon;
              return (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition ${s.color}`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {s.label.split(" ")[0]}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Share Profile Link Footer */}
        <button
          onClick={copyProfileLink}
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition py-2"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copied ? "Profile Link Copied!" : "Copy Shareable Link"}</span>
        </button>
      </div>

      {/* --- QR Code Share Modal --- */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-neutral-900 border border-white/15 rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center mb-3">
                <QrCode className="w-6 h-6 text-cyan-400" />
              </div>

              <h3 className="text-lg font-bold">Scan to Connect</h3>
              <p className="text-xs text-neutral-400 mt-1 mb-5">
                Point any phone camera to access this digital card
              </p>

              <div className="p-4 bg-white rounded-2xl shadow-inner mb-5">
                <QRCodeSVG
                  value={`${FRONTEND_URL}/${profile.userName}`}
                  size={180}
                  level="H"
                />
              </div>

              <button
                onClick={copyProfileLink}
                className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-mono font-medium transition flex items-center justify-center gap-2"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                {copied ? "Link Copied to Clipboard" : "Share Profile URL"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* info edit */}
      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
          initialData={userData ?? undefined}
        />
      )}
    </main>
  );
}
