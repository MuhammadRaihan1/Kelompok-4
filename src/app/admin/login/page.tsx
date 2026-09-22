"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/admin/dashboard",
      });
    } catch (error) {
      console.error("Google login error:", error);
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: "url('/lapangan.jpeg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/55" />

      <section className="relative z-10 w-full max-w-md">
        <div className="w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold text-xl overflow-hidden relative">
              <img
                src="/logo2.jpg"
                alt="Logo Lapangin"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-2xl font-bold text-white">
              Lapangin
            </span>
          </div>
          {/* Login Card */}
          <div className="bg-white/95 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg backdrop-blur-sm">
           <h1 className="text-3xl flex items-center justify-center font-bold tracking-tight text-black">
              Login Admin
            </h1>
            <p className="mt-2 flex items-center justify-center text-black/70">
              Masuk ke akun admin Lapangin untuk melanjutkan.
            </p>
            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="nama@email.com"
                className="
                  w-full h-12 px-4
                  rounded-xl
                  border border-slate-300
                  bg-white
                  text-slate-900
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:border-slate-900
                  focus:ring-4
                  focus:ring-slate-900/5
                "
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition"
                >
                  Lupa password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Masukkan password"
                className="
                  w-full h-12 px-4
                  rounded-xl
                  border border-slate-300
                  bg-white
                  text-slate-900
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:border-slate-900
                  focus:ring-4
                  focus:ring-slate-900/5
                "
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 mb-6">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 accent-slate-950"
              />

              <label
                htmlFor="remember"
                className="text-sm text-slate-500 cursor-pointer"
              >
                Ingat saya
              </label>
            </div>

            {/* Login Button */}
            <button
              type="button"
              className="
                w-full h-12
                rounded-xl
                bg-slate-950
                text-white
                font-semibold
                transition
                hover:bg-slate-800
                active:scale-[0.99]
              "
            >
              Masuk
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                atau
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="
                w-full h-12
                rounded-xl
                border border-slate-300
                bg-white
                text-slate-700
                font-semibold
                transition
                hover:bg-slate-50
                hover:border-slate-400
                active:scale-[0.99]
                flex items-center justify-center gap-3
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21.805 12.23c0-.79-.065-1.54-.21-2.25H12v4.255h5.495a4.7 4.7 0 0 1-2.04 3.09v2.565h3.3c1.93-1.78 3.05-4.4 3.05-7.66Z"
                  fill="#4285F4"
                />
                <path
                  d="M12 22c2.76 0 5.07-.91 6.755-2.465l-3.3-2.565c-.915.615-2.08.98-3.455.98-2.66 0-4.915-1.795-5.725-4.21H2.865v2.65A10.2 10.2 0 0 0 12 22Z"
                  fill="#34A853"
                />
                <path
                  d="M6.275 13.74A6.12 6.12 0 0 1 5.955 12c0-.605.11-1.195.32-1.74V7.61H2.865A10.02 10.02 0 0 0 1.8 12c0 1.62.39 3.15 1.065 4.39l3.41-2.65Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 6.05c1.5 0 2.845.515 3.905 1.525l2.93-2.93C17.065 2.99 14.755 2 12 2a10.2 10.2 0 0 0-9.135 5.61l3.41 2.65C7.085 7.845 9.34 6.05 12 6.05Z"
                  fill="#EA4335"
                />
              </svg>

              {loading ? "Menghubungkan..." : "Lanjutkan dengan Google"}
            </button>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
              <span>🔒</span>
              <span>Login aman dan terenkripsi</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}