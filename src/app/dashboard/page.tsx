import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

/* =========================================================
   HELPER
========================================================= */

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

  return {
    jam,
    menit,
    totalJam: totalMenit / 60,
    text:
      menit === 0
        ? `${jam} jam`
        : `${jam} jam ${menit} menit`,
  };
}

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
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h3" />
      <path d="M8 17h6" />
    </svg>
  );
}

function HistoryIcon() {
  return (
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
  );
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ClockIcon() {
  return (
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
  );
}

function CheckIcon() {
  return (
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
  );
}

function CalendarIcon() {
  return (
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
  );
}

function PaymentIcon() {
  return (
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
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default async function DashboardPage() {
  /* =======================================================
     SESSION
  ======================================================= */

  const requestHeaders = await nextHeaders();

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
      headers: await nextHeaders(),
    });

    redirect("/");
  }

  /* =======================================================
     CUSTOMER
  ======================================================= */

  const customer = await prisma.customer.findUnique({
    where: {
      userId: user.id,
    },
  });

  /* =======================================================
     DATA BOOKING
  ======================================================= */

  const bookings = customer
    ? await prisma.booking.findMany({
        where: {
          customerId: customer.id,
        },
        include: {
          lapangan: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  /* =======================================================
     STATISTIK
  ======================================================= */

  const totalPemesanan = bookings.length;

  const bookingAktif = bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;

  const menungguPembayaran = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const durasiPemakaian = bookings
    .filter((booking) => booking.status === "CONFIRMED")
    .reduce((total, booking) => {
      const durasi = hitungDurasi(
        booking.startTime,
        booking.endTime
      );

      return total + durasi.totalJam;
    }, 0);

  const durasiText = Number.isInteger(durasiPemakaian)
    ? `${durasiPemakaian} jam`
    : `${durasiPemakaian.toFixed(1)} jam`;

  /* =======================================================
     TOTAL PEMBAYARAN
  ======================================================= */

  const totalPembayaran = bookings
    .filter((booking) => booking.status === "CONFIRMED")
    .reduce((total, booking) => {
      const durasi = hitungDurasi(
        booking.startTime,
        booking.endTime
      );

      return (
        total +
        booking.lapangan.price * durasi.totalJam
      );
    }, 0);

  /* =======================================================
     DATA BULAN INI
  ======================================================= */

  const sekarang = new Date();

  const awalBulan = new Date(
    sekarang.getFullYear(),
    sekarang.getMonth(),
    1
  );

  const akhirBulan = new Date(
    sekarang.getFullYear(),
    sekarang.getMonth() + 1,
    1
  );

  const bookingBulanIni = bookings.filter(
    (booking) =>
      booking.createdAt >= awalBulan &&
      booking.createdAt < akhirBulan
  );

  const durasiBulanIni = bookingBulanIni
    .filter((booking) => booking.status === "CONFIRMED")
    .reduce((total, booking) => {
      const durasi = hitungDurasi(
        booking.startTime,
        booking.endTime
      );

      return total + durasi.totalJam;
    }, 0);

  const progressPemakaian = Math.min(
    100,
    Math.round((durasiBulanIni / 20) * 100)
  );

  /* =======================================================
     BOOKING TERBARU
  ======================================================= */

  const bookingTerbaru = bookings.slice(0, 5);

  const namaUser =
    user.name?.trim() || "Pelanggan";

  const namaDepan =
    namaUser.split(" ")[0] || "Pelanggan";

  const avatarText =
    namaUser.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#0f172a]">
      <div className="flex min-h-screen">

        {/* =================================================
            SIDEBAR DESKTOP
        ================================================= */}

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] flex-col border-r border-white/5 bg-[#050b1b] text-white lg:flex">

          {/* LOGO */}

          <div className="flex h-[88px] items-center border-b border-white/10 px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
                <img
                  src="/logo2.jpg"
                  alt="Lapangin"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Lapangin
                </h1>

                <p className="text-[11px] text-slate-400">
                  Booking Lapangan
                </p>
              </div>
            </Link>
          </div>

          {/* NAVIGATION */}

          <nav className="flex-1 px-4 py-7">

            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Menu Utama
            </p>

            <div className="space-y-1.5">

              {/* DASHBOARD */}

              <Link
                href="/dashboard"
                className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-[#07152f] shadow-lg shadow-black/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#07152f] text-white">
                  <DashboardIcon />
                </span>

                Dashboard
              </Link>

              {/* LAPANGAN */}

              <Link
                href="/dashboard/lapangan"
                 className="group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition group-hover:bg-white/10 group-hover:text-white">
                  <FieldIcon />
                </span>

                Lapangan
              </Link>

              {/* RIWAYAT */}

              <Link
                href="/dashboard/riwayat"
                className="group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition group-hover:bg-white/10 group-hover:text-white">
                  <HistoryIcon />
                </span>

                Riwayat Pemesanan
              </Link>
            </div>

            {/* CTA */}

            <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                ⚡
              </div>

              <p className="text-sm font-semibold">
                Mau bermain?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Temukan lapangan favoritmu dan booking sekarang.
              </p>

              <Link
                href="/dashboard/lapangan"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-[#07152f] transition hover:bg-slate-100"
              >
                Cari Lapangan
                <ArrowRightIcon />
              </Link>
            </div>
          </nav>

          {/* SIDEBAR FOOTER */}

          <div className="border-t border-white/10 p-5">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={namaUser}
                  className="h-9 w-9 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#07152f]">
                  {avatarText}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">
                  {namaUser}
                </p>

                <p className="text-[10px] text-slate-500">
                  Pelanggan
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] text-slate-600">
              © {new Date().getFullYear()} Lapangin
            </p>
          </div>
        </aside>

        {/* =================================================
            MAIN
        ================================================= */}

        <div className="min-w-0 flex-1 lg:ml-[270px]">

          {/* =================================================
              TOPBAR
          ================================================= */}

          <header className="sticky top-0 z-30 h-[82px] border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl md:px-8">

            <div className="flex h-full items-center justify-between">

              {/* MOBILE BRAND */}

              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <img
                    src="/logo2.jpg"
                    alt="Lapangin"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <p className="font-bold text-[#07152f]">
                    Lapangin
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Booking Lapangan
                  </p>
                </div>
              </div>

              {/* DESKTOP PAGE TITLE */}

              <div className="hidden lg:block">
                <p className="text-xs font-medium text-slate-400">
                  Dashboard
                </p>

                <h2 className="mt-0.5 text-lg font-bold text-[#07152f]">
                  Overview
                </h2>
              </div>

              {/* RIGHT */}

              <div className="ml-auto flex items-center gap-3">

                {/* NOTIFICATION */}

                <details className="relative">
                  <summary className="group flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">

                    <BellIcon />

                    <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  </summary>

                  <div className="absolute right-0 top-14 z-50 w-[350px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">

                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Notifikasi
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Informasi terbaru akun kamu
                        </p>
                      </div>

                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-500">
                        Baru
                      </span>
                    </div>

                    <div className="p-4">

                      <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                          ✓
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Booking terbaru
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Booking kamu dapat dilihat melalui halaman riwayat pemesanan.
                          </p>
                        </div>
                      </div>

                    </div>

                    <Link
                      href="/dashboard/riwayat"
                      className="block border-t border-slate-100 bg-slate-50 px-5 py-3 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      Lihat Riwayat
                    </Link>
                  </div>
                </details>

                {/* DIVIDER */}

                <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                {/* PROFILE */}

                <details className="group relative">
                  <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl p-1.5 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">

                    {user.image ? (
                      <img
                        src={user.image}
                        alt={namaUser}
                        className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-100"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#07152f] to-[#1d3557] text-sm font-bold text-white">
                        {avatarText}
                      </div>
                    )}

                    <div className="hidden text-left sm:block">
                      <p className="max-w-[170px] truncate text-sm font-bold text-slate-900">
                        {namaUser}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Pelanggan
                      </p>
                    </div>

                    <svg
                      className="hidden text-slate-400 sm:block"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>

                  <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">

                    <div className="bg-gradient-to-br from-[#07152f] to-[#172b4d] p-5 text-white">

                      <div className="flex items-center gap-3">

                        {user.image ? (
                          <img
                            src={user.image}
                            alt={namaUser}
                            className="h-12 w-12 rounded-xl object-cover ring-2 ring-white/20"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#07152f]">
                            {avatarText}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {namaUser}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-300">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">

                      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                        <div>
                          <p className="text-xs font-semibold text-emerald-700">
                            Akun Aktif
                          </p>

                          <p className="text-[10px] text-emerald-600">
                            Status pelanggan aktif
                          </p>
                        </div>
                      </div>

                      <form
                        action={logout}
                        className="mt-3 border-t border-slate-100 pt-3"
                      >
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
                        >
                          Keluar dari Akun
                        </button>
                      </form>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </header>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="mx-auto max-w-[1600px] p-5 md:p-8">

            {/* =================================================
                WELCOME
            ================================================= */}

            <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span className="text-xs font-semibold text-emerald-600">
                    Sistem aktif
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-[#07152f] md:text-4xl">
                  Selamat datang,{" "}
                  <span className="text-[#2e3963]">
                    {namaDepan}
                  </span>{" "}
                  👋
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
                  Kelola pemesanan lapanganmu dengan mudah.
                  Temukan lapangan, pilih jadwal, dan bermain bersama tim.
                </p>
              </div>

              <Link
                href="/dashboard/lapangan"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#07152f] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#102242]"
              >
                <PlusIcon />
                Pesan Lapangan
              </Link>
            </section>

            {/* =================================================
                STATISTIC CARDS
            ================================================= */}

            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* TOTAL */}

              <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">

                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-50 transition group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <CalendarIcon />
                    </div>

                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                      ALL TIME
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Total Pemesanan
                  </p>

                  <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                    {totalPemesanan}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Semua pemesanan kamu
                  </p>
                </div>
              </div>

              {/* AKTIF */}

              <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">

                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-50 transition group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <CheckIcon />
                    </div>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                      AKTIF
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Booking Aktif
                  </p>

                  <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                    {bookingAktif}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Sudah dikonfirmasi admin
                  </p>
                </div>
              </div>

              {/* DURASI */}

              <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">

                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-50 transition group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                      <ClockIcon />
                    </div>

                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-600">
                      DURASI
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Durasi Pemakaian
                  </p>

                  <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                    {durasiText}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Total booking dikonfirmasi
                  </p>
                </div>
              </div>

              {/* PEMBAYARAN */}

              <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">

                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-50 transition group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <PaymentIcon />
                    </div>

                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
                      PENDING
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Menunggu Pembayaran
                  </p>

                  <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                    {menungguPembayaran}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Menunggu konfirmasi admin
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                HERO BANNER
            ================================================= */}

            <section className="relative mb-8 overflow-hidden rounded-[28px] bg-[#07152f] shadow-xl shadow-slate-900/10">

              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/lapangan.jpeg')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#07152f]/90 to-[#07152f]/50" />

              <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10 bg-white/5" />

              <div className="absolute -bottom-40 right-32 h-96 w-96 rounded-full border border-white/5 bg-white/5" />

              <div className="relative z-10 flex flex-col gap-8 p-7 md:p-10 lg:flex-row lg:items-center lg:justify-between">

                <div className="max-w-2xl">

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Booking lebih mudah
                  </span>

                  <h2 className="mt-5 text-3xl font-black tracking-tight text-white md:text-4xl">
                    Siap bermain bersama tim?
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                    Pilih lapangan favoritmu, tentukan jadwal yang tersedia,
                    dan lakukan booking dalam beberapa langkah.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">

                    <Link
                      href="/dashboard/lapangan"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#07152f] transition hover:-translate-y-0.5 hover:bg-slate-100"
                    >
                      Lihat Lapangan
                      <ArrowRightIcon />
                    </Link>

                    <Link
                      href="/dashboard/riwayat"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                    >
                      Riwayat Booking
                    </Link>

                  </div>
                </div>

                {/* MINI INFO */}

                <div className="hidden w-[270px] shrink-0 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md lg:block">

                  <p className="text-xs font-medium text-slate-400">
                    Booking kamu
                  </p>

                  <p className="mt-2 text-4xl font-black text-white">
                    {bookingAktif}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    booking aktif
                  </p>

                  <div className="my-5 h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Durasi
                    </span>

                    <span className="text-sm font-bold text-white">
                      {durasiText}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Menunggu
                    </span>

                    <span className="text-sm font-bold text-amber-300">
                      {menungguPembayaran}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                CONTENT GRID
            ================================================= */}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

              {/* =================================================
                  RIWAYAT
              ================================================= */}

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-950">
                        Riwayat Pemesanan
                      </h3>

                      {bookingTerbaru.length > 0 && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                          {bookingTerbaru.length}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Aktivitas pemesanan terbaru kamu
                    </p>
                  </div>

                  <Link
                    href="/dashboard/riwayat"
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                  >
                    Lihat semua
                    <ArrowRightIcon />
                  </Link>
                </div>

                {bookingTerbaru.length > 0 ? (
                  <div className="divide-y divide-slate-100">

                    {bookingTerbaru.map((booking) => {

                      const durasi = hitungDurasi(
                        booking.startTime,
                        booking.endTime
                      );

                      const totalHarga =
                        booking.lapangan.price *
                        durasi.totalJam;

                      return (
                        <div
                          key={booking.id}
                          className="group p-5 transition hover:bg-slate-50/70 md:p-6"
                        >

                          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                            {/* INFO */}

                            <div className="flex min-w-0 items-center gap-4">

                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">

                                {booking.lapangan.picture_url ? (
                                  <img
                                    src={
                                      booking
                                        .lapangan
                                        .picture_url
                                    }
                                    alt={
                                      booking
                                        .lapangan
                                        .name
                                    }
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-2xl">
                                    ⚽
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <h4 className="truncate font-bold text-slate-900">
                                    {booking.lapangan.name}
                                  </h4>

                                  {booking.status ===
                                    "CONFIRMED" && (
                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                                      Dikonfirmasi
                                    </span>
                                  )}

                                  {booking.status ===
                                    "PENDING" && (
                                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
                                      Menunggu
                                    </span>
                                  )}

                                  {booking.status ===
                                    "CANCELLED" && (
                                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">
                                      Dibatalkan
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1.5 text-xs font-medium text-slate-500">
                                  {formatTanggal(
                                    booking.startTime
                                  )}
                                </p>

                                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">

                                  <span className="font-medium text-slate-600">
                                    {formatJam(
                                      booking.startTime
                                    )}{" "}
                                    -{" "}
                                    {formatJam(
                                      booking.endTime
                                    )}
                                  </span>

                                  <span>•</span>

                                  <span>
                                    {durasi.text}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* PRICE */}

                            <div className="flex items-center justify-between gap-5 border-t border-slate-100 pt-4 md:border-0 md:pt-0">

                              <div className="md:text-right">

                                <p className="text-lg font-black text-slate-950">
                                  {formatRupiah(
                                    totalHarga
                                  )}
                                </p>

                                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                  #
                                  {booking.id
                                    .slice(0, 8)
                                    .toUpperCase()}
                                </p>
                              </div>

                              <Link
                                href="/dashboard/riwayat"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
                                aria-label="Lihat detail"
                              >
                                <ArrowRightIcon />
                              </Link>
                            </div>

                          </div>
                        </div>
                      );
                    })}

                  </div>
                ) : (
                  <div className="px-6 py-16 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <ClockIcon />
                    </div>

                    <h4 className="mt-5 text-sm font-bold text-slate-900">
                      Belum ada pemesanan
                    </h4>

                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                      Kamu belum memiliki riwayat pemesanan.
                      Yuk pesan lapangan pertama kamu sekarang.
                    </p>

                    <Link
                      href="/dashboard/lapangan"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#07152f] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#152849]"
                    >
                      Pesan Lapangan
                      <ArrowRightIcon />
                    </Link>
                  </div>
                )}
              </div>

              {/* =================================================
                  DURASI
              ================================================= */}

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 px-6 py-5">

                  <h3 className="text-lg font-bold text-slate-950">
                    Durasi Pemakaian
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Ringkasan penggunaan lapangan
                  </p>
                </div>

                <div className="p-6">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Total penggunaan
                      </p>

                      <p className="mt-1 text-3xl font-black text-slate-950">
                        {durasiText}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                      <ClockIcon />
                    </div>
                  </div>

                  {/* PROGRESS */}

                  <div className="mt-8">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-xs font-semibold text-slate-500">
                        Pemakaian bulan ini
                      </span>

                      <span className="text-xs font-bold text-slate-900">
                        {progressPemakaian}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-700"
                        style={{
                          width: `${progressPemakaian}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                      <span>0 jam</span>
                      <span>20 jam</span>
                    </div>
                  </div>

                  {/* INFO */}

                  <div className="mt-7 rounded-2xl bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                        <ClockIcon />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          Bulan ini
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {durasiBulanIni > 0
                            ? `${durasiBulanIni.toFixed(
                                1
                              )} jam penggunaan`
                            : "Belum ada penggunaan"}
                        </p>
                      </div>
                    </div>

                  </div>

                  <p className="mt-4 text-[10px] leading-5 text-slate-400">
                    Data dihitung berdasarkan booking yang
                    sudah dikonfirmasi admin.
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                PAYMENT SUMMARY
            ================================================= */}

            <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* PAYMENT */}

              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07152f] to-[#152849] p-6 text-white shadow-xl shadow-slate-900/10">

                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 transition duration-500 group-hover:scale-125" />

                <div className="relative">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Total Pembayaran
                      </p>

                      <p className="mt-2 text-2xl font-black md:text-3xl">
                        {formatRupiah(
                          totalPembayaran
                        )}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <PaymentIcon />
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    Total pembayaran dari booking yang
                    sudah dikonfirmasi admin.
                  </p>

                  <Link
                    href="/dashboard/riwayat"
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white transition hover:text-slate-300"
                  >
                    Lihat riwayat pembayaran
                    <ArrowRightIcon />
                  </Link>
                </div>
              </div>

              {/* PENDING */}

              <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6">

                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-100/70" />

                <div className="relative">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-semibold text-amber-700">
                        Menunggu Konfirmasi
                      </p>

                      <p className="mt-2 text-2xl font-black text-amber-800 md:text-3xl">
                        {menungguPembayaran}{" "}
                        <span className="text-base">
                          Booking
                        </span>
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
                      <ClockIcon />
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-amber-700/70">
                    Booking yang masih menunggu proses
                    konfirmasi dari admin.
                  </p>

                  <Link
                    href="/dashboard/riwayat"
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-amber-800 transition hover:text-amber-900"
                  >
                    Cek status booking
                    <ArrowRightIcon />
                  </Link>
                </div>
              </div>
            </section>

            {/* =================================================
                MOBILE NAVIGATION
            ================================================= */}

            <div className="mt-8 lg:hidden">

              <div className="grid grid-cols-4 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

                <Link
                  href="/dashboard"
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-[#07152f] px-2 py-3 text-white"
                >
                  <DashboardIcon />
                  <span className="text-[9px] font-bold">
                    Home
                  </span>
                </Link>

                <Link
                  href="/dashboard/lapangan"
                  className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-slate-400 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <FieldIcon />
                  <span className="text-[9px] font-bold">
                    Lapangan
                  </span>
                </Link>

                <Link
                  href="/dashboard/booking"
                  className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-slate-400 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <BookingIcon />
                  <span className="text-[9px] font-bold">
                    Booking
                  </span>
                </Link>

                <Link
                  href="/dashboard/riwayat"
                  className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-slate-400 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <HistoryIcon />
                  <span className="text-[9px] font-bold">
                    Riwayat
                  </span>
                </Link>
              </div>
            </div>

            {/* FOOTER */}

            <footer className="mt-8 border-t border-slate-200 py-6 text-center">
              <p className="text-[11px] text-slate-400">
                © {new Date().getFullYear()} Lapangin. Semua hak dilindungi.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}