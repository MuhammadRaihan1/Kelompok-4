import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import PrintButton from "./PrintButton";


// ============================================================
// FORMAT RUPIAH
// ============================================================

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}


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
// FORMAT TANGGAL PANJANG
// ============================================================

function formatTanggalLengkap(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
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
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);
}


// ============================================================
// HITUNG DURASI
// ============================================================

function hitungDurasi(
  start: Date,
  end: Date
) {
  return (
    (end.getTime() - start.getTime()) /
    (1000 * 60 * 60)
  );
}


// ============================================================
// FORMAT DURASI
// ============================================================

function formatDurasi(
  start: Date,
  end: Date
) {
  const durasi = hitungDurasi(
    start,
    end
  );

  if (Number.isInteger(durasi)) {
    return `${durasi} jam`;
  }

  return `${durasi.toFixed(1)} jam`;
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
    | "history"
    | "logout"
    | "calendar"
    | "money"
    | "check"
    | "clock"
    | "cancel"
    | "chart";
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

  if (type === "dashboard") {
    return (
      <svg {...common}>
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
    );
  }


  if (type === "field") {
    return (
      <svg {...common}>
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
    );
  }


  if (type === "booking") {
    return (
      <svg {...common}>
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
    );
  }


  if (type === "users") {
    return (
      <svg {...common}>
        <circle
          cx="9"
          cy="7"
          r="4"
        />

        <path d="M2 21c.7-4 3-6 7-6s6.3 2 7 6" />

        <path d="M16 3.2a4 4 0 0 1 0 7.6" />

        <path d="M17 15c2.8.5 4.4 2.4 5 6" />
      </svg>
    );
  }


  if (type === "report") {
    return (
      <svg {...common}>
        <path d="M4 19V5" />

        <path d="M4 19h16" />

        <rect
          x="7"
          y="12"
          width="3"
          height="5"
        />

        <rect
          x="12"
          y="9"
          width="3"
          height="8"
        />

        <rect
          x="17"
          y="6"
          width="3"
          height="11"
        />
      </svg>
    );
  }


  if (type === "history") {
    return (
      <svg {...common}>
        <circle
          cx="12"
          cy="12"
          r="9"
        />

        <path d="M12 7v5l3 2" />
      </svg>
    );
  }


  if (type === "logout") {
    return (
      <svg {...common}>
        <path d="M10 17l5-5-5-5" />

        <path d="M15 12H3" />

        <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
      </svg>
    );
  }


  if (type === "calendar") {
    return (
      <svg {...common}>
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


  if (type === "money") {
    return (
      <svg {...common}>
        <circle
          cx="12"
          cy="12"
          r="9"
        />

        <path d="M12 7v10" />

        <path d="M15 9.5c-.5-1-1.5-1.5-3-1.5-1.7 0-3 .8-3 2s1.2 1.8 3 2c1.8.2 3 .8 3 2s-1.3 2-3 2c-1.5 0-2.5-.5-3-1.5" />
      </svg>
    );
  }


  if (type === "check") {
    return (
      <svg {...common}>
        <path d="M5 12l4 4L19 6" />
      </svg>
    );
  }


  if (type === "clock") {
    return (
      <svg {...common}>
        <circle
          cx="12"
          cy="12"
          r="9"
        />

        <path d="M12 7v5l3 2" />
      </svg>
    );
  }


  if (type === "cancel") {
    return (
      <svg {...common}>
        <circle
          cx="12"
          cy="12"
          r="9"
        />

        <path d="m9 9 6 6" />

        <path d="m15 9-6 6" />
      </svg>
    );
  }


  return (
    <svg {...common}>
      <path d="M4 19V5" />

      <path d="M4 19h16" />

      <path d="m7 15 4-4 3 2 5-7" />
    </svg>
  );
}

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
        <rect x="3" y="4" width="18" height="16" rx="1" />
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
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
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



// ============================================================
// PAGE
// ============================================================

export default async function AdminLaporanPage({
  searchParams,
}: {
  searchParams: Promise<{
    dari?: string;
    sampai?: string;
  }>;
}) {

  // ==========================================================
  // PARAMETER
  // ==========================================================

  const params =
    await searchParams;


  // ==========================================================
  // TANGGAL HARI INI WIB
  // ==========================================================

  const today =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Jakarta",
      }
    ).format(new Date());


  // ==========================================================
  // AWAL BULAN
  // ==========================================================

  const todayObject =
    new Date(
      `${today}T00:00:00+07:00`
    );

  const firstDay =
    new Date(todayObject);

  firstDay.setDate(1);


  const defaultFrom =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Jakarta",
      }
    ).format(firstDay);


  const dari =
    params.dari ||
    defaultFrom;


  const sampai =
    params.sampai ||
    today;


  // ==========================================================
  // TANGGAL QUERY
  // ==========================================================

  const fromDate =
    new Date(
      `${dari}T00:00:00+07:00`
    );


  const toDate =
    new Date(
      `${sampai}T23:59:59+07:00`
    );


  // ==========================================================
  // AUTH
  // ==========================================================

  const requestHeaders =
    await headers();


  const session =
    await auth.api.getSession({
      headers: requestHeaders,
    });


  if (!session) {
    redirect("/admin/login");
  }


  // ==========================================================
  // CEK ADMIN
  // ==========================================================

  const adminUser =
    await prisma.user.findUnique({
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


  if (
    !adminUser ||
    adminUser.role !== "ADMIN"
  ) {
    redirect("/dashboard");
  }


  // ==========================================================
  // DATA BOOKING
  // ==========================================================

  const bookings =
    await prisma.booking.findMany({

      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {

        customer: true,

        lapangan: true,

        payments: {
          orderBy: {
            createdAt: "desc",
          },

          take: 1,
        },

      },

    });


  // ==========================================================
  // TOTAL BOOKING
  // ==========================================================

  const totalBooking =
    bookings.length;


  // ==========================================================
  // PENDING
  // ==========================================================

  const pendingBooking =
    bookings.filter(
      (booking) =>
        booking.status === "PENDING"
    ).length;


  // ==========================================================
  // CONFIRMED
  // ==========================================================

  const confirmedBooking =
    bookings.filter(
      (booking) =>
        booking.status === "CONFIRMED"
    ).length;


  // ==========================================================
  // CANCELLED
  // ==========================================================

  const cancelledBooking =
    bookings.filter(
      (booking) =>
        booking.status === "CANCELLED"
    ).length;


  // ==========================================================
  // TOTAL PENDAPATAN
  // ==========================================================

  const totalPendapatan =
    bookings
      .filter(
        (booking) =>
          booking.status === "CONFIRMED"
      )
      .reduce(
        (total, booking) => {

          const durasi =
            hitungDurasi(
              booking.startTime,
              booking.endTime
            );


          const harga =
            durasi *
            booking.lapangan.price;


          return (
            total +
            harga
          );
        },
        0
      );


  // ==========================================================
  // TOTAL DURASI
  // ==========================================================

  const totalDurasi =
    bookings.reduce(
      (total, booking) => {

        if (
          booking.status ===
          "CANCELLED"
        ) {
          return total;
        }

        return (
          total +
          hitungDurasi(
            booking.startTime,
            booking.endTime
          )
        );
      },
      0
    );


  // ==========================================================
  // TOTAL USER
  // ==========================================================

  const totalCustomer =
    await prisma.user.count({
      where: {
        role: "USER",
      },
    });


  // ==========================================================
  // TOTAL ADMIN
  // ==========================================================

  const totalAdmin =
    await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });


  // ==========================================================
  // STATISTIK LAPANGAN
  // ==========================================================

  const lapanganStats =
    new Map<
      string,
      {
        id: string;
        name: string;
        booking: number;
        confirmed: number;
        pending: number;
        cancelled: number;
        pendapatan: number;
      }
    >();


  for (
    const booking of bookings
  ) {

    const existing =
      lapanganStats.get(
        booking.lapanganId
      );


    const pendapatan =
      booking.status ===
      "CONFIRMED"
        ? hitungDurasi(
            booking.startTime,
            booking.endTime
          ) *
          booking.lapangan.price
        : 0;


    if (existing) {

      existing.booking += 1;


      if (
        booking.status ===
        "CONFIRMED"
      ) {
        existing.confirmed += 1;
      }


      if (
        booking.status ===
        "PENDING"
      ) {
        existing.pending += 1;
      }


      if (
        booking.status ===
        "CANCELLED"
      ) {
        existing.cancelled += 1;
      }


      existing.pendapatan +=
        pendapatan;

    } else {

      lapanganStats.set(
        booking.lapanganId,
        {
          id:
            booking.lapanganId,

          name:
            booking.lapangan.name,

          booking: 1,

          confirmed:
            booking.status ===
            "CONFIRMED"
              ? 1
              : 0,

          pending:
            booking.status ===
            "PENDING"
              ? 1
              : 0,

          cancelled:
            booking.status ===
            "CANCELLED"
              ? 1
              : 0,

          pendapatan,
        }
      );

    }

  }


  // ==========================================================
  // SORT LAPANGAN
  // ==========================================================

  const lapanganList =
    Array.from(
      lapanganStats.values()
    ).sort(
      (a, b) =>
        b.booking -
        a.booking
    );


  // ==========================================================
  // LOGOUT
  // ==========================================================

  async function logout() {
    "use server";

    const currentHeaders =
      await headers();


    const currentSession =
      await auth.api.getSession({
        headers:
          currentHeaders,
      });


    if (currentSession) {

      await auth.api.signOut({
        headers:
          currentHeaders,
      });

    }


    redirect("/admin/login");
  }


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <main className="min-h-screen bg-[#f5f7fa] text-[#0d1b35]">

      <div className="flex min-h-screen">


        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="hidden w-64 flex-col bg-slate-950 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:h-screen">

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
               <Link
            href="/admin/dashboard"
            className="mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 text-[13px] font-medium text-[#a6b5cf] transition hover:bg-[#111d31] hover:text-white"
          >
            <MenuIcon type="dashboard" />
            <span>
              Dashboard
            </span>
          </Link>


          {/* LAPANGAN */}

          <Link
            href="/admin/lapangan"
            className="mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 text-[13px] font-medium text-[#a6b5cf] transition hover:bg-[#111d31] hover:text-white"
          >

            <MenuIcon type="field" />

            <span>
              Lapangan
            </span>

          </Link>


          {/* RIWAYAT */}

          <Link
            href="/admin/booking"
            className="mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 text-[13px] font-medium text-[#a6b5cf] transition hover:bg-[#111d31] hover:text-white"
          >

            <MenuIcon type="booking" />

            <span>
              Riwayat Pemesanan
            </span>

          </Link>


          {/* USER */}

          <Link
            href="/admin/customer"
            className="mb-2 flex items-center gap-4 rounded-xl px-4 py-3.5 text-[13px] font-medium text-[#a6b5cf] transition hover:bg-[#111d31] hover:text-white"
          >

            <MenuIcon type="user" />

            <span>
              Manajemen User
            </span>

          </Link>


          {/* LAPORAN */}

          <Link
            href="/admin/laporan"
            className="mb-2 flex items-center gap-4 rounded-xl bg-[#1d2a42] px-4 py-3.5 text-[13px] font-medium text-white transition"
          >

            <MenuIcon type="report" />

            <span>
              Laporan Pendapatan
            </span>

          </Link>
        </div>


        {/* BACK USER */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-5">

          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#91a2bf] transition hover:bg-[#111d31] hover:text-white"
          >

            <span className="text-lg">
              👤
            </span>
            Dashboard User

          </Link>
        

          {/* USER SIDEBAR */}

          <div className="p-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Lapangin. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </nav>
      </aside>


        {/* ==================================================
            MAIN
        ================================================== */}

        <div className="min-w-0 lg:ml-64">


          {/* TOPBAR */}

          <header className="min-h-[6.5625rem] border-b border-[#e4e8ef] bg-white">
          <div className="flex min-h-[6.5625rem] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-9">

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Admin Panel
                </p>

                <h2 className="text-xl font-bold">
                  Laporan
                </h2>

              </div>


              <PrintButton />

            </div>

          </header>


          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="p-5 md:p-8">

            {/* =================================================
                PRINT AREA
            ================================================= */}

            <div id="print-area">


              {/* =================================================
                  HEADER KHUSUS PRINT
              ================================================= */}

              <div className="print-header mb-7 hidden border-b-2 border-slate-900 pb-5">

                <div className="flex items-center justify-between">

                  {/* LOGO */}

                  <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200">

                      <img
                        src="/logo2.jpg"
                        alt="Lapangin"
                        className="h-full w-full object-cover"
                      />

                    </div>


                    <div>

                      <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        LAPANGIN
                      </h1>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Sistem Informasi Pemesanan
                        Lapangan Futsal
                      </p>

                    </div>

                  </div>


                  {/* JUDUL */}

                  <div className="text-right">

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                      Laporan Sistem
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                      LAPORAN BOOKING
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-500">

                      Periode{" "}

                      {formatTanggal(
                        fromDate
                      )}

                      {" - "}

                      {formatTanggal(
                        toDate
                      )}

                    </p>

                  </div>

                </div>


                {/* INFO */}

                <div className="mt-5 grid grid-cols-3 gap-4">

                  <div className="rounded-xl bg-slate-50 px-4 py-3">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Dicetak Oleh
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {adminUser.name ||
                        "Administrator"}
                    </p>

                  </div>


                  <div className="rounded-xl bg-slate-50 px-4 py-3">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Total Booking
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {totalBooking} Booking
                    </p>

                  </div>


                  <div className="rounded-xl bg-slate-50 px-4 py-3">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status Laporan
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      Laporan Sistem
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  HEADER SCREEN
              ================================================= */}

              <div className="print:hidden mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                <div>

                  <p className="mb-2 text-sm font-semibold text-[#8da0bd]">
                    Analisis Sistem
                  </p>

                  <h1 className="text-3xl font-bold text-slate-900">
                    Laporan Booking
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Ringkasan aktivitas pemesanan
                    lapangan berdasarkan periode.
                  </p>

                </div>

              </div>


              {/* =================================================
                  FILTER
              ================================================= */}

              <div className="print:hidden mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <form
                  method="GET"
                  className="grid gap-4 md:grid-cols-3"
                >

                  <div>

                    <label
                      htmlFor="dari"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Dari Tanggal
                    </label>

                    <input
                      id="dari"
                      name="dari"
                      type="date"
                      defaultValue={dari}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                  </div>


                  <div>

                    <label
                      htmlFor="sampai"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Sampai Tanggal
                    </label>

                    <input
                      id="sampai"
                      name="sampai"
                      type="date"
                      defaultValue={sampai}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                  </div>


                  <div className="flex items-end gap-3">

                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-[#020817] px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      Terapkan
                    </button>


                    <Link
                      href="/admin/laporan"
                      className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      Reset
                    </Link>

                  </div>

                </form>

              </div>


              {/* =================================================
                  PERIODE
              ================================================= */}

              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 print-section">

                <div className="text-blue-600">

                  <Icon type="calendar" />

                </div>


                <div>

                  <p className="text-xs font-medium text-blue-500">
                    Periode Laporan
                  </p>

                  <p className="font-bold text-blue-900">

                    {formatTanggal(
                      fromDate
                    )}

                    {" - "}

                    {formatTanggal(
                      toDate
                    )}

                  </p>

                </div>

              </div>


              {/* =================================================
                  STATISTIK BOOKING
              ================================================= */}

              <div className="print-section mb-7 grid grid-cols-2 gap-4 md:grid-cols-4">


                {/* TOTAL */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Total Booking
                      </p>

                      <p className="mt-2 text-3xl font-black text-slate-900">
                        {totalBooking}
                      </p>

                    </div>


                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                      <Icon type="booking" />

                    </div>

                  </div>

                </div>


                {/* CONFIRMED */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Dikonfirmasi
                      </p>

                      <p className="mt-2 text-3xl font-black text-green-600">
                        {confirmedBooking}
                      </p>

                    </div>


                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">

                      <Icon type="check" />

                    </div>

                  </div>

                </div>


                {/* PENDING */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Menunggu
                      </p>

                      <p className="mt-2 text-3xl font-black text-yellow-600">
                        {pendingBooking}
                      </p>

                    </div>


                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">

                      <Icon type="clock" />

                    </div>

                  </div>

                </div>


                {/* CANCELLED */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Dibatalkan
                      </p>

                      <p className="mt-2 text-3xl font-black text-red-600">
                        {cancelledBooking}
                      </p>

                    </div>


                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">

                      <Icon type="cancel" />

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  RINGKASAN PENDAPATAN
              ================================================= */}

              <div className="print-section mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">


                {/* PENDAPATAN */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">

                      <Icon type="money" />

                    </div>


                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Total Pendapatan
                      </p>

                      <p className="mt-1 text-xl font-black text-slate-900">

                        {formatRupiah(
                          totalPendapatan
                        )}

                      </p>

                    </div>

                  </div>


                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    Berdasarkan booking yang
                    telah dikonfirmasi.
                  </p>

                </div>


                {/* DURASI */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                      <Icon type="clock" />

                    </div>


                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Total Durasi
                      </p>

                      <p className="mt-1 text-xl font-black text-slate-900">

                        {Number.isInteger(
                          totalDurasi
                        )
                          ? totalDurasi
                          : totalDurasi.toFixed(
                              1
                            )}

                        {" "}

                        <span className="text-sm font-semibold text-slate-400">
                          jam
                        </span>

                      </p>

                    </div>

                  </div>


                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    Total durasi booking aktif
                    pada periode.
                  </p>

                </div>


                {/* CUSTOMER */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                      <Icon type="users" />

                    </div>


                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Total Customer
                      </p>

                      <p className="mt-1 text-xl font-black text-slate-900">
                        {totalCustomer}
                      </p>

                    </div>

                  </div>


                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    Jumlah user dengan role
                    USER dalam sistem.
                  </p>

                </div>

              </div>


              {/* =================================================
                  STATISTIK LAPANGAN
              ================================================= */}

              <div className="print-section mb-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                      <Icon type="chart" />

                    </div>


                    <div>

                      <h2 className="text-lg font-black text-slate-900">
                        Statistik Lapangan
                      </h2>

                      <p className="text-sm text-slate-400">
                        Ringkasan aktivitas setiap
                        lapangan.
                      </p>

                    </div>

                  </div>

                </div>


                {lapanganList.length ===
                0 ? (

                  <div className="px-6 py-12 text-center text-sm text-slate-400">
                    Belum ada data lapangan
                    pada periode ini.
                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[800px] border-collapse">

                      <thead>

                        <tr className="bg-slate-900">

                          <th className="border border-slate-700 px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                            No
                          </th>

                          <th className="border border-slate-700 px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                            Lapangan
                          </th>

                          <th className="border border-slate-700 px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white">
                            Booking
                          </th>

                          <th className="border border-slate-700 px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white">
                            Dikonfirmasi
                          </th>

                          <th className="border border-slate-700 px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white">
                            Menunggu
                          </th>

                          <th className="border border-slate-700 px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white">
                            Dibatalkan
                          </th>

                          <th className="border border-slate-700 px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-white">
                            Pendapatan
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {lapanganList.map(
                          (
                            lapangan,
                            index
                          ) => (

                            <tr
                              key={
                                lapangan.id
                              }
                              className={
                                index %
                                  2 ===
                                0
                                  ? "bg-white"
                                  : "bg-slate-50"
                              }
                            >

                              <td className="border border-slate-200 px-5 py-4 text-sm font-bold text-slate-500">
                                {index + 1}
                              </td>


                              <td className="border border-slate-200 px-5 py-4">

                                <p className="text-sm font-bold text-slate-800">
                                  {
                                    lapangan.name
                                  }
                                </p>

                              </td>


                              <td className="border border-slate-200 px-5 py-4 text-center">

                                <span className="font-bold text-blue-600">
                                  {
                                    lapangan.booking
                                  }
                                </span>

                              </td>


                              <td className="border border-slate-200 px-5 py-4 text-center">

                                <span className="font-bold text-green-600">
                                  {
                                    lapangan.confirmed
                                  }
                                </span>

                              </td>


                              <td className="border border-slate-200 px-5 py-4 text-center">

                                <span className="font-bold text-yellow-600">
                                  {
                                    lapangan.pending
                                  }
                                </span>

                              </td>


                              <td className="border border-slate-200 px-5 py-4 text-center">

                                <span className="font-bold text-red-600">
                                  {
                                    lapangan.cancelled
                                  }
                                </span>

                              </td>


                              <td className="border border-slate-200 px-5 py-4 text-right">

                                <span className="font-bold text-slate-800">
                                  {formatRupiah(
                                    lapangan.pendapatan
                                  )}
                                </span>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>


              {/* =================================================
                  DETAIL BOOKING
              ================================================= */}

              <div className="print-section overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                  <h2 className="text-lg font-black text-slate-900">
                    Detail Booking
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Seluruh data booking pada
                    periode laporan.
                  </p>

                </div>


                {bookings.length ===
                0 ? (

                  <div className="px-6 py-14 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                      <Icon type="booking" />

                    </div>


                    <p className="mt-4 font-semibold text-slate-600">
                      Belum ada booking
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Tidak ada data pada
                      periode yang dipilih.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[1100px] border-collapse">

                      <thead>

                        <tr className="bg-slate-900">

                          <th className="border border-slate-700 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white">
                            No
                          </th>

                          <th className="border border-slate-700 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white">
                            Pemesan
                          </th>

                          <th className="border border-slate-700 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white">
                            Lapangan
                          </th>

                          <th className="border border-slate-700 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white">
                            Tanggal
                          </th>

                          <th className="border border-slate-700 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white">
                            Waktu
                          </th>

                          <th className="border border-slate-700 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white">
                            Durasi
                          </th>

                          <th className="border border-slate-700 px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white">
                            Harga
                          </th>

                          <th className="border border-slate-700 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white">
                            Status
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {bookings.map(
                          (
                            booking,
                            index
                          ) => {

                            const durasi =
                              hitungDurasi(
                                booking.startTime,
                                booking.endTime
                              );


                            const harga =
                              durasi *
                              booking
                                .lapangan
                                .price;


                            return (

                              <tr
                                key={
                                  booking.id
                                }
                                className={
                                  index %
                                    2 ===
                                  0
                                    ? "bg-white"
                                    : "bg-slate-50"
                                }
                              >

                                {/* NO */}

                                <td className="border border-slate-200 px-4 py-3 text-sm font-bold text-slate-500">
                                  {index + 1}
                                </td>


                                {/* PEMESAN */}

                                <td className="border border-slate-200 px-4 py-3">

                                  <p className="text-sm font-bold text-slate-800">

                                    {booking
                                      .customer
                                      .name ||
                                      booking
                                        .customer
                                        .username ||
                                      "Pelanggan"}

                                  </p>

                                  <p className="mt-0.5 text-[10px] text-slate-500">
                                    {
                                      booking
                                        .customer
                                        .email
                                    }
                                  </p>

                                </td>


                                {/* LAPANGAN */}

                                <td className="border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">

                                  {
                                    booking
                                      .lapangan
                                      .name
                                  }

                                </td>


                                {/* TANGGAL */}

                                <td className="border border-slate-200 px-4 py-3 text-sm text-slate-600">

                                  {formatTanggal(
                                    booking.startTime
                                  )}

                                </td>


                                {/* WAKTU */}

                                <td className="border border-slate-200 px-4 py-3">

                                  <span className="text-sm font-bold text-slate-700">

                                    {formatJam(
                                      booking.startTime
                                    )}

                                    {" - "}

                                    {formatJam(
                                      booking.endTime
                                    )}

                                  </span>

                                </td>


                                {/* DURASI */}

                                <td className="border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600">

                                  {formatDurasi(
                                    booking.startTime,
                                    booking.endTime
                                  )}

                                </td>


                                {/* HARGA */}

                                <td className="border border-slate-200 px-4 py-3 text-right">

                                  <span className="text-sm font-bold text-slate-800">

                                    {formatRupiah(
                                      harga
                                    )}

                                  </span>

                                </td>


                                {/* STATUS */}

                                <td className="border border-slate-200 px-4 py-3 text-center">

                                  {booking.status ===
                                  "CONFIRMED" ? (

                                    <span className="font-bold text-green-700">
                                      DIKONFIRMASI
                                    </span>

                                  ) : booking.status ===
                                    "PENDING" ? (

                                    <span className="font-bold text-yellow-700">
                                      MENUNGGU
                                    </span>

                                  ) : (

                                    <span className="font-bold text-red-700">
                                      DIBATALKAN
                                    </span>

                                  )}

                                </td>

                              </tr>

                            );

                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>


              {/* =================================================
                  FOOTER PRINT
              ================================================= */}

              <div className="print-footer mt-8 hidden border-t-2 border-slate-900 pt-5">

                <div className="flex items-end justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Keterangan
                    </p>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                      Laporan ini dihasilkan oleh
                      Sistem Informasi Lapangin
                      berdasarkan data booking
                      pada periode yang dipilih.
                    </p>

                  </div>


                  <div className="text-right">

                    <p className="text-xs text-slate-500">
                      Dicetak pada
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatTanggalLengkap(
                        new Date()
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Administrator Lapangin
                    </p>

                  </div>

                </div>

              </div>


            </div>

          </div>

        </div>

      </div>


      {/* ========================================================
          PRINT CSS
      ======================================================== */}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ==================================================
               NORMAL SCREEN
            ================================================== */

            .print-header,
            .print-footer {
              display: none;
            }


            /* ==================================================
               PRINT
            ================================================== */

            @media print {

              @page {
                size: A4 landscape;
                margin: 10mm;
              }


              html,
              body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
              }


              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }


              /* ==============================================
                 SEMBUNYIKAN SEMUA HALAMAN
              ============================================== */

              body * {
                visibility: hidden !important;
              }


              /* ==============================================
                 HANYA PRINT AREA
              ============================================== */

              #print-area,
              #print-area * {
                visibility: visible !important;
              }


              #print-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
              }


              /* ==============================================
                 HEADER
              ============================================== */

              .print-header {
                display: block !important;
              }


              .print-footer {
                display: block !important;
              }


              /* ==============================================
                 HILANGKAN SHADOW
              ============================================== */

              #print-area .shadow,
              #print-area .shadow-sm,
              #print-area .shadow-md,
              #print-area .shadow-lg,
              #print-area .shadow-xl {
                box-shadow: none !important;
              }


              /* ==============================================
                 TABEL
              ============================================== */

              table {
                width: 100% !important;
                border-collapse: collapse !important;
              }


              thead {
                display: table-header-group !important;
              }


              tbody {
                display: table-row-group !important;
              }


              tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }


              th,
              td {
                border: 1px solid #cbd5e1 !important;
              }


              /* ==============================================
                 SECTION
              ============================================== */

              .print-section {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }


              /* ==============================================
                 WARNA BACKGROUND
              ============================================== */

              .bg-white {
                background-color: #ffffff !important;
              }


              .bg-slate-50 {
                background-color: #f8fafc !important;
              }


              .bg-slate-900 {
                background-color: #0f172a !important;
              }


              .bg-blue-50 {
                background-color: #eff6ff !important;
              }


              .bg-green-50 {
                background-color: #f0fdf4 !important;
              }


              .bg-yellow-50 {
                background-color: #fefce8 !important;
              }


              .bg-red-50 {
                background-color: #fef2f2 !important;
              }


              .bg-purple-50 {
                background-color: #faf5ff !important;
              }


              /* ==============================================
                 TEXT
              ============================================== */

              #print-area {
                color: #0f172a !important;
                font-family:
                  Arial,
                  Helvetica,
                  sans-serif !important;
              }


              /* ==============================================
                 HILANGKAN ELEMEN INTERAKTIF
              ============================================== */

              button,
              input,
              select,
              textarea,
              form {
                display: none !important;
              }


              /* ==============================================
                 LINK
              ============================================== */

              a {
                color: inherit !important;
                text-decoration: none !important;
              }


              /* ==============================================
                 BORDER
              ============================================== */

              .border-slate-200 {
                border-color: #cbd5e1 !important;
              }


              .border-slate-300 {
                border-color: #94a3b8 !important;
              }


              /* ==============================================
                 ROUNDED
              ============================================== */

              .rounded-2xl,
              .rounded-3xl {
                border-radius: 8px !important;
              }


              /* ==============================================
                 PAGE BREAK
              ============================================== */

              .page-break-before {
                page-break-before: always !important;
              }


              .page-break-after {
                page-break-after: always !important;
              }


              .avoid-break {
                page-break-inside: avoid !important;
              }

            }
          `,
        }}
      />

    </main>
  );
}