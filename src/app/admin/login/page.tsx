"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // atau penamaan authClient Anda

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. HANDLER LOGIN EMAIL & PASSWORD (Manual)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.signIn.email(
        {
          email,
          password,
          // Bebas tentukan callbackURL awal, nanti middleware bisa mengoreksinya
          callbackURL: "/admin/dashboard",
        },
        {
          onSuccess: (ctx) => {
            // Cek jika akun yang login benar-benar admin
            if (ctx.data?.user?.role === "admin") {
              router.push("/admin/dashboard");
            } else {
              // Jika user biasa mencoba login dari halaman admin
              alert("Akses ditolak: Anda bukan Admin.");
              router.push("/dashboard");
            }
          },
          onError: (ctx) => {
            alert(ctx.error.message || "Email atau password salah.");
            setLoading(false);
          },
        }
      );
    } catch {
      alert("Terjadi kesalahan sistem saat melakukan login.");
      setLoading(false);
    }
  };

  // 2. HANDLER LOGIN GOOGLE
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/admin/dashboard",
      });
    } catch (error) {
      console.error("Google login error:", error);
      alert("Gagal terhubung dengan Google.");
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
          <div className="rounded-3xl border border-white/30 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">
           <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#82913c]">Selamat datang</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#26372b] sm:text-3xl">Login Admin.</h2>
          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#526157]">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@gmail.com" className="w-full rounded-xl border border-[#dce1d5] bg-[#f8f9f5] px-4 py-3.5 text-sm text-[#26372b] outline-none transition placeholder:text-[#a3ada5] focus:border-[#9eb82d] focus:bg-white focus:ring-4 focus:ring-[#b7d334]/15" />
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
          </div>
          </div>
      </section>
    </main>
  );
}