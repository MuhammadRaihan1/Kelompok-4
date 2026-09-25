/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

import TambahLapangan from "./TambahLapangan";
import EditLapangan from "./EditLapangan";
import HapusLapangan from "./HapusLapangan";

/* =========================================================
   TYPE
========================================================= */

type Lapangan = {
  id: string;
  name: string;
  category: string;
  price: number | string;
  location: string;
  description: string | null;
  picture_url: string | null;
  isActive: boolean;
};

/* =========================================================
   ICON
========================================================= */

function MenuIcon({
  type,
}: {
  type:
    | "dashboard"
    | "field"
    | "booking"
    | "user"
    | "report";
}) {
  if (type === "dashboard") {
    return (
      <svg
        width="21"
        height="21"
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

  if (type === "field") {
    return (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="1"
        />
        <path d="M8 4v16" />
        <path d="M16 4v16" />
        <path d="M3 9h5" />
        <path d="M16 9h5" />
        <path d="M3 15h5" />
        <path d="M16 15h5" />
      </svg>
    );
  }

  if (type === "booking") {
    return (
      <svg
        width="21"
        height="21"
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
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 3v18h18" />
      <path d="m7 16 4-5 3 3 5-7" />
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
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
      />
      <circle
        cx="8.5"
        cy="8.5"
        r="1.5"
      />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

/* =========================================================
   FORMAT RUPIAH
========================================================= */

function formatRupiah(
  value: number | string
) {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(Number(value));
}

/* =========================================================
   ADMIN LAPANGAN
========================================================= */

export default function AdminLapanganPage() {
  const {
    data: session,
    isPending: sessionLoading,
  } = useSession();

  const [lapangan, setLapangan] =
    useState<Lapangan[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadLapangan =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/lapangan",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Gagal mengambil data lapangan."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "Data lapangan tidak valid."
          );
        }

        setLapangan(data);
      } catch (error) {
        console.error(
          "LOAD LAPANGAN ERROR:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data lapangan."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadLapangan();
  }, [loadLapangan]);

  /* =======================================================
     FILTER SEARCH
  ======================================================= */

  const filteredLapangan =
    lapangan.filter((item) => {
      const keyword =
        search
          .toLowerCase()
          .trim();

      return (
        item.name
          .toLowerCase()
          .includes(keyword) ||
        item.category
          .toLowerCase()
          .includes(keyword) ||
        item.location
          .toLowerCase()
          .includes(keyword)
      );
    });

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">

      <div className="min-h-screen">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="hidden w-64 flex-col bg-white text-[#143b01] shadow-lg lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:h-screen">

          {/* LOGO */}

          <div className="flex items-center gap-3 border-b border-[#dcebd8] bg-white px-6 py-6">
            <img
              src="/logo2.jpg"
              alt="Logo Lapangan"
              className="h-10 w-10 rounded-xl object-contain bg-white"
            />

            <div>
              <h1 className="text-lg font-bold">
                Lapangin
              </h1>

              <p className="text-xs text-slate-500">
                Booking Lapangan
              </p>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="flex-1 px-4 py-6">
            <div className="space-y-1">

              <Link
                href="/admin/dashboard"
                className="mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 text-[13px] font-medium text-[#496744] transition hover:bg-[#e8f3e5]"
              >
                <MenuIcon type="dashboard" />
                Dashboard
              </Link>

              <Link
                href="/admin/lapangan"
                className="mb-2 flex items-center gap-4 rounded-xl bg-[#184902] px-4 py-3.5 text-[13px] font-medium text-white"
              >
                <MenuIcon type="field" />
                Lapangan
              </Link>

              <Link
                href="/admin/booking"
                className="mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 text-[13px] font-medium text-[#496744] transition hover:bg-[#e8f3e5]"
              >
                <MenuIcon type="booking" />
                Riwayat Pemesanan
              </Link>

              <Link
                href="/admin/customer"
                className="mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 text-[13px] font-medium text-[#496744] transition hover:bg-[#e8f3e5]"
              >
                <MenuIcon type="user" />
                Manajemen User
              </Link>

              <Link
                href="/admin/laporan"
                className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-[13px] font-medium text-[#496744] transition hover:bg-[#e8f3e5]"
              >
                <MenuIcon type="report" />
                Laporan Pendapatan
              </Link>

            </div>
          </nav>

          {/* DASHBOARD USER */}

          <div className="border-t border-[#dcebd8] p-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#496744] transition hover:bg-[#e8f3e5]"
            >
              👤
              Dashboard User
            </Link>

            <div className="mt-3 border-t border-[#dcebd8] pt-4 text-center">
              <p className="text-xs text-[#6b8565]">
                © {new Date().getFullYear()} Lapangin.
                Semua hak dilindungi.
              </p>
            </div>
          </div>

        </aside>

        {/* =================================================
            MAIN
        ================================================= */}

        <div className="min-w-0 lg:ml-64 bg-[linear-gradient(135deg,#f8fbff_0%,#f4f7fc_48%,#eef5f1_100%)]">

          {/* HEADER */}

          <header className="sticky top-0 z-20 flex min-h-24 items-center justify-between border-b border-slate-200 bg-white px-5 py-5 shadow-sm md:px-8">

            <div className="rounded-2xl border border-[#e2eaf5] bg-white/70 px-4 py-3">
              <p className="text-[12px] font-medium text-[#022d7e]">
                Admin Panel
              </p>

              <h1 className="mt-1 text-[15px] font-bold text-[#07152f]">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">

              <button
                type="button"
                aria-label="Notifikasi"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe5ed] bg-[#f8fafc]"
              >
                🔔
              </button>

              <div className="h-10 w-px bg-slate-200" />

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-900">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={
                        session.user.name ||
                        "User"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-semibold text-white">
                      {(
                        session?.user?.name ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <p className="max-w-[180px] truncate text-sm font-semibold">
                    {session?.user?.name ||
                      "Administrator"}
                  </p>

                  <p className="text-xs text-slate-400">
                    Administrator
                  </p>
                </div>

              </div>
            </div>

          </header>

          {/* =================================================
              CONTENT
          ================================================= */}

          <section className="mx-auto w-full max-w-[1600px] p-5 md:p-8">

            {/* TITLE */}

            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>
                <p className="flex items-center gap-2 text-[14px] font-semibold text-[#3568b8]">
                  <span className="h-2 w-2 rounded-full bg-[#35b878]" />
                  Manajemen
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Daftar Lapangan
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Kelola lapangan yang tersedia
                  untuk pengguna.
                </p>
              </div>

              {/* KOMPONEN TAMBAH */}

              <TambahLapangan
                onSuccess={loadLapangan}
              />

            </div>

            {/* TOTAL */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Total Lapangan
              </p>

              <p className="mt-2 text-3xl font-bold">
                {lapangan.length}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Semua lapangan yang terdaftar
              </p>

            </div>

            {/* SEARCH */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Cari nama lapangan..."
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none"
              />

            </div>

            {/* LIST */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-5">
                <h3 className="text-lg font-bold">
                  Lapangan Terdaftar
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {filteredLapangan.length} lapangan ditemukan
                </p>
              </div>

              {loading ? (

                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

                  <p className="text-sm text-slate-400">
                    Memuat data lapangan...
                  </p>
                </div>

              ) : filteredLapangan.length === 0 ? (

                <div className="py-16 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <ImageIcon />
                  </div>

                  <h3 className="mt-5 font-bold">
                    Belum Ada Lapangan
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Tambahkan lapangan menggunakan tombol di atas.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {filteredLapangan.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="flex flex-col gap-5 rounded-2xl border border-slate-200 p-4 transition hover:shadow-sm md:flex-row md:items-center"
                      >

                        {/* GAMBAR */}

                        <div className="h-36 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 md:w-52">

                          {item.picture_url ? (

                            <img
                              src={
                                item.picture_url
                              }
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                              <ImageIcon />

                              <span className="text-xs">
                                Belum ada gambar
                              </span>
                            </div>

                          )}

                        </div>

                        {/* DETAIL */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h4 className="text-lg font-bold">
                              {item.name}
                            </h4>

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold">
                              {item.category}
                            </span>

                          </div>

                          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                            <LocationIcon />

                            {item.location}
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-500">
                            {item.description ||
                              "Tidak ada deskripsi."}
                          </p>

                        </div>

                        {/* HARGA */}

                        <div className="shrink-0">

                          <p className="text-xs text-slate-400">
                            Harga per jam
                          </p>

                          <p className="mt-1 text-lg font-bold">
                            {formatRupiah(
                              item.price
                            )}
                          </p>

                        </div>

                        {/* EDIT + HAPUS */}

                        <div className="flex shrink-0 items-center gap-2">

                          <EditLapangan
                            id={item.id}
                            name={item.name}
                            category={item.category}
                            price={item.price}
                            location={item.location}
                            description={
                              item.description
                            }
                            picture_url={
                              item.picture_url
                            }
                            onSuccess={
                              loadLapangan
                            }
                          />

                          <HapusLapangan
                            id={item.id}
                            name={item.name}
                            onSuccess={
                              loadLapangan
                            }
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}