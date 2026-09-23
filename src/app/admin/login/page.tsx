"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // LOGIN EMAIL & PASSWORD
  // =========================================================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    if (!email || !password) {
      alert("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/admin/dashboard",
      });

      console.log("HASIL LOGIN:", result);

      if (result.error) {
        alert(
          result.error.message ||
            "Email atau password salah."
        );

        setLoading(false);
        return;
      }

      // Login berhasil
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        "Terjadi kesalahan saat melakukan login."
      );

      setLoading(false);
    }
  };

  // =========================================================
  // LOGIN GOOGLE
  // =========================================================
  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/admin/dashboard",
      });
    } catch (error) {
      console.error(
        "GOOGLE LOGIN ERROR:",
        error
      );

      alert(
        "Gagal terhubung dengan Google."
      );

      setLoading(false);
    }
  };

  // =========================================================
  // TAMPILAN
  // =========================================================
  return (
    <main
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{
        backgroundImage:
          "url('/lapangan.jpeg')",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-slate-950/60" />

      <section className="relative z-10 w-full max-w-md">

        {/* MOBILE LOGO */}
        <div className="lg:hidden flex items-center justify-center gap-3 mb-8">

          <div className="w-12 h-12 rounded-full bg-white overflow-hidden shadow-lg">
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

        {/* LOGIN CARD */}
        <div className="rounded-3xl border border-white/30 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">

          {/* HEADER */}
          <div>

            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#82913c]">
              Selamat datang
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#26372b] sm:text-3xl">
              Login Admin.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#68736b]">
              Masuk menggunakan akun administrator
              Lapangin.
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#526157]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="nama@gmail.com"
                disabled={loading}
                className="w-full rounded-xl border border-[#dce1d5] bg-[#f8f9f5] px-4 py-3.5 text-sm text-[#26372b] outline-none transition placeholder:text-[#a3ada5] focus:border-[#9eb82d] focus:bg-white focus:ring-4 focus:ring-[#b7d334]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#526157]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Masukkan password"
                disabled={loading}
                className="w-full rounded-xl border border-[#dce1d5] bg-[#f8f9f5] px-4 py-3.5 text-sm text-[#26372b] outline-none transition placeholder:text-[#a3ada5] focus:border-[#9eb82d] focus:bg-white focus:ring-4 focus:ring-[#b7d334]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <a
                href="#forgot"
                className="mt-2 block text-right text-xs font-bold text-[#82913c] hover:text-[#526157]"
              >
                Lupa password?
              </a>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-[#26372b] py-4 text-sm font-bold text-[#e5f28e] shadow-lg shadow-[#26372b]/20 transition hover:bg-[#344b39] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">

                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#e5f28e] border-t-transparent" />

                  Memproses...

                </span>
              ) : (
                "Masuk Sekarang"
              )}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="my-7 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a3ada5]">

            <div className="h-px flex-1 bg-[#e5e9e1]" />

            <span>atau</span>

            <div className="h-px flex-1 bg-[#e5e9e1]" />

          </div>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dce1d5] bg-white px-4 py-3.5 text-sm font-bold text-[#526157] transition hover:border-[#b7c6ad] hover:bg-[#f8f9f5] disabled:cursor-wait disabled:opacity-60"
          >

            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dce1d5] text-sm font-black text-[#4285F4]">
              G
            </span>

            {loading
              ? "Menghubungkan..."
              : "Lanjutkan dengan Google"}

          </button>

          {/* BACK TO USER LOGIN */}
          <div className="mt-7 text-center">

            <a
              href="/login"
              className="text-sm font-semibold text-[#82913c] hover:text-[#526157]"
            >
              Kembali ke login pengguna
            </a>

          </div>

        </div>

      </section>
    </main>
  );
}