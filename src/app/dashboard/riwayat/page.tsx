import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* =====================================================
   HELPER
===================================================== */

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTanggal(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatJam(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function hitungDurasi(startTime: Date, endTime: Date) {
  const selisih = endTime.getTime() - startTime.getTime();

  const totalMenit = Math.max(
    0,
    Math.round(selisih / (1000 * 60))
  );

  const jam = Math.floor(totalMenit / 60);
  const menit = totalMenit % 60;

  if (menit === 0) {
    return `${jam} jam`;
  }

  return `${jam} jam ${menit} menit`;
}

/* =====================================================
   ICON
===================================================== */

/* =====================================================
   SIDEBAR
===================================================== */

function Sidebar() {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:h-screen w-64 flex-col bg-slate-950 text-white">
          {/* LOGO */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
            <img
              src="/logo2.jpg"
              alt="Logo Lapangan"
              className="w-10 h-10 rounded-xl object-contain bg-white"
            />
            <div>
              <h1 className="text-lg font-bold tracking-tight">
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

              {/* DASHBOARD */}
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
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                  />
                  <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                  />
                  <rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                  />
                </svg>
                Dashboard
              </a>

              {/* LAPANGAN */}

              <Link
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
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                  />
                  <path d="M3 12h18" />
                  <path d="M12 4v16" />
                  <circle
                    cx="12"
                    cy="12"
                    r="2"
                  />
                </svg>
                Lapangan
              </Link>
              {/* BOOKING */}
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
                  <path d="M8 14h3" />
                  <path d="M8 17h6" />
                </svg>
                Pesan Lapangan
              </a>

              {/* RIWAYAT */}
              <a
                href="/dashboard/riwayat"
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
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />
                  <path d="M12 7v5l3 2" />
                </svg>
                Riwayat Pemesanan
              </a>
            </div>
          </nav>

          {/* USER SIDEBAR */}

          <div className="p-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Lapangin. Semua hak dilindungi.
            </p>
          </div>
        </aside>
  );
}

/* =====================================================
   STATUS BOOKING
===================================================== */

function StatusBooking({
  status,
}: {
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}) {
  if (status === "CONFIRMED") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Dikonfirmasi
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Dibatalkan
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
      <span className="h-2 w-2 rounded-full bg-orange-500" />
      Menunggu
    </span>
  );
}

/* =====================================================
   STATUS PEMBAYARAN
===================================================== */

function StatusPembayaran({
  status,
}: {
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}) {
  if (status === "CONFIRMED") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600">
        <span>✓</span>
        Sudah Dibayar
      </div>
    );
  }

  if (status === "CANCELLED") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
        <span>✕</span>
        Dibatalkan
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">
      <span>◷</span>
      Menunggu Pembayaran
    </div>
  );
}

/* =====================================================
   HALAMAN RIWAYAT
===================================================== */

