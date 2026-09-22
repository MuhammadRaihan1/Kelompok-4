import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";

import TambahLapangan from "./TambahLapangan";
import HapusLapangan from "./HapusLapangan";

/* =========================================================
   ICONS
========================================================= */

function DashboardIcon() {
  return (
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
  );
}

function FieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 5h16v14H4z" />
      <path d="M4 9h16M8 5v14M16 5v14" />
    </svg>
  );
}

function BookingIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h2M14 14h2M8 17h2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19V5" />
      <path d="M4 19h17" />
      <path d="M7 16l4-5 3 2 5-7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminLapanganPage() {
  /* =======================================================
     CEK LOGIN
  ======================================================= */

  const requestHeaders = await nextHeaders();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/");
  }

  const user = session.user;

  /* =======================================================
     AMBIL DATA LAPANGAN DARI DATABASE
  ======================================================= */

  const lapangan = await prisma.lapangan.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  /* =======================================================
     STATISTIK
  ======================================================= */

  const totalLapangan = lapangan.length;

  /* =======================================================
     FORMAT RUPIAH
  ======================================================= */

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">

        {/* =================================================
            SIDEBAR
        ================================================== */}

        <aside className="hidden w-[250px] shrink-0 border-r border-slate-800 bg-slate-950 text-white lg:flex lg:flex-col">

          {/* LOGO */}

          <div className="flex h-[76px] items-center border-b border-slate-800 px-6">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
              <span className="text-lg font-bold">
                L
              </span>
            </div>

            <div className="ml-3">

              <p className="text-[15px] font-bold tracking-tight">
                Lapangin
              </p>

              <p className="text-[11px] text-slate-500">
                Admin Panel
              </p>

            </div>

          </div>

          {/* NAVIGATION */}

          <div className="flex-1 px-4 py-6">

            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Menu Utama
            </p>

            <nav className="space-y-1">

              {/* DASHBOARD */}

              <a
                href="/admin/dashboard"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                <DashboardIcon />
                Dashboard
              </a>

              {/* LAPANGAN */}

              <a
                href="/admin/lapangan"
                className="flex items-center gap-3 rounded-xl bg-slate-800 px-3 py-3 text-sm font-medium text-white"
              >
                <FieldIcon />
                Lapangan
              </a>

              {/* BOOKING */}

              <a
                href="/admin/booking"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                <BookingIcon />
                Riwayat Pemesanan
              </a>

              {/* USER */}

              <a
                href="/admin/users"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                <UsersIcon />
                Manajemen User
              </a>

              {/* LAPORAN */}

              <a
                href="/admin/laporan"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                <ReportIcon />
                Laporan Pendapatan
              </a>

            </nav>

          </div>

          {/* PROFILE ADMIN */}

          <div className="border-t border-slate-800 p-4">

            <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900">
                {(user.name || "A")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-white">
                  {user.name || "Admin"}
                </p>

                <p className="truncate text-[11px] text-slate-500">
                  Administrator
                </p>

              </div>

              <span className="text-slate-500">
                •••
              </span>

            </div>

          </div>

        </aside>

        {/* =================================================
            MAIN
        ================================================== */}

        <section className="min-w-0 flex-1">

          {/* =================================================
              TOPBAR
          ================================================== */}

          <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">

            <div>

              <p className="text-xs font-medium text-slate-400">
                Admin Panel
              </p>

              <h1 className="mt-1 text-lg font-bold text-slate-900">
                Kelola Lapangan
              </h1>

            </div>

            <div className="flex items-center gap-3">

              {/* SEARCH */}

              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:flex">

                <SearchIcon />

                <input
                  type="text"
                  placeholder="Cari lapangan..."
                  className="w-[210px] bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

              </div>

              {/* ADMIN PROFILE */}

              <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {(user.name || "A")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
                    {user.name || "Admin"}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Administrator
                  </p>

                </div>

              </div>

            </div>

          </header>

          {/* =================================================
              CONTENT
          ================================================== */}

          <div className="p-5 md:p-8">

            {/* =================================================
                PAGE HEADER
            ================================================== */}

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <p className="text-sm font-medium text-slate-400">
                  Manajemen Lapangan
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Daftar Lapangan
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Kelola lapangan futsal yang tersedia untuk pelanggan,
                  termasuk informasi, harga, dan lokasi.
                </p>

              </div>

              {/* TOMBOL TAMBAH */}

              <TambahLapangan />

            </div>

            {/* =================================================
                STATISTIK
            ================================================== */}

            <div className="mt-7 grid grid-cols-1 gap-4">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-slate-500">
                  Total Lapangan Futsal
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalLapangan}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Semua lapangan futsal yang terdaftar
                </p>

              </div>

            </div>

            {/* =================================================
                SEARCH
            ================================================== */}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">

                <SearchIcon />

                <input
                  type="text"
                  placeholder="Cari nama lapangan..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

              </div>

            </div>

            {/* =================================================
                LIST LAPANGAN
            ================================================== */}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

                <div>

                  <h3 className="text-base font-bold text-slate-900">
                    Lapangan Terdaftar
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {totalLapangan} lapangan ditemukan
                  </p>

                </div>

              </div>

              {/* DATABASE KOSONG */}

              {lapangan.length === 0 ? (

                <div className="px-5 py-16 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <FieldIcon />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-800">
                    Belum ada lapangan
                  </h3>

                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                    Belum ada lapangan futsal yang tersimpan
                    di database. Silakan tambahkan lapangan
                    menggunakan tombol Tambah Lapangan.
                  </p>

                </div>

              ) : (

                /* DATA LAPANGAN */

                <div className="divide-y divide-slate-100">

                  {lapangan.map((item) => (

                    <div
                      key={item.id}
                      className="flex flex-col gap-5 px-5 py-5 transition hover:bg-slate-50/60 lg:flex-row lg:items-center lg:justify-between"
                    >

                      {/* =================================================
                          INFO LAPANGAN
                      ================================================== */}

                      <div className="flex min-w-0 items-start gap-4">

                        {/* ICON FUTSAL */}

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                          ⚽
                        </div>

                        {/* DETAIL */}

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h4 className="text-sm font-bold text-slate-900">
                              {item.name}
                            </h4>

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                              Futsal
                            </span>

                          </div>

                          {/* LOCATION */}

                          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">

                            <LocationIcon />

                            {item.location}

                          </div>

                          {/* DESCRIPTION */}

                          <p className="mt-2 max-w-xl text-sm text-slate-500">
                            {item.description ||
                              "Tidak ada deskripsi."}
                          </p>

                        </div>

                      </div>

                      {/* =================================================
                          PRICE + DELETE
                      ================================================== */}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                        {/* PRICE */}

                        <div className="sm:min-w-[150px]">

                          <p className="text-[11px] text-slate-400">
                            Harga per jam
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {formatRupiah(item.price)}
                          </p>

                        </div>

                        {/* DELETE */}

                        <div className="flex items-center gap-2">

                          <HapusLapangan
                            id={item.id}
                            name={item.name}
                          />

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* =================================================
                INFORMATION
            ================================================== */}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-100/70 p-5">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                  <FieldIcon />
                </div>

                <div>

                  <h4 className="text-sm font-bold text-slate-800">
                    Pengelolaan Lapangan
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Data lapangan pada halaman ini diambil
                    langsung dari database. Lapangan yang
                    ditambahkan melalui Admin akan tersimpan
                    di database dan dapat ditampilkan pada
                    halaman Customer.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-[11px] text-slate-400 sm:flex-row">

              <p>
                © 2026 Lapangin. Admin Panel.
              </p>

              <p>
                Sistem Booking Lapangan
              </p>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}