"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";

import { setUserData } from "@/redux/Slices/userSlice";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (!formData.email || formData.email === null) {
        toast.error("Email is required");
        return;
      }
      if (!formData.password || formData.password === null) {
        toast.error("Password is required");
        return;
      }
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      try {
        const result = await axios.post(`api/auth/login`, loginData, {
          withCredentials: true,
        });
        console.log("result login => ", result?.data?.user);
        dispatch(setUserData(result?.data?.user));
        toast.success("login successful!");
        router.push("/");
        return;
      } catch (error: any) {
        toast.error(error.response?.data?.message || "login faileds");
      }
    }

    if (!isLogin) {
      if (!formData.name || formData.name === null) {
        toast.error("Name is required");
        return;
      }
      if (!formData.userName || formData.userName === null) {
        toast.error("UserName is required");
        return;
      }
      if (!formData.email || formData.email === null) {
        toast.error("Email is required");
        return;
      }
      if (!formData.password || formData.password === null) {
        toast.error("Password is required");
        return;
      }
      if (!formData.confirmPassword || formData.confirmPassword === null) {
        toast.error("ConfirmPassword is required");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Password not Match");
        return;
      }

      const registerData = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      };

      try {
        const result = await axios.post(`api/auth/register`, registerData, {
          withCredentials: true,
        });

        toast.success("Register successful!");
        router.push("/auth");
        return;
      } catch (error: any) {
        toast.error(error.response?.data?.message || "login faileds");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-neutral-100 p-4">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-neutral-400 mt-1.5">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in the details below to get started"}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="relative grid grid-cols-2 p-1 bg-neutral-950 border border-neutral-800/80 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`relative z-10 py-2.5 text-xs font-semibold transition-colors duration-200 rounded-xl ${
                isLogin
                  ? "text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`relative z-10 py-2.5 text-xs font-semibold transition-colors duration-200 rounded-xl ${
                !isLogin
                  ? "text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Sign Up
            </button>

            {/* Sliding Tab Background */}
            <motion.div
              layout
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              className={`absolute inset-y-1 w-[calc(50%-4px)] bg-neutral-800 border border-neutral-700/50 rounded-xl ${
                isLogin ? "left-1" : "left-[calc(50%+2px)]"
              }`}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-300">
                      Name
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="jone"
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-300">
                      User Name
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="jone123"
                        className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-neutral-300">
                  Password
                </label>
                {isLogin && (
                  <a
                    href="#forgot"
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-neutral-500 hover:text-neutral-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register Only) */}
            <AnimatePresence mode="popLayout" initial={false}>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="block text-xs font-medium text-neutral-300">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.99] transition duration-200"
            >
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Auth Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-900/90 px-3 text-neutral-500 font-mono">
                or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 rounded-xl text-xs font-medium text-neutral-300 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 rounded-xl text-xs font-medium text-neutral-300 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Bottom Switcher text */}
          <p className="text-center text-xs text-neutral-400 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
            >
              {isLogin ? "Sign up now" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