export default async function RiwayatPage() {

  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/");
  }

  const user = session.user;

  async function logout() {
    "use server";

    await auth.api.signOut({
      headers: requestHeaders,
    });

    redirect("/");
  }

  /* ===================================================
     CUSTOMER
  =================================================== */

  const customer = await prisma.customer.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  /* ===================================================
     CUSTOMER TIDAK DITEMUKAN
  =================================================== */

  if (!customer) {
    return (
      <div className="flex-2 min-w-0 lg:ml-64">

        <Sidebar />

        <main className="ml-[304px] min-h-screen p-10">

          <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              ⚠️
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              riwayat pemesanan tidak tersedia
            </h1>
            <Link
              href="/dashboard"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Kembali ke Dashboard
            </Link>

          </div>

        </main>

      </div>
    );
  }

  /* ===================================================
     BOOKING
  =================================================== */

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: customer.id,
    },

    include: {
      lapangan: true,

      payments: {
        orderBy: {
          createdAt: "desc",
        },

        take: 1,
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  /* ===================================================
     STATISTIK
  =================================================== */

  const totalBooking = bookings.length;

  const bookingConfirmed = bookings.filter(
    (booking) =>
      booking.status === "CONFIRMED"
  ).length;

  const bookingPending = bookings.filter(
    (booking) =>
      booking.status === "PENDING"
  ).length;

  const bookingCancelled = bookings.filter(
    (booking) =>
      booking.status === "CANCELLED"
  ).length;

  /* ===================================================
     TOTAL NILAI BOOKING
  =================================================== */

  const totalNilaiBooking = bookings.reduce(
    (total, booking) => {

      const durasi =
        (booking.endTime.getTime() -
          booking.startTime.getTime()) /
        (1000 * 60 * 60);

      return (
        total +
        booking.lapangan.price *
          durasi
      );

    },
    0
  );

  /* ===================================================
     RETURN
  =================================================== */

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <Sidebar />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8 lg:ml-64">
            {/* MOBILE LOGO */}
            <div className="flex items-center gap-3 lg:hidden">
             <img
                src="/logo2.jpg"
                alt="Logo Lapangan"
                className="w-10 h-10 rounded-xl object-contain bg-white"
              />
              <span className="font-bold">
                Lapangin
              </span>
            </div>
            {/* BREADCRUMB */}
            <div className="hidden w-full items-center justify-between text-sm md:flex">
              <div className="flex items-center gap-2">
                <a
                  href="/dashboard"
                  className="text-slate-400 transition hover:text-slate-700"
                >
                  Dashboard
                </a>
                <span className="text-slate-300">
                  /
                </span>
                <span className="font-medium text-slate-700">
                  Riwayat Pemesanan
                </span>
              </div>

              <div className="flex items-center gap-2">
              <details className="relative shrink-0">
                <summary
                  aria-label="Notifikasi"
                  className="relative flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 [&::-webkit-details-marker]:hidden"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </summary>
                <div className="absolute right-0 z-20 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-950">Notifikasi</h2>
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">Baru</span>
                  </div>
                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-900">Pesan terbaru</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Booking Anda telah diterima. Silakan cek detail pemesanan untuk melihat status dan bukti pembayaran.
                    </p>
                  </div>
                </div>
              </details>
              <details className="relative shrink-0">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl p-1 hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold  text-slate-950">
                      {user.name || "Pelanggan"}
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
                      {user.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>
                  )}
                </summary>
                <div className="absolute right-0 top-14 z-20 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                  <p className="text-sm font-semibold text-slate-950">
                    {user.name || "Pelanggan"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {user.email}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Status: Pelanggan
                  </div>
                  <form action={logout} className="mt-4 border-t border-slate-100 pt-3">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Keluar
                    </button>
                  </form>
                </div>
              </details>
              </div>
            </div>
          </header>

      {/* =================================================
          KONTEN UTAMA

          PENTING:
          Sidebar = 304px
          Main    = ml-[304px]
      ================================================= */}

      <main className="min-w-0 min-h-screen px-6 py-8 lg:ml-64 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          {/*=================================================
              HEADER
          ================================================= */}

          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-slate-500">
              Pemesanan
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              Riwayat Pemesanan
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Lihat seluruh riwayat booking lapangan yang pernah kamu lakukan.
            </p>

          </div>

          {/* =================================================
              STATISTIK
          ================================================= */}

          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Total Booking
                  </p>

                  <p className="mt-3 text-4xl font-bold text-slate-950">
                    {totalBooking}
                  </p>

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  ▣
                </div>

              </div>

            </div>

            {/* CONFIRMED */}

            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Dikonfirmasi
                  </p>

                  <p className="mt-3 text-4xl font-bold text-emerald-600">
                    {bookingConfirmed}
                  </p>

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-500">
                  ✓
                </div>

              </div>

            </div>

            {/* PENDING */}

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Menunggu
                  </p>

                  <p className="mt-3 text-4xl font-bold text-orange-500">
                    {bookingPending}
                  </p>

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-500">
                  ◷
                </div>

              </div>

            </div>

            {/* CANCELLED */}

            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Dibatalkan
                  </p>

                  <p className="mt-3 text-4xl font-bold text-red-600">
                    {bookingCancelled}
                  </p>

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-2xl text-red-500">
                  ✕
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              TOTAL NILAI BOOKING
          ================================================= */}

          {totalBooking > 0 && (

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                <div>

                  <p className="text-sm text-slate-500">
                    Total Nilai Booking
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {formatRupiah(
                      totalNilaiBooking
                    )}
                  </p>

                </div>

                <p className="text-sm text-slate-500">
                  Perhitungan berdasarkan harga lapangan dan durasi bermain.
                </p>

              </div>

            </div>

          )}

          {/* =================================================
              BELUM ADA BOOKING
          ================================================= */}

          {bookings.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="text-6xl">
                ⚽
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Belum Ada Riwayat Pemesanan
              </h2>

              <p className="mx-auto mt-3 max-w-md text-slate-500">
                Kamu belum melakukan pemesanan lapangan.
                Silakan pilih lapangan favoritmu dan mulai bermain.
              </p>
            </div>

          ) : (

            /* =================================================
               LIST BOOKING
            ================================================= */

            <div className="space-y-6">

              {bookings.map((booking) => {

                const durasiJam =
                  (booking.endTime.getTime() -
                    booking.startTime.getTime()) /
                  (1000 * 60 * 60);

                const totalHarga =
                  booking.lapangan.price *
                  durasiJam;

                const payment =
                  booking.payments[0] ?? null;

                return (

                  <div
                    key={booking.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >

                    {/* =================================================
                        HEADER CARD
                    ================================================= */}

                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-7 py-6 md:flex-row md:items-center">

                      <div>

                        <p className="text-sm uppercase tracking-wide text-slate-400">
                          ID Booking
                        </p>

                        <p className="mt-1 font-mono text-lg font-bold text-slate-900">
                          #
                          {booking.id
                            .slice(0, 8)
                            .toUpperCase()}
                        </p>

                      </div>

                      <StatusBooking
                        status={booking.status}
                      />

                    </div>

                    {/* =================================================
                        ISI CARD
                    ================================================= */}

                    <div className="p-7">

                      <div className="grid grid-cols-1 gap-7 xl:grid-cols-[1fr_280px]">

                        {/* =================================================
                            INFORMASI LAPANGAN
                        ================================================= */}

                        <div>

                          <div className="flex flex-col gap-5 md:flex-row">

                            {/* GAMBAR */}

                            <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 md:w-40">

                              {booking.lapangan.picture_url ? (

                                <img
                                  src={
                                    booking.lapangan
                                      .picture_url
                                  }
                                  alt={
                                    booking.lapangan
                                      .name
                                  }
                                  className="h-full w-full object-cover"
                                />

                              ) : (

                                <span className="text-5xl">
                                  ⚽
                                </span>

                              )}

                            </div>

                            {/* DETAIL */}

                            <div className="flex-1">

                              <div className="flex flex-wrap items-center gap-3">

                                <h2 className="text-2xl font-bold uppercase text-slate-950">
                                  {
                                    booking
                                      .lapangan
                                      .name
                                  }
                                </h2>

                                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                  {
                                    booking
                                      .lapangan
                                      .category
                                  }
                                </span>

                              </div>

                              <p className="mt-3 text-slate-500">
                                📍{" "}
                                {
                                  booking
                                    .lapangan
                                    .location
                                }
                              </p>

                              {booking.lapangan.description && (

                                <p className="mt-4 text-sm leading-6 text-slate-500">
                                  {
                                    booking
                                      .lapangan
                                      .description
                                  }
                                </p>

                              )}

                            </div>

                          </div>

                          {/* =================================================
                              DETAIL WAKTU
                          ================================================= */}

                          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">

                            {/* TANGGAL */}

                            <div className="rounded-xl bg-slate-50 p-5">

                              <p className="text-sm text-slate-400">
                                📅 Tanggal
                              </p>

                              <p className="mt-3 font-semibold text-slate-900">
                                {formatTanggal(
                                  booking.startTime
                                )}
                              </p>

                            </div>

                            {/* JAM */}

                            <div className="rounded-xl bg-slate-50 p-5">

                              <p className="text-sm text-slate-400">
                                ◷ Jam Bermain
                              </p>

                              <p className="mt-3 font-semibold text-slate-900">
                                {formatJam(
                                  booking.startTime
                                )}{" "}
                                -{" "}
                                {formatJam(
                                  booking.endTime
                                )}
                              </p>

                            </div>

                            {/* DURASI */}

                            <div className="rounded-xl bg-slate-50 p-5">

                              <p className="text-sm text-slate-400">
                                ◷ Durasi
                              </p>

                              <p className="mt-3 font-semibold text-slate-900">
                                {hitungDurasi(
                                  booking.startTime,
                                  booking.endTime
                                )}
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* =================================================
                            PEMBAYARAN
                        ================================================= */}

                        <div className="rounded-2xl bg-slate-50 p-6">

                          <p className="text-sm uppercase tracking-wide text-slate-400">
                            Total Booking
                          </p>

                          <p className="mt-2 text-2xl font-bold text-slate-950">
                            {formatRupiah(
                              totalHarga
                            )}
                          </p>

                          <div className="my-5 h-px bg-slate-200" />

                          {/* HARGA */}

                          <div className="flex items-center justify-between">

                            <span className="text-sm text-slate-500">
                              Harga / jam
                            </span>

                            <span className="font-semibold text-slate-900">
                              {formatRupiah(
                                booking
                                  .lapangan
                                  .price
                              )}
                            </span>

                          </div>

                          {/* DURASI */}

                          <div className="mt-4 flex items-center justify-between">

                            <span className="text-sm text-slate-500">
                              Durasi
                            </span>

                            <span className="font-semibold text-slate-900">
                              {hitungDurasi(
                                booking.startTime,
                                booking.endTime
                              )}
                            </span>

                          </div>

                          <div className="my-5 h-px bg-slate-200" />

                          <p className="mb-3 text-sm uppercase tracking-wide text-slate-400">
                            Pembayaran
                          </p>

                          <StatusPembayaran
                            status={booking.status}
                          />

                          {/* CONFIRMED */}

                          {booking.status ===
                            "CONFIRMED" && (

                            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                              <p className="text-sm font-semibold text-emerald-700">
                                ✓ Pembayaran telah dikonfirmasi
                              </p>

                              <p className="mt-2 text-xs leading-5 text-emerald-600">
                                Booking telah dikonfirmasi
                                oleh admin. Lapangan dianggap
                                sudah dibayar.
                              </p>

                              {payment?.paymentDate && (

                                <p className="mt-2 text-xs text-emerald-600">

                                  Dibayar pada:{" "}

                                  {formatTanggal(
                                    payment.paymentDate
                                  )}

                                </p>

                              )}

                            </div>

                          )}

                          {/* PENDING */}

                          {booking.status ===
                            "PENDING" && (

                            <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 p-4">

                              <p className="text-sm font-semibold text-orange-700">
                                ◷ Menunggu konfirmasi admin
                              </p>

                              <p className="mt-2 text-xs leading-5 text-orange-600">
                                Silakan tunggu sampai admin
                                mengonfirmasi booking kamu.
                              </p>

                            </div>

                          )}

                          {/* CANCELLED */}

                          {booking.status ===
                            "CANCELLED" && (

                            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">

                              <p className="text-sm font-semibold text-red-700">
                                ✕ Booking dibatalkan
                              </p>

                              <p className="mt-2 text-xs leading-5 text-red-600">
                                Booking lapangan ini telah
                                dibatalkan oleh admin.
                              </p>

                            </div>

                          )}

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        FOOTER CARD
                    ================================================= */}

                    <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-7 py-5 sm:flex-row sm:items-center">

                      <p className="text-sm text-slate-500">

                        Dibuat pada{" "}

                        <span className="font-medium text-slate-700">
                          {formatTanggal(
                            booking.createdAt
                          )}
                        </span>
                      </p>
                     </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}