import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNotifications from "@/components/admin/AdminNotifications";

// ============================================================
// FORMAT TANGGAL
// ============================================================

function formatTanggal(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

// ============================================================
// FORMAT JAM
// ============================================================

function formatJam(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

// ============================================================
// ICON
// ============================================================

function Icon({
  type,
}: {
  type:
    | "dashboard"
    | "field"
    | "booking"
    | "users"
    | "report"
    | "user"
    | "logout"
    | "calendar"
    | "money"
    | "clock"
    | "check"
    | "close"
    | "arrow"
    | "menu";
}) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  // Dashboard
  if (type === "dashboard") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  // Lapangan
  if (type === "field") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 12h18" />
        <path d="M12 4v16" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }

  // Booking
  if (type === "booking") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
        <path d="M8 14h3" />
        <path d="M8 17h6" />
      </svg>
    );
  }

  // Users
  if (type === "users") {
    return (
      <svg {...common}>
        <circle cx="9" cy="7" r="4" />
        <path d="M2 21c.7-4 3-6 7-6s6.3 2 7 6" />
        <path d="M16 11c3 0 5 2 6 5" />
        <path d="M16 3.5a4 4 0 0 1 0 7" />
      </svg>
    );
  }

  // Report
  if (type === "report") {
    return (
      <svg {...common}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 2 5-6" />
        <circle cx="7" cy="15" r="1" />
        <circle cx="11" cy="11" r="1" />
        <circle cx="14" cy="13" r="1" />
        <circle cx="19" cy="7" r="1" />
      </svg>
    );
  }

  // User
  if (type === "user") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21c.8-4 3-6 7-6s6.2 2 7 6" />
      </svg>
    );
  }

  // Logout
  if (type === "logout") {
    return (
      <svg {...common}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
      </svg>
    );
  }

  // Calendar
  if (type === "calendar") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  // Money
  if (type === "money") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M7 9h.01" />
        <path d="M17 15h.01" />
      </svg>
    );
  }

  // Clock
  if (type === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  // Check
  if (type === "check") {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  // Close
  if (type === "close") {
    return (
      <svg {...common}>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </svg>
    );
  }

  // Arrow
  if (type === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  // Menu
  if (type === "menu") {
    return (
      <svg {...common}>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </svg>
    );
  }

  return null;
}

// ============================================================
// STATUS BOOKING
// ============================================================

function StatusBadge({
  status,
}: {
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}) {
  if (status === "CONFIRMED") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Dikonfirmasi
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Dibatalkan
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700">
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
      Menunggu
    </span>
  );
}

// ============================================================
// PAGE
// ============================================================

export default async function AdminDashboard() {
  // ==========================================================
  // AUTH
  // ==========================================================

  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/admin/login");
  }

  // ==========================================================
  // DATA ADMIN
  // ==========================================================

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },

    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // ==========================================================
  // DATA USER
  // ==========================================================

  const totalUsers = await prisma.user.count();

  const totalCustomer = await prisma.user.count({
    where: {
      role: "USER",
    },
  });

  // ==========================================================
  // DATA LAPANGAN
  // ==========================================================

  const totalLapangan = await prisma.lapangan.count();

  const lapanganAktif = await prisma.lapangan.count({
    where: {
      isActive: true,
    },
  });

  // ==========================================================
  // DATA BOOKING
  // ==========================================================

  const totalBookings = await prisma.booking.count();

  const pendingBookings = await prisma.booking.count({
    where: {
      status: "PENDING",
    },
  });

  const confirmedBookings = await prisma.booking.count({
    where: {
      status: "CONFIRMED",
    },
  });

  const cancelledBookings = await prisma.booking.count({
    where: {
      status: "CANCELLED",
    },
  });

  // ==========================================================
  // BOOKING TERBARU
  // ==========================================================

  const recentBookings = await prisma.booking.findMany({
    take: 8,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      customer: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      },

      lapangan: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  });

  // ==========================================================
  // PENDAPATAN
  // ==========================================================

  const confirmedBookingData = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
    },

    select: {
      lapangan: {
        select: {
          price: true,
        },
      },
    },
  });

  const totalPendapatan = confirmedBookingData.reduce(
    (total, booking) => {
      return total + Number(booking.lapangan.price || 0);
    },
    0
  );

  // ==========================================================
  // BOOKING HARI INI
  // ==========================================================

  const sekarang = new Date();

  const awalHari = new Date(sekarang);
  awalHari.setHours(0, 0, 0, 0);

  const akhirHari = new Date(sekarang);
  akhirHari.setHours(23, 59, 59, 999);

  const bookingHariIni = await prisma.booking.count({
    where: {
      createdAt: {
        gte: awalHari,
        lte: akhirHari,
      },
    },
  });

  // ==========================================================
  // NAMA ADMIN
  // ==========================================================

  const namaAdmin =
    user.name?.trim() ||
    session.user.name?.trim() ||
    "Administrator";

  const emailAdmin =
    user.email ||
    session.user.email ||
    "";

  // ==========================================================
  // INITIAL ADMIN
  // ==========================================================

  const initialAdmin =
    namaAdmin
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "A";

  // ==========================================================
  // LOGOUT
  // ==========================================================

  async function keluar() {
    "use server";

    const currentHeaders = await headers();

    await auth.api.signOut({
      headers: currentHeaders,
    });

    redirect("/admin/login");
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#07152f]">

      <div className="flex min-h-screen">

        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <aside className="hidden w-[275px] shrink-0 border-r border-[#17213d] bg-[#02091f] lg:flex lg:flex-col">

          {/* LOGO */}

          <div className="flex h-[92px] items-center border-b border-white/10 px-7">

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3"
            >

              {/* LOGO ICON */}

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f0df] shadow-sm">

                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#07152f"
                  strokeWidth="1.6"
                >
                  <rect
                    x="5"
                    y="3"
                    width="14"
                    height="18"
                    rx="2"
                  />

                  <path d="M8 7h8" />
                  <path d="M8 11h8" />
                  <path d="M8 15h3" />
                  <path d="M14 15h2" />

                  <path d="M3 8h2" />
                  <path d="M19 8h2" />
                  <path d="M3 16h2" />
                  <path d="M19 16h2" />
                </svg>

              </div>

              {/* BRAND */}

              <div>

                <p className="text-[19px] font-extrabold tracking-tight text-white">
                  Lapangin
                </p>

                <p className="text-[12px] text-[#91a4c8]">
                  Booking Lapangan
                </p>

              </div>

            </Link>

          </div>

          {/* NAVIGATION */}

          <div className="flex-1 px-[14px] py-7">

            <nav className="space-y-2">

              {/* DASHBOARD */}

              <Link
                href="/admin/dashboard"
                className="flex h-[54px] items-center gap-4 rounded-[14px] bg-[#1d2b48] px-5 text-[14px] font-medium text-white"
              >

                <Icon type="dashboard" />

                <span>
                  Dashboard
                </span>

              </Link>

              {/* LAPANGAN */}

              <Link
                href="/admin/lapangan"
                className="flex h-[54px] items-center gap-4 rounded-[14px] px-5 text-[14px] font-medium text-[#b9c7df] transition hover:bg-white/5 hover:text-white"
              >

                <Icon type="field" />

                <span>
                  Lapangan
                </span>

              </Link>

              {/* RIWAYAT */}

              <Link
                href="/admin/booking"
                className="flex h-[54px] items-center gap-4 rounded-[14px] px-5 text-[14px] font-medium text-[#b9c7df] transition hover:bg-white/5 hover:text-white"
              >

                <Icon type="booking" />

                <span>
                  Riwayat Pemesanan
                </span>

              </Link>

              {/* USER */}

              <Link
                href="/admin/customer"
                className="flex h-[54px] items-center gap-4 rounded-[14px] px-5 text-[14px] font-medium text-[#b9c7df] transition hover:bg-white/5 hover:text-white"
              >

                <Icon type="users" />

                <span>
                  Manajemen User
                </span>

              </Link>

              {/* LAPORAN */}

              <Link
                href="/admin/laporan"
                className="flex h-[54px] items-center gap-4 rounded-[14px] px-5 text-[14px] font-medium text-[#b9c7df] transition hover:bg-white/5 hover:text-white"
              >

                <Icon type="report" />

                <span>
                  Laporan Pendapatan
                </span>

              </Link>

            </nav>

          </div>

          {/* BOTTOM SIDEBAR */}

          <div className="border-t border-white/10 px-[18px] py-5">

            <Link
              href="/dashboard"
              className="flex items-center gap-4 rounded-xl px-4 py-3 text-[14px] font-medium text-[#b9c7df] transition hover:bg-white/5 hover:text-white"
            >

              <Icon type="user" />

              <span>
                Dashboard User
              </span>

            </Link>

            <div className="mt-4 border-t border-white/10 pt-4">

              <p className="text-center text-[12px] leading-5 text-[#7184a8]">
                © {new Date().getFullYear()} Lapangin.
                <br />
                Semua hak dilindungi.
              </p>

            </div>

          </div>

        </aside>

        {/* ====================================================
            MAIN
        ==================================================== */}

        <main className="min-w-0 flex-1">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="sticky top-0 z-40 h-[96px] border-b border-[#e2e7ee] bg-white">

            <div className="flex h-full items-center justify-between px-5 sm:px-8 lg:px-9">

              {/* LEFT */}

              <div className="flex items-center gap-4">

                {/* MOBILE MENU */}

                <details className="relative lg:hidden">

                  <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 text-slate-600">

                    <Icon type="menu" />

                  </summary>

                  <div className="absolute left-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">

                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-3 rounded-xl bg-[#07152f] px-4 py-3 text-sm font-medium text-white"
                    >
                      <Icon type="dashboard" />
                      Dashboard
                    </Link>

                    <Link
                      href="/admin/lapangan"
                      className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Icon type="field" />
                      Lapangan
                    </Link>

                    <Link
                      href="/admin/booking"
                      className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Icon type="booking" />
                      Riwayat Pemesanan
                    </Link>

                    <Link
                      href="/admin/customer"
                      className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Icon type="users" />
                      Manajemen User
                    </Link>

                    <Link
                      href="/admin/laporan"
                      className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Icon type="report" />
                      Laporan Pendapatan
                    </Link>

                  </div>

                </details>

                <div>

                  <p className="text-[14px] font-medium text-[#8294b5]">
                    Admin Panel
                  </p>

                  <h1 className="mt-1 text-[27px] font-bold leading-none tracking-tight text-[#07152f]">
                    Dashboard
                  </h1>

                </div>

              </div>

              {/* RIGHT */}

              <div className="flex items-center gap-4">

                {/* NOTIFICATION */}

                <AdminNotifications />

                <div className="hidden h-10 w-px bg-[#e3e7ed] sm:block" />

                {/* PROFILE */}

                <details className="relative">

                  <summary className="flex cursor-pointer list-none items-center gap-3">

                    {user.image ? (
                      <img
                        src={user.image}
                        alt={namaAdmin}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#07152f] text-xs font-bold text-white">
                        {initialAdmin}
                      </div>
                    )}

                    <div className="hidden min-w-0 md:block">

                      <p className="max-w-[210px] truncate text-[14px] font-bold text-[#07152f]">
                        {namaAdmin}
                      </p>

                      <p className="mt-1 text-[12px] text-[#91a0b8]">
                        Administrator
                      </p>

                    </div>

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="hidden text-slate-400 md:block"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>

                  </summary>

                  <div className="absolute right-0 top-14 z-50 w-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                    <div className="border-b border-slate-100 p-5">

                      <div className="flex items-center gap-3">

                        {user.image ? (
                          <img
                            src={user.image}
                            alt={namaAdmin}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#07152f] text-xs font-bold text-white">
                            {initialAdmin}
                          </div>
                        )}

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-slate-800">
                            {namaAdmin}
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {emailAdmin}
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="p-2">

                      <Link
                        href="/admin/customer"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
                      >
                        <Icon type="user" />
                        Profil Admin
                      </Link>

                      <form action={keluar}>

                        <button
                          type="submit"
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 transition hover:bg-red-50"
                        >
                          <Icon type="logout" />
                          Keluar
                        </button>

                      </form>

                    </div>

                  </div>

                </details>

              </div>

            </div>

          </header>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <div className="px-5 py-8 sm:px-8 lg:px-[34px]">

            {/* =================================================
                WELCOME
            ================================================= */}

            <section className="mb-8">

              <p className="text-[14px] font-medium text-[#8294b5]">
                Ringkasan
              </p>

              <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#07152f]">
                Selamat Datang, {namaAdmin}
              </h2>

              <p className="mt-2 text-[15px] text-[#8294b5]">
                Pantau aktivitas pemesanan dan operasional
                Lapangin dari halaman dashboard.
              </p>

            </section>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="mb-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              {/* TOTAL USER */}

              <div className="rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[14px] text-[#8294b5]">
                      Total User
                    </p>

                    <p className="mt-3 text-[32px] font-bold leading-none text-[#07152f]">
                      {totalUsers}
                    </p>

                    <p className="mt-3 text-[12px] text-[#94a3b8]">
                      {totalCustomer} customer terdaftar
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3ff] text-[#3568b8]">
                    <Icon type="users" />
                  </div>

                </div>

              </div>

              {/* LAPANGAN */}

              <div className="rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[14px] text-[#8294b5]">
                      Total Lapangan
                    </p>

                    <p className="mt-3 text-[32px] font-bold leading-none text-[#07152f]">
                      {totalLapangan}
                    </p>

                    <p className="mt-3 text-[12px] text-[#94a3b8]">
                      {lapanganAktif} lapangan aktif
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf9f2] text-[#24915a]">
                    <Icon type="field" />
                  </div>

                </div>

              </div>

              {/* BOOKING */}

              <div className="rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[14px] text-[#8294b5]">
                      Total Pemesanan
                    </p>

                    <p className="mt-3 text-[32px] font-bold leading-none text-[#07152f]">
                      {totalBookings}
                    </p>

                    <p className="mt-3 text-[12px] text-[#94a3b8]">
                      {bookingHariIni} booking hari ini
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2edff] text-[#7451b8]">
                    <Icon type="booking" />
                  </div>

                </div>

              </div>

              {/* PENDAPATAN */}

              <div className="rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

                <div className="flex items-start justify-between">

                  <div className="min-w-0">

                    <p className="text-[14px] text-[#8294b5]">
                      Pendapatan
                    </p>

                    <p className="mt-3 truncate text-[24px] font-bold leading-none text-[#07152f]">
                      Rp{" "}
                      {totalPendapatan.toLocaleString(
                        "id-ID"
                      )}
                    </p>

                    <p className="mt-3 text-[12px] text-[#94a3b8]">
                      Booking dikonfirmasi
                    </p>

                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff5e8] text-[#c47a19]">
                    <Icon type="money" />
                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                STATUS BOOKING
            ================================================= */}

            <section className="mb-7 rounded-[18px] border border-[#dfe5ed] bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

              <div className="mb-6">

                <h2 className="text-[20px] font-bold text-[#07152f]">
                  Status Pemesanan
                </h2>

                <p className="mt-1 text-[13px] text-[#8294b5]">
                  Ringkasan status pemesanan lapangan.
                </p>

              </div>

              <div className="grid gap-4 md:grid-cols-3">

                {/* PENDING */}

                <Link
                  href="/admin/booking?status=PENDING"
                  className="flex items-center justify-between rounded-2xl border border-[#f1dfad] bg-[#fffaf0] p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                >

                  <div>

                    <p className="text-[13px] font-semibold text-[#9c761d]">
                      Menunggu
                    </p>

                    <p className="mt-2 text-[28px] font-bold text-[#6f5517]">
                      {pendingBookings}
                    </p>

                    <p className="mt-1 text-[11px] text-[#b39858]">
                      Perlu diproses
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0c9] text-[#a47a16]">
                    <Icon type="clock" />
                  </div>

                </Link>

                {/* CONFIRMED */}

                <Link
                  href="/admin/booking?status=CONFIRMED"
                  className="flex items-center justify-between rounded-2xl border border-[#cdebd8] bg-[#f4fcf7] p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                >

                  <div>

                    <p className="text-[13px] font-semibold text-[#288051]">
                      Dikonfirmasi
                    </p>

                    <p className="mt-2 text-[28px] font-bold text-[#1e6641]">
                      {confirmedBookings}
                    </p>

                    <p className="mt-1 text-[11px] text-[#70a58a]">
                      Booking aktif
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dcf6e6] text-[#27905a]">
                    <Icon type="check" />
                  </div>

                </Link>

                {/* CANCELLED */}

                <Link
                  href="/admin/booking?status=CANCELLED"
                  className="flex items-center justify-between rounded-2xl border border-[#f0d1d1] bg-[#fff7f7] p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                >

                  <div>

                    <p className="text-[13px] font-semibold text-[#b34848]">
                      Dibatalkan
                    </p>

                    <p className="mt-2 text-[28px] font-bold text-[#823434]">
                      {cancelledBookings}
                    </p>

                    <p className="mt-1 text-[11px] text-[#bd7b7b]">
                      Booking dibatalkan
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffe5e5] text-[#bd4848]">
                    <Icon type="close" />
                  </div>

                </Link>

              </div>

            </section>

            {/* =================================================
                BOOKING TERBARU
            ================================================= */}

            <section className="rounded-[18px] border border-[#dfe5ed] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

              {/* HEADER */}

              <div className="flex flex-col justify-between gap-4 border-b border-[#e9edf2] px-6 py-6 sm:flex-row sm:items-center">

                <div>

                  <h2 className="text-[20px] font-bold text-[#07152f]">
                    Pemesanan Terbaru
                  </h2>

                  <p className="mt-1 text-[13px] text-[#8294b5]">
                    Daftar pemesanan terbaru dari customer.
                  </p>

                </div>

                <Link
                  href="/admin/booking"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07152f] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#142342]"
                >
                  Lihat Semua
                  <Icon type="arrow" />
                </Link>

              </div>

              {/* TABLE */}

              <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  <thead>

                    <tr className="border-b border-[#edf0f4]">

                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                        Lapangan
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                        Tanggal
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                        Jam
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                        Harga
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-[#edf0f4]">

                    {recentBookings.length === 0 ? (
                      <tr>

                        <td
                          colSpan={6}
                          className="px-6 py-16 text-center"
                        >

                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f5f8] text-[#9aa8bb]">
                            <Icon type="booking" />
                          </div>

                          <p className="mt-4 text-[14px] font-semibold text-[#52627a]">
                            Belum ada pemesanan
                          </p>

                          <p className="mt-1 text-[12px] text-[#9aa6b7]">
                            Data pemesanan akan tampil di
                            sini.
                          </p>

                        </td>

                      </tr>
                    ) : (
                      recentBookings.map((booking) => {

                        const namaCustomer =
                          booking.customer.name ||
                          booking.customer.username ||
                          booking.customer.email ||
                          "Customer";

                        return (
                          <tr
                            key={booking.id}
                            className="transition hover:bg-[#fafbfd]"
                          >

                            {/* CUSTOMER */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2f8] text-[13px] font-bold text-[#07152f]">

                                  {namaCustomer
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div className="min-w-0">

                                  <p className="max-w-[190px] truncate text-[13px] font-semibold text-[#25334c]">
                                    {namaCustomer}
                                  </p>

                                  <p className="mt-1 max-w-[190px] truncate text-[11px] text-[#94a3b8]">
                                    {booking.customer.email}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* LAPANGAN */}

                            <td className="px-6 py-5">

                              <p className="text-[13px] font-semibold text-[#25334c]">
                                {booking.lapangan.name}
                              </p>

                            </td>

                            {/* TANGGAL */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-2 text-[#52627a]">

                                <Icon type="calendar" />

                                <span className="text-[12px]">
                                  {formatTanggal(
                                    booking.startTime
                                  )}
                                </span>

                              </div>

                            </td>

                            {/* JAM */}

                            <td className="px-6 py-5">

                              <p className="text-[12px] font-semibold text-[#52627a]">

                                {formatJam(
                                  booking.startTime
                                )}

                                {" - "}

                                {formatJam(
                                  booking.endTime
                                )}

                              </p>

                            </td>

                            {/* HARGA */}

                            <td className="px-6 py-5">

                              <p className="text-[13px] font-bold text-[#25334c]">

                                Rp{" "}
                                {Number(
                                  booking.lapangan.price
                                ).toLocaleString(
                                  "id-ID"
                                )}

                              </p>

                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-5">

                              <StatusBadge
                                status={booking.status}
                              />

                            </td>

                          </tr>
                        );
                      })
                    )}

                  </tbody>

                </table>

              </div>

            </section>

            {/* =================================================
                QUICK ACCESS
            ================================================= */}

            <section className="mt-8">

              <div className="mb-5">

                <h2 className="text-[20px] font-bold text-[#07152f]">
                  Akses Cepat
                </h2>

                <p className="mt-1 text-[13px] text-[#8294b5]">
                  Kelola sistem Lapangin dengan cepat.
                </p>

              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {/* LAPANGAN */}

                <Link
                  href="/admin/lapangan"
                  className="rounded-[18px] border border-[#dfe5ed] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3ff] text-[#3568b8]">
                    <Icon type="field" />
                  </div>

                  <h3 className="mt-4 text-[14px] font-bold text-[#25334c]">
                    Kelola Lapangan
                  </h3>

                  <p className="mt-2 text-[12px] leading-5 text-[#94a3b8]">
                    Tambah dan kelola lapangan
                    futsal.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-[#3568b8]">
                    Kelola
                    <Icon type="arrow" />
                  </div>

                </Link>

                {/* BOOKING */}

                <Link
                  href="/admin/booking"
                  className="rounded-[18px] border border-[#dfe5ed] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2edff] text-[#7451b8]">
                    <Icon type="booking" />
                  </div>

                  <h3 className="mt-4 text-[14px] font-bold text-[#25334c]">
                    Riwayat Pemesanan
                  </h3>

                  <p className="mt-2 text-[12px] leading-5 text-[#94a3b8]">
                    Lihat seluruh transaksi
                    pemesanan.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-[#7451b8]">
                    Lihat
                    <Icon type="arrow" />
                  </div>

                </Link>

                {/* USER */}

                <Link
                  href="/admin/customer"
                  className="rounded-[18px] border border-[#dfe5ed] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf9f2] text-[#24915a]">
                    <Icon type="users" />
                  </div>

                  <h3 className="mt-4 text-[14px] font-bold text-[#25334c]">
                    Manajemen User
                  </h3>

                  <p className="mt-2 text-[12px] leading-5 text-[#94a3b8]">
                    Kelola data customer dan
                    admin.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-[#24915a]">
                    Kelola
                    <Icon type="arrow" />
                  </div>

                </Link>

                {/* LAPORAN */}

                <Link
                  href="/admin/laporan"
                  className="rounded-[18px] border border-[#dfe5ed] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff5e8] text-[#c47a19]">
                    <Icon type="report" />
                  </div>

                  <h3 className="mt-4 text-[14px] font-bold text-[#25334c]">
                    Laporan Pendapatan
                  </h3>

                  <p className="mt-2 text-[12px] leading-5 text-[#94a3b8]">
                    Lihat laporan dan pendapatan
                    sistem.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-[#c47a19]">
                    Lihat
                    <Icon type="arrow" />
                  </div>

                </Link>

              </div>

            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="mt-10 border-t border-[#e1e6ed] py-6">

              <div className="flex flex-col justify-between gap-2 text-[12px] text-[#94a3b8] sm:flex-row">

                <p>
                  © {new Date().getFullYear()} Lapangin.
                  Semua hak dilindungi.
                </p>

                <p>
                  Admin Panel
                </p>

              </div>

            </footer>

          </div>

        </main>

      </div>

    </div>
  );
}