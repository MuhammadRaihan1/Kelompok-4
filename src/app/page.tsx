"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { signIn, useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          alert(ctx.error.message);
          setLoading(false);
        },
      }
    );
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    await signIn.social(
      {
        provider: "google",
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          alert(ctx.error.message);
          setLoading(false);
        },
      }
    );
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef0e8] text-[#18231d]">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#b7d334] border-t-transparent" />
          <p className="text-sm font-semibold">Memeriksa status akun...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white flex">

      {/* =========================
          LEFT SIDE - BRANDING
      ========================== */}
      <section className="hidden lg:flex lg:w-[58%] bg-slate-950 text-white relative overflow-hidden [perspective:1200px]">

        {/* Background Image */}
        <Image
          src="/lapangan.jpeg"
          alt="Lapangan"
          fill
          priority
          className="absolute inset-0 object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(183,211,52,0.28),transparent_34%),linear-gradient(135deg,rgba(2,6,23,0.35),rgba(22,101,52,0.45))]" />
        <div className="pointer-events-none absolute -right-24 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rotate-[18deg] rounded-[4rem] border border-lime-200/20 bg-gradient-to-br from-lime-300/20 via-emerald-400/10 to-transparent shadow-[0_0_100px_rgba(183,211,52,0.18)] [transform:rotateY(-24deg)_rotateX(18deg)_rotateZ(18deg)] backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-lime-300/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20 [transform:rotateX(58deg)_scale(1.8)_translateY(18%)]" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

          {/*Logo */}
          <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold text-xl overflow-hidden relative">
          <img
               src="/logo2.jpg"
               alt="Logo Lapangin"
                className="w-full h-full object-cover"
           />
          </div>
          {/* Nama Brand */}
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


       <section className="px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
          <div className="mb-10 flex content-center items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <Image   src="/logo2.jpg" alt="Logo Booking Lapangan" width={40} height={40} className="h-10 w-10 rounded-xl" />
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#26372b]">Booking Lapangan</span>
            </div>
          </div>

          <div className="max-w-md rounded-[10px] border border-[#e5e9e1] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#82913c]">Selamat datang</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#26372b] sm:text-5xl">Masuk ke akunmu.</h2>
            <p className="mt-4 text-sm leading-6 text-[#718078]">Lanjutkan rencana pertandinganmu hari ini.</p>

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#526157]">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full rounded-xl border border-[#dce1d5] bg-[#f8f9f5] px-4 py-3.5 text-sm text-[#26372b] outline-none transition placeholder:text-[#a3ada5] focus:border-[#9eb82d] focus:bg-white focus:ring-4 focus:ring-[#b7d334]/15" />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#526157]">Password</label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" className="w-full rounded-xl border border-[#dce1d5] bg-[#f8f9f5] px-4 py-3.5 text-sm text-[#26372b] outline-none transition placeholder:text-[#a3ada5] focus:border-[#9eb82d] focus:bg-white focus:ring-4 focus:ring-[#b7d334]/15" />
                <a href="#forgot" className="mt-2 block text-right text-xs font-bold text-[#82913c] hover:text-[#526157]">Lupa password?</a>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#26372b] py-4 text-sm font-bold text-[#e5f28e] shadow-lg shadow-[#26372b]/20 transition hover:bg-[#344b39] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60">
                {loading ? "Memproses..." : "Masuk Sekarang"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a3ada5]">
              <div className="h-px flex-1 bg-[#e5e9e1]" />
              <span>atau</span>
              <div className="h-px flex-1 bg-[#e5e9e1]" />
            </div>

            <button type="button" onClick={handleGoogleLogin} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dce1d5] bg-white px-4 py-3.5 text-sm font-bold text-[#526157] transition hover:border-[#b7c6ad] hover:bg-[#f8f9f5] disabled:cursor-wait disabled:opacity-60">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#dce1d5] text-sm font-black text-[#4285F4]">G</span>
              {loading ? "Menghubungkan..." : "Lanjutkan dengan Google"}
            </button>

            <p className="mt-8 text-center text-sm text-[#718078]">Belum punya akun? <Link href="/register" className="font-bold text-[#82913c] hover:text-[#526157]">Daftar di sini</Link></p>
          </div>
        </section>
    </main>
  );
}