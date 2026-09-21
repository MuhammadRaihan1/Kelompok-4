import { auth } from "@/lib/auth";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";

export default async function LapanganPage() {
  const requestHeaders = await nextHeaders();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/");
  }

  const user = session.user;

  const lapangan = [
    {
      id: 1,
      nama: "Lapangan Futsal A",
      kategori: "Futsal",
      harga: "Rp100.000",
      lokasi: "Padang",
      status: "Tersedia",
      deskripsi: "Lapangan futsal sintetis dengan fasilitas lengkap.",
      emoji: "⚽",
    },
    {
      id: 2,
      nama: "Lapangan Badminton A",
      kategori: "Badminton",
      harga: "Rp50.000",
      lokasi: "Padang",
      status: "Tersedia",
      deskripsi: "Lapangan badminton indoor dengan pencahayaan yang baik.",
      emoji: "🏸",
    },
    {
      id: 3,
      nama: "Lapangan Basket A",
      kategori: "Basket",
      harga: "Rp120.000",
      lokasi: "Padang",
      status: "Tersedia",
      deskripsi: "Lapangan basket dengan area bermain yang luas.",
      emoji: "🏀",
    },
    {
      id: 4,
      nama: "Lapangan Futsal B",
      kategori: "Futsal",
      harga: "Rp90.000",
      lokasi: "Padang",
      status: "Tidak Tersedia",
      deskripsi: "Lapangan futsal nyaman untuk pertandingan dan latihan.",
      emoji: "⚽",
    },
    {
      id: 5,
      nama: "Lapangan Badminton B",
      kategori: "Badminton",
      harga: "Rp60.000",
      lokasi: "Padang",
      status: "Tersedia",
      deskripsi: "Lapangan badminton premium dengan lantai berkualitas.",
      emoji: "🏸",
    },
    {
      id: 6,
      nama: "Lapangan Basket B",
      kategori: "Basket",
      harga: "Rp110.000",
      lokasi: "Padang",
      status: "Tersedia",
      deskripsi: "Lapangan basket indoor cocok untuk latihan bersama.",
      emoji: "🏀",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">

        {/* =====================================================
            SIDEBAR
        ====================================================== */}
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
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>

                Dashboard
              </a>


              {/* Lapangan */}
              <a
                href="/dashboard/lapangan"
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


        {/* =====================================================
            MAIN AREA
        ====================================================== */}
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


            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm">

              <a
                href="/dashboard"
                className="text-slate-400 hover:text-slate-700"
              >
                Dashboard
              </a>

              <span className="text-slate-300">
                /
              </span>

              <span className="font-medium text-slate-700">
                Lapangan
              </span>

            </div>


            {/* User Header */}
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


          {/* =====================================================
              PAGE CONTENT
          ====================================================== */}
          <main className="p-5 md:p-8 max-w-[1600px] mx-auto">

            {/* Heading */}
            <div className="mb-8">

              <p className="text-sm font-medium text-slate-500 mb-2">
                Lapangan
              </p>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Pilih Lapangan
              </h1>

              <p className="mt-2 text-slate-500">
                Cari lapangan, cek ketersediaan, dan pilih jadwal bermainmu.
              </p>

            </div>


            {/* =====================================================
                SEARCH & FILTER
            ====================================================== */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-7">

              <div className="flex flex-col lg:flex-row gap-4">

                {/* Search */}
                <div className="relative flex-1">

                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    width="19"
                    height="19"
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
                    placeholder="Cari nama lapangan..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none text-sm focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 transition"
                  />

                </div>


                {/* Filter Kategori */}
                <select
                  defaultValue="semua"
                  className="h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="semua">
                    Semua Olahraga
                  </option>

                  <option value="futsal">
                    Futsal
                  </option>

                  <option value="badminton">
                    Badminton
                  </option>

                  <option value="basket">
                    Basket
                  </option>
                </select>


                {/* Filter Status */}
                <select
                  defaultValue="semua"
                  className="h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="semua">
                    Semua Status
                  </option>

                  <option value="tersedia">
                    Tersedia
                  </option>

                  <option value="tidak-tersedia">
                    Tidak Tersedia
                  </option>
                </select>

              </div>

            </div>


            {/* =====================================================
                RESULT INFO
            ====================================================== */}
            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-lg font-bold">
                  Daftar Lapangan
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {lapangan.length} lapangan ditemukan
                </p>

              </div>


              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">

                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

                Tersedia

                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 ml-3" />

                Tidak tersedia

              </div>

            </div>


            {/* =====================================================
                LIST LAPANGAN
            ====================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {lapangan.map((item) => {

                const tersedia = item.status === "Tersedia";

                return (
                  <div
                    key={item.id}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition duration-200"
                  >

                    {/* Image Area */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">

                      <div className="text-7xl group-hover:scale-110 transition duration-300">
                        {item.emoji}
                      </div>


                      {/* Category */}
                      <div className="absolute left-4 top-4">

                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur text-xs font-semibold text-slate-700 shadow-sm">
                          {item.kategori}
                        </span>

                      </div>


                      {/* Status */}
                      <div className="absolute right-4 top-4">

                        {tersedia ? (

                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">

                            <span className="w-2 h-2 rounded-full bg-emerald-500" />

                            Tersedia

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200">

                            <span className="w-2 h-2 rounded-full bg-slate-400" />

                            Tidak tersedia

                          </span>

                        )}

                      </div>

                    </div>


                    {/* Content */}
                    <div className="p-5">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h3 className="text-lg font-bold text-slate-950">
                            {item.nama}
                          </h3>

                          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">

                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                              <circle cx="12" cy="10" r="2" />
                            </svg>

                            {item.lokasi}

                          </div>

                        </div>

                      </div>


                      <p className="mt-4 text-sm leading-6 text-slate-500">
                        {item.deskripsi}
                      </p>


                      {/* Separator */}
                      <div className="h-px bg-slate-100 my-5" />


                      {/* Price */}
                      <div className="flex items-end justify-between mb-5">

                        <div>

                          <p className="text-xs text-slate-400">
                            Mulai dari
                          </p>

                          <div className="flex items-end gap-1 mt-1">

                            <p className="text-xl font-bold text-slate-950">
                              {item.harga}
                            </p>

                            <span className="text-sm text-slate-400 mb-0.5">
                              /jam
                            </span>

                          </div>

                        </div>


                        {/* Availability Icon */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            tersedia
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >

                          <svg
                            width="19"
                            height="19"
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


                      {/* Buttons */}
                      <div className="flex gap-3">

                        <a
                          href={`/dashboard/lapangan/${item.id}`}
                          className="flex-1 h-11 inline-flex items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          Lihat Detail
                        </a>


                        {tersedia ? (

                          <a
                            href={`/dashboard/lapangan/${item.id}`}
                            className="flex-1 h-11 inline-flex items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800 transition"
                          >
                            Booking
                          </a>

                        ) : (

                          <button
                            disabled
                            className="flex-1 h-11 rounded-xl bg-slate-100 text-sm font-semibold text-slate-400 cursor-not-allowed"
                          >
                            Penuh
                          </button>

                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>


            {/* =====================================================
                INFORMATION
            ====================================================== */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">

              <div className="flex items-start gap-4">

                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v5" />
                    <path d="M12 8h.01" />
                  </svg>

                </div>

                <div>

                  <h3 className="font-semibold text-slate-900">
                    Informasi Ketersediaan
                  </h3>

                  <p className="text-sm text-slate-600 mt-1 leading-6">
                    Status ketersediaan di atas merupakan informasi umum.
                    Pilih lapangan dan tanggal bermain untuk melihat jadwal
                    yang masih tersedia secara lebih detail.
                  </p>

                </div>

              </div>

            </div>

          </main>

        </div>

      </div>
    </main>
  );
}