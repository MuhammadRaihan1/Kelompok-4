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
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Google login error:", error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex">

      {/* =========================
          LEFT SIDE - BRANDING
      ========================== */}
      <section className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white relative overflow-hidden">

        {/* Background Decoration */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-slate-800 opacity-50" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-slate-800 opacity-40" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white text-slate-950 flex items-center justify-center font-bold text-xl">
              L
            </div>

            <span className="text-2xl font-bold tracking-tight">
              Lapangin
            </span>
          </div>

          {/* Main Content */}
          <div className="max-w-lg">

            <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 mb-6">
              ⚡ Booking lebih mudah
            </span>

            <h2 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Temukan dan booking
              <span className="text-slate-400">
                {" "}lapangan favoritmu.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Nikmati kemudahan mencari lapangan olahraga,
              memilih jadwal, dan melakukan booking
              hanya dalam beberapa langkah.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  ✓
                </div>

                <div>
                  <p className="font-medium">
                    Pilihan lapangan beragam
                  </p>

                  <p className="text-sm text-slate-500">
                    Temukan lapangan sesuai kebutuhanmu
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  ✓
                </div>

                <div>
                  <p className="font-medium">
                    Booking dengan mudah
                  </p>

                  <p className="text-sm text-slate-500">
                    Pilih jadwal dan lakukan pemesanan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  ✓
                </div>

                <div>
                  <p className="font-medium">
                    Aman dan terpercaya
                  </p>

                  <p className="text-sm text-slate-500">
                    Data akunmu tetap terlindungi
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-slate-500">
            © 2026 Lapangin. Semua hak dilindungi.
          </p>

        </div>
      </section>


      {/* =========================
          RIGHT SIDE - LOGIN
      ========================== */}
      <section className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-5 py-10">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">

            <div className="w-11 h-11 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-xl">
              L
            </div>

            <span className="text-2xl font-bold text-slate-950">
              Lapangin
            </span>

          </div>


          {/* Login Header */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Selamat datang kembali
            </h1>

            <p className="mt-2 text-slate-500">
              Masuk ke akun Lapangin untuk melanjutkan.
            </p>

          </div>


          {/* Login Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">

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


            {/* =========================
                GOOGLE LOGIN
            ========================== */}
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

              {/* Google Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
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

              {loading
                ? "Menghubungkan..."
                : "Lanjutkan dengan Google"}

            </button>


            {/* Register */}
            <div className="text-center mt-7">

              <p className="text-sm text-slate-500">
                Belum punya akun?{" "}

                <a
                  href="/register"
                  className="font-semibold text-slate-950 hover:underline"
                >
                  Daftar sekarang
                </a>
              </p>

            </div>

          </div>


          {/* Security Info */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">

            <span>🔒</span>

            <span>
              Login aman dan terenkripsi
            </span>

          </div>

        </div>

      </section>

    </main>
  );
}