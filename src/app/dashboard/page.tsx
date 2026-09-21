import { auth } from "@/lib/auth";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const requestHeaders = await nextHeaders();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/");
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden lg:flex w-64 flex-col bg-slate-950 text-white">

          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center font-bold text-lg">
              L
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Lapangan
              </h1>

              <p className="text-xs text-slate-500">
                Booking Lapangan
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">

            <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Menu Utama
            </p>

            <div className="space-y-1">

              {/* Dashboard */}
              <a
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800 text-white font-medium"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>

                Dashboard
              </a>

              {/* List Lapangan */}
              <a
                href="/dashboard/lapangan"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 12h18" />
                  <path d="M12 4v16" />
                  <circle cx="12" cy="12" r="2" />
                </svg>

                Lapangan
              </a>

              {/* Pesan Lapangan */}
              <a
                href="/dashboard/booking"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                  <path d="M8 14h3" />
                  <path d="M8 17h6" />
                </svg>

                Pesan Lapangan
              </a>

              {/* Pembayaran */}
              <a
                href="/dashboard/pembayaran"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 10h18" />
                  <path d="M7 15h4" />
                </svg>

                Pembayaran
              </a>

              {/* Riwayat */}
              <a
                href="/dashboard/riwayat"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>

                Riwayat Pemesanan
              </a>

            </div>
          </nav>

          {/* User */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900">

              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.name}
                </p>

                <p className="text-xs text-slate-500 truncate">
                  {user.email}
                </p>
              </div>

            </div>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">

          {/* TOPBAR */}
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-5 md:px-8">

            {/* Mobile Logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <div className="w-9 h-9 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold">
                L
              </div>

              <span className="font-bold">
                Lapangan
              </span>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center w-80">
              <div className="relative w-full">

                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  placeholder="Cari lapangan..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:border-slate-400"
                />

              </div>
            </div>

            {/* User */}
            <div className="flex items-center gap-3 ml-auto">

              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">
                  {user.name}
                </p>

                <p className="text-xs text-slate-500">
                  Pelanggan
                </p>
              </div>

              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

            </div>
          </header>

          {/* PAGE */}
          <main className="p-5 md:p-8 max-w-[1600px] mx-auto">

            {/* Heading */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">
                  Dashboard
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                  Selamat datang,{" "}
                  {user.name?.split(" ")[0] || "Pelanggan"} 👋
                </h1>

                <p className="mt-2 text-slate-500">
                  Kelola pemesanan dan pantau penggunaan lapanganmu.
                </p>
              </div>

              <a
                href="/dashboard/lapangan"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-950 text-white font-semibold hover:bg-slate-800 transition"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>

                Pesan Lapangan
              </a>

            </div>

            {/* STATISTICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

              {/* Total Pemesanan */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Pemesanan
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                      0
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                      Semua pemesanan
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="4" width="18" height="17" rx="2" />
                      <path d="M16 2v4" />
                      <path d="M8 2v4" />
                      <path d="M3 10h18" />
                    </svg>
                  </div>

                </div>
              </div>

              {/* Booking Aktif */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Booking Aktif
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                      0
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                      Pemesanan aktif
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="m8 12 2.5 2.5L16 9" />
                    </svg>
                  </div>

                </div>
              </div>

              {/* Durasi Pemakaian */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Durasi Pemakaian
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                      0 jam
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                      Total penggunaan
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </div>

                </div>
              </div>

              {/* Pembayaran */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Pembayaran
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                      0
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                      Menunggu pembayaran
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 10h18" />
                      <path d="M7 15h4" />
                    </svg>
                  </div>

                </div>
              </div>

            </div>

            {/* BANNER */}
            <div className="bg-slate-950 rounded-2xl p-6 md:p-8 text-white mb-8 relative overflow-hidden">

              <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-slate-800 opacity-60" />

              <div className="absolute right-20 -bottom-32 w-72 h-72 rounded-full bg-slate-800 opacity-40" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div className="max-w-2xl">

                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300 mb-4">
                    ⚡ Booking lebih mudah
                  </span>

                  <h2 className="text-2xl md:text-3xl font-bold">
                    Cari dan pesan lapangan
                  </h2>

                  <p className="mt-2 text-slate-400">
                    Cek ketersediaan lapangan, pilih jadwal,
                    kemudian lakukan pemesanan dengan mudah.
                  </p>

                </div>

                <a
                  href="/dashboard/lapangan"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-100 transition whitespace-nowrap"
                >
                  Lihat Lapangan

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </a>

              </div>
            </div>

            {/* BOTTOM CONTENT */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Riwayat Pemesanan */}
              <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl">

                <div className="flex items-center justify-between p-6 border-b border-slate-200">

                  <div>
                    <h3 className="text-lg font-bold">
                      Riwayat Pemesanan
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Daftar pemesanan lapangan terbaru
                    </p>
                  </div>

                  <a
                    href="/dashboard/riwayat"
                    className="text-sm font-semibold text-slate-700 hover:text-slate-950"
                  >
                    Lihat semua
                  </a>

                </div>

                <div className="p-10 text-center">

                  <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">

                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>

                  </div>

                  <h4 className="mt-4 font-semibold">
                    Belum ada pemesanan
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Pesan lapangan pertama kamu sekarang.
                  </p>

                  <a
                    href="/dashboard/lapangan"
                    className="inline-flex mt-5 px-4 py-2.5 rounded-lg bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition"
                  >
                    Cari Lapangan
                  </a>

                </div>

              </div>

              {/* Durasi Pemakaian */}
              <div className="bg-white border border-slate-200 rounded-2xl">

                <div className="p-6 border-b border-slate-200">

                  <h3 className="text-lg font-bold">
                    Durasi Pemakaian
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Ringkasan penggunaan lapangan
                  </p>

                </div>

                <div className="p-6">

                  <div className="flex items-center justify-between mb-6">

                    <div>
                      <p className="text-sm text-slate-500">
                        Total penggunaan
                      </p>

                      <p className="text-3xl font-bold mt-1">
                        0 jam
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">

                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>

                    </div>

                  </div>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-500">
                      Pemakaian bulan ini
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      0%
                    </span>

                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-slate-950 rounded-full"
                      style={{ width: "0%" }}
                    />

                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">

                    <p className="text-sm text-slate-500">
                      Belum ada data penggunaan.
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Data akan muncul setelah kamu melakukan pemesanan.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </main>
        </div>
      </div>
    </main>
  );
}