"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await signUp.email(
        { name, email, password, callbackURL: "/login" },
        {
          onSuccess: () => {
            setSuccessMessage("Akun berhasil dibuat. Mengarahkan ke login...");
            setTimeout(() => router.push("/login"), 800);
          },
          onError: (context) => {
            setErrorMessage(context.error.message);
            setLoading(false);
          },
        }
      );
    } catch {
      setErrorMessage("Terjadi masalah koneksi. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#eef0e8] px-4 py-6 text-[#18231d] sm:px-8 lg:px-12">
      <section className="relative mx-auto w-full max-w-md rounded-4xl border border-[#dce1d5] bg-white px-6 py-10 shadow-[0_30px_90px_rgba(25,39,27,0.16)] sm:px-12 sm:py-14">
          <div className="mx-auto max-w-md">
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#26372b] sm:text-5xl">Register</h2>
            <p className="mt-4 text-sm leading-6 text-[#718078]">Buat akun untuk mulai booking lapangan pilihanmu.</p>

            {errorMessage ? <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</p> : null}
            {successMessage ? <p className="mt-5 rounded-xl bg-[#f1f7d8] px-4 py-3 text-sm font-semibold text-[#526b16]">{successMessage}</p> : null}

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#526157]">Nama lengkap</label>
                <input id="name" type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama kamu" className="w-full rounded-xl border border-[#dce1d5] bg-[#f8f9f5] px-4 py-3.5 text-sm text-[#26372b] outline-none transition placeholder:text-[#a3ada5] focus:border-[#9eb82d] focus:bg-white focus:ring-4 focus:ring-[#b7d334]/15" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#526157]">Email</label>
                <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" className="w-full rounded-xl border border-[#dce1d5] bg-[#f8f9f5] px-4 py-3.5 text-sm text-[#26372b] outline-none transition placeholder:text-[#a3ada5] focus:border-[#9eb82d] focus:bg-white focus:ring-4 focus:ring-[#b7d334]/15" />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#526157]">Password</label>
                <input id="password" type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 8 karakter" className="w-full rounded-xl border border-[#dce1d5] bg-[#f8f9f5] px-4 py-3.5 text-sm text-[#26372b] outline-none transition placeholder:text-[#a3ada5] focus:border-[#9eb82d] focus:bg-white focus:ring-4 focus:ring-[#b7d334]/15" />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#26372b] py-4 text-sm font-bold text-[#e5f28e] shadow-lg shadow-[#26372b]/20 transition hover:bg-[#344b39] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60">
                {loading ? "Membuat akun..." : "Buat Akun"}
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-[#718078]">Sudah punya akun? <Link href="/" className="font-bold text-[#82913c] hover:text-[#526157]">Masuk di sini</Link></p>
          </div>
      </section>
    </main>
  );
}
