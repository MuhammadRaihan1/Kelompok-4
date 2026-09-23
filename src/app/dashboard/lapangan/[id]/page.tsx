"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Lapangan = {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string | null;
  price: number;
  picture_url: string | null;
  isActive: boolean;
};

type Booking = {
  id: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED";
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatJam(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatTanggal(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

/* =====================================================
   SIDEBAR
===================================================== */

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col bg-[#020719] text-white">

      {/* LOGO */}
      <div className="flex h-[106px] items-center border-b border-white/10 px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
            ⚽
          </div>

          <div>
            <h1 className="text-lg font-bold">
              Lapangin
            </h1>

            <p className="text-xs text-slate-400">
              Booking Lapangan
            </p>
          </div>
        </Link>
      </div>

      {/* MENU */}
      <div className="flex-1 px-3 py-7">

        <p className="mb-5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu Utama
        </p>

        <nav className="space-y-2">

          <Link
            href="/dashboard"
            className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span className="w-6 text-center text-xl">
              ▦
            </span>

            <span className="text-[15px] font-medium">
              Dashboard
            </span>
          </Link>

          <Link
            href="/dashboard/lapangan"
            className="flex items-center gap-4 rounded-xl bg-[#1d2a40] px-4 py-3.5 text-white shadow-sm"
          >
            <span className="w-6 text-center text-xl">
              ▣
            </span>

            <span className="text-[15px] font-semibold">
              Lapangan
            </span>
          </Link>

          <Link
            href="/dashboard/booking"
            className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span className="w-6 text-center text-xl">
              ▤
            </span>

            <span className="text-[15px] font-medium">
              Pesan Lapangan
            </span>
          </Link>

          <Link
            href="/dashboard/riwayat"
            className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span className="w-6 text-center text-xl">
              ◷
            </span>

            <span className="text-[15px] font-medium">
              Riwayat Pemesanan
            </span>
          </Link>

        </nav>
      </div>

      {/* FOOTER */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-slate-500">
            Login sebagai
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            Customer
          </p>
        </div>
      </div>

    </aside>
  );
}

/* =====================================================
   PAGE
===================================================== */

export default function DetailLapanganPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [lapangan, setLapangan] = useState<Lapangan | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [tanggal, setTanggal] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(false);

  useEffect(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    setTanggal(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    if (!id || !tanggal) return;

    async function loadData() {
      try {
        setLoadingBooking(true);

        const response = await fetch(
          `/api/lapangan/${id}?date=${tanggal}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Gagal mengambil data"
          );
        }

        setLapangan(data.lapangan);
        setBookings(data.bookings || []);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(true);
        setLoadingBooking(false);
      }
    }

    loadData();
  }, [id, tanggal]);

  function masukBooking() {
    router.push(
      `/dashboard/booking?lapangan=${id}&date=${tanggal}`
    );
  }

  if (!lapangan && loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Sidebar />

        <main className="ml-[280px] min-h-screen p-10">
          <div className="animate-pulse">

            <div className="h-6 w-32 rounded bg-slate-200" />

            <div className="mt-4 h-10 w-96 rounded bg-slate-200" />

            <div className="mt-10 h-[400px] rounded-3xl bg-slate-200" />

          </div>
        </main>
      </div>
    );
  }

  if (!lapangan) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Sidebar />

        <main className="ml-[280px] min-h-screen p-10">

          <div className="rounded-3xl border border-red-100 bg-white p-12 text-center shadow-sm">

            <div className="text-6xl">
              ⚠️
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Lapangan Tidak Ditemukan
            </h1>

            <Link
              href="/dashboard/lapangan"
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white"
            >
              Kembali ke Lapangan
            </Link>

          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <Sidebar />

      <main className="ml-[280px] min-h-screen px-6 py-8 lg:px-10">

        <div className="mx-auto max-w-[1400px]">

          {/* BREADCRUMB */}

          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">

            <Link
              href="/dashboard/lapangan"
              className="hover:text-slate-900"
            >
              Lapangan
            </Link>

            <span>/</span>

            <span className="text-slate-900">
              {lapangan.name}
            </span>

          </div>

          {/* HEADER */}

          <div className="mb-8">

            <p className="text-sm font-medium text-slate-500">
              Detail Lapangan
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              {lapangan.name}
            </h1>

            <p className="mt-2 text-lg text-slate-500">
              Lihat informasi lapangan dan jadwal booking.
            </p>

          </div>

          {/* DETAIL */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr]">

              {/* IMAGE */}

              <div className="relative min-h-[350px] overflow-hidden bg-slate-100">

                {lapangan.picture_url ? (
                  <img
                    src={lapangan.picture_url}
                    alt={lapangan.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[350px] items-center justify-center">
                    <span className="text-8xl">
                      ⚽
                    </span>
                  </div>
                )}

                <div className="absolute left-5 top-5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow">
                  {lapangan.category}
                </div>

                <div className="absolute right-5 top-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 shadow-sm">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Tersedia
                </div>

              </div>

              {/* INFO */}

              <div className="p-8 lg:p-10">

                <div className="flex flex-col justify-between gap-6 md:flex-row">

                  <div>

                    <h2 className="text-3xl font-bold text-slate-950">
                      {lapangan.name}
                    </h2>

                    <p className="mt-3 text-slate-500">
                      📍 {lapangan.location}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-slate-50 px-5 py-4">

                    <p className="text-sm text-slate-400">
                      Harga per jam
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-950">
                      {formatRupiah(lapangan.price)}
                    </p>

                  </div>

                </div>

                {lapangan.description && (
                  <div className="mt-8">

                    <h3 className="font-semibold text-slate-900">
                      Deskripsi
                    </h3>

                    <p className="mt-3 leading-7 text-slate-500">
                      {lapangan.description}
                    </p>

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              PILIH TANGGAL
          ================================================= */}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <h2 className="text-xl font-bold text-slate-950">
                  Cek Jadwal Booking
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Pilih tanggal untuk melihat jam yang sudah dibooking.
                </p>

              </div>

              <input
                type="date"
                value={tanggal}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setTanggal(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />

            </div>

            {tanggal && (
              <div className="mt-6 rounded-2xl bg-slate-950 px-6 py-5 text-white">

                <p className="text-sm text-slate-400">
                  Booking untuk
                </p>

                <p className="mt-1 text-lg font-bold">
                  {formatTanggal(tanggal)}
                </p>

              </div>
            )}

          </div>

          {/* =================================================
              JAM SUDAH DIBOOKING
          ================================================= */}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-950">
                  Jadwal Lapangan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Jam yang sudah dipesan ditampilkan di bawah.
                </p>

              </div>

              <div className="hidden items-center gap-4 text-sm sm:flex">

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  Sudah Dibooking
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  Tersedia
                </div>

              </div>

            </div>

            {loadingBooking ? (
              <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                <p className="mt-4 text-sm text-slate-500">
                  Memeriksa jadwal...
                </p>

              </div>
            ) : bookings.length === 0 ? (

              <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center">

                <div className="text-4xl">
                  ✓
                </div>

                <h3 className="mt-3 font-bold text-emerald-700">
                  Belum Ada Booking
                </h3>

                <p className="mt-1 text-sm text-emerald-600">
                  Semua waktu pada tanggal ini belum memiliki booking.
                </p>

              </div>

            ) : (

              <div className="mt-8">

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {bookings.map((booking) => (

                    <div
                      key={booking.id}
                      className="rounded-2xl border border-red-100 bg-red-50 p-5"
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-semibold text-red-600">
                          Sudah Dibooking
                        </span>

                        <span className="h-3 w-3 rounded-full bg-red-500" />

                      </div>

                      <p className="mt-4 text-xl font-bold text-slate-950">
                        {formatJam(booking.startTime)}
                        {" - "}
                        {formatJam(booking.endTime)}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        {booking.status === "CONFIRMED"
                          ? "Booking telah dikonfirmasi"
                          : "Menunggu konfirmasi admin"}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>

          {/* =================================================
              BOOKING
          ================================================= */}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <h2 className="text-xl font-bold text-slate-950">
                  Siap Bermain?
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Pilih jam bermain dan lanjutkan ke halaman pemesanan.
                </p>

              </div>

              <button
                type="button"
                onClick={masukBooking}
                className="rounded-xl bg-slate-950 px-7 py-3.5 font-semibold text-white transition hover:bg-slate-800"
              >
                Booking Lapangan
              </button>

            </div>

          </div>

          {/* TOMBOL KEMBALI */}

          <div className="mt-6">

            <Link
              href="/dashboard/lapangan"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Kembali ke Daftar Lapangan
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}