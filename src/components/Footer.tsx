"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, FileText, User } from "lucide-react";
import Image from "next/image";
import Logo from '@/images/logo.png';
export default function Footer() {
  return (
    <footer className="w-full max-w-xl mx-auto px-4 pb-6 pt-8">
      <div className="border-t border-white/10 pt-6">

        {/* Brand */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center overflow-hidden">
              <Image src={Logo} alt="Logo" width={32} height={32} />
            </div>

            <span className="text-sm font-bold text-white">
              DigDevID
            </span>
          </div>

          <p className="text-[11px] text-neutral-500 mt-2">
            Create • Showcase • Share your digital identity
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-2">

          {/* My Portfolio */}
          <a
            href="https://avijitdey.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
            bg-white/[0.03] border border-white/5
            text-[11px] text-neutral-400
            hover:text-white hover:bg-white/[0.07]
            transition"
          >
            <User className="w-3.5 h-3.5" />
            My Portfolio
          </a>

          {/* Privacy */}
          <Link
            href="/privacy"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
            bg-white/[0.03] border border-white/5
            text-[11px] text-neutral-400
            hover:text-white hover:bg-white/[0.07]
            transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy
          </Link>

          {/* Terms */}
          <Link
            href="/terms"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl
            bg-white/[0.03] border border-white/5
            text-[11px] text-neutral-400
            hover:text-white hover:bg-white/[0.07]
            transition"
          >
            <FileText className="w-3.5 h-3.5" />
            Terms
          </Link>

        </div>

        {/* Copyright */}
        <div className="flex items-center justify-center gap-1 mt-5 text-[10px] text-neutral-600">
          © {new Date().getFullYear()} DigDevID
          <span>•</span>
          Made with
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          by Avijit Dey
        </div>

      </div>
    </footer>
  );
}