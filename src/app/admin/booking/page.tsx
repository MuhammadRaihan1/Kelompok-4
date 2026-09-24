import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


// ======================================================
// FORMAT RUPIAH
// ======================================================

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}


// ======================================================
// FORMAT TANGGAL
// ======================================================

function formatTanggal(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}


// ======================================================
// FORMAT JAM
// ======================================================

function formatJam(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}


// ======================================================
// HITUNG DURASI
// ======================================================

function hitungDurasi(start: Date, end: Date) {
  return (
    (end.getTime() - start.getTime()) /
    (1000 * 60 * 60)
  );
}


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "CONFIRMED") {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
        Dikonfirmasi
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
        Dibatalkan
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">
      Menunggu
    </span>
  );
}


// ======================================================
// ICON
// ======================================================

function Icon({
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


// ======================================================
// SEARCH ICON
// ======================================================

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}


// ======================================================
// ADMIN BOOKING
// ======================================================

export default async function AdminBookingPage() {

  // ====================================================
  // CEK SESSION
  // ====================================================

  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/admin/login");
  }


  // ====================================================
  // AMBIL USER DARI DATABASE
  // ====================================================

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


  if (!user) {
    redirect("/admin/login");
  }


  // ====================================================
  // CEK ADMIN
  // ====================================================

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  async function keluar() {
      "use server";
  
      await auth.api.signOut({
        headers: requestHeaders,
      });
  
      redirect("/admin/login");
    }


  // ====================================================
  // SERVER ACTION KONFIRMASI / PEMBATALAN
  // ====================================================

  async function updateBookingStatus(
    formData: FormData
  ) {
    "use server";

    const bookingId =
      formData.get("bookingId")?.toString();

    const status =
      formData.get("status")?.toString();


    if (!bookingId) {
      return;
    }


    if (
      status !== "CONFIRMED" &&
      status !== "CANCELLED"
    ) {
      return;
    }


    // -----------------------------------------------
    // CEK SESSION LAGI
    // -----------------------------------------------

    const requestHeaders = await headers();

    const currentSession =
      await auth.api.getSession({
        headers: requestHeaders,
      });


    if (!currentSession) {
      redirect("/admin/login");
    }


    // -----------------------------------------------
    // CEK USER ADMIN
    // -----------------------------------------------

    const adminUser =
      await prisma.user.findUnique({
        where: {
          id: currentSession.user.id,
        },

        select: {
          role: true,
        },
      });


    if (
      !adminUser ||
      adminUser.role !== "ADMIN"
    ) {
      redirect("/dashboard");
    }


    // -----------------------------------------------
    // CEK BOOKING
    // -----------------------------------------------

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },

        select: {
          id: true,
          status: true,
        },
      });


    if (!booking) {
      return;
    }


    // -----------------------------------------------
    // UPDATE STATUS
    // -----------------------------------------------

    await prisma.booking.update({
      where: {
        id: bookingId,
      },

      data: {
        status:
          status === "CONFIRMED"
            ? "CONFIRMED"
            : "CANCELLED",
      },
    });


    // -----------------------------------------------
    // REFRESH HALAMAN
    // -----------------------------------------------

    revalidatePath("/admin/booking");
    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard/riwayat");
  }


  // ====================================================
  // AMBIL SEMUA BOOKING
  // ====================================================

  const bookings =
    await prisma.booking.findMany({
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


  // ====================================================
  // STATISTIK
  // ====================================================

  const totalBooking =
    bookings.length;

  const pendingBooking =
    bookings.filter(
      (item) =>
        item.status === "PENDING"
    ).length;

  const confirmedBooking =
    bookings.filter(
      (item) =>
        item.status === "CONFIRMED"
    ).length;

  const cancelledBooking =
    bookings.filter(
      (item) =>
        item.status === "CANCELLED"
    ).length;


  // ====================================================
  // TOTAL PENDAPATAN
  // ====================================================

  const totalPendapatan =
    bookings
      .filter(
        (item) =>
          item.status === "CONFIRMED"
      )
      .reduce(
        (total, booking) => {

          const durasi =
            hitungDurasi(
              booking.startTime,
              booking.endTime
            );

          return (
            total +
            booking.lapangan.price *
              durasi
          );
        },

        0
      );


  // ====================================================
  // ADMIN PROFILE
  // ====================================================

  const namaAdmin =
    user.name ||
    "Administrator";

  const inisial =
    namaAdmin
      .split(" ")
      .map(
        (item) =>
          item.charAt(0)
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();


  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0d1b35]">

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
            className="mb-2 flex items-center gap-4 rounded-xl bg-[#1d2a42] px-4 py-3.5 text-[13px] font-medium text-white transition"
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
            className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-[13px] font-medium text-[#a6b5cf] transition hover:bg-[#111d31] hover:text-white"
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

      <main className="min-w-0 lg:ml-64">

        {/* HEADER */}

        <header className="min-h-[6.5625rem] border-b border-[#e4e8ef] bg-white">

          <div className="flex min-h-[6.5625rem] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-9">

            <div>

              <p className="text-sm font-medium text-[#8da0bd]">
                Admin Panel
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#07152f]">
                Riwayat Pemesanan
              </h2>

            </div>


            <div className="flex min-w-0 flex-1 items-center justify-end gap-3 sm:gap-5">

              {/* NOTIFIKASI */}

              <button
                type="button"
                aria-label="Notifikasi"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe5ed] bg-[#f8fafc] text-[#13213a] transition hover:bg-[#eef2f7]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>

                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[#f8fafc] bg-red-500" />
              </button>


              <div className="hidden h-11 w-px bg-[#e1e6ed] md:block" />


              <div className="relative shrink-0">
                <input id="profile-menu" type="checkbox" className="peer sr-only" />

                <label
                  htmlFor="profile-menu"
                  className="flex cursor-pointer items-center gap-3 rounded-xl p-1 transition hover:bg-[#f1f5f9]"
                >

                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#07152f] text-sm font-bold text-white">

                  {user.image ? (
                    <img
                      src={user.image}
                      alt={namaAdmin}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    inisial
                  )}

                </div>


                <div className="hidden max-w-42.5 sm:block">

                  <p className="truncate text-sm font-bold text-[#15213a]">
                    {namaAdmin}
                  </p>

                  <p className="mt-0.5 text-xs text-[#91a0b5]">
                    Administrator
                  </p>

                </div>

                </label>

                <div className="absolute right-0 top-full z-20 mt-3 hidden w-72 rounded-2xl border border-[#e2e7ee] bg-white p-4 shadow-xl peer-checked:block">
                  <div className="flex items-center gap-3 border-b border-[#edf0f4] pb-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#07152f] text-sm font-bold text-white">
                      {user.image ? (
                        <img src={user.image} alt={namaAdmin} className="h-full w-full object-cover" />
                      ) : (
                        inisial
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#15213a]">{namaAdmin}</p>
                      <p className="truncate text-xs text-[#91a0b5]">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 text-sm">
                    <span className="text-[#64748b]">Status</span>
                    <span className="flex items-center gap-1.5 font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500" /> Administrator
                    </span>
                  </div>

                  <form action={keluar}>
                    <button type="submit" className="w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                      Keluar
                    </button>
                  </form>
                </div>

              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="p-6 sm:p-9">

          {/* TITLE */}

          <div className="mb-8">

            <p className="text-sm font-medium text-[#8da0bd]">
              Manajemen Pemesanan
            </p>

            <h3 className="mt-1 text-3xl font-bold tracking-tight text-[#07152f]">
              Daftar Pemesanan
            </h3>

            <p className="mt-2 text-sm text-[#8190a5]">
              Kelola, konfirmasi, dan batalkan
              pemesanan lapangan futsal.
            </p>

          </div>


          {/* =================================================
              STATISTIK
          ================================================= */}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL */}

            <div className="rounded-2xl border border-[#e2e7ee] bg-white p-6 shadow-sm">

              <p className="text-sm font-medium text-[#8392a8]">
                Total Pemesanan
              </p>

              <p className="mt-3 text-3xl font-bold text-[#07152f]">
                {totalBooking}
              </p>

              <p className="mt-3 text-xs text-[#98a4b5]">
                Semua pemesanan
              </p>

            </div>


            {/* PENDING */}

            <div className="rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm">

              <p className="text-sm font-medium text-[#927b4c]">
                Menunggu
              </p>

              <p className="mt-3 text-3xl font-bold text-[#07152f]">
                {pendingBooking}
              </p>

              <p className="mt-3 text-xs text-[#98a4b5]">
                Perlu dikonfirmasi
              </p>

            </div>


            {/* CONFIRMED */}

            <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm">

              <p className="text-sm font-medium text-[#66816d]">
                Dikonfirmasi
              </p>

              <p className="mt-3 text-3xl font-bold text-[#07152f]">
                {confirmedBooking}
              </p>

              <p className="mt-3 text-xs text-[#98a4b5]">
                Booking berhasil
              </p>

            </div>


            {/* CANCELLED */}

            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">

              <p className="text-sm font-medium text-[#956c6c]">
                Dibatalkan
              </p>

              <p className="mt-3 text-3xl font-bold text-[#07152f]">
                {cancelledBooking}
              </p>

              <p className="mt-3 text-xs text-[#98a4b5]">
                Booking dibatalkan
              </p>

            </div>

          </div>


          {/* =================================================
              PENDAPATAN
          ================================================= */}

          <div className="mt-6 rounded-2xl border border-[#e2e7ee] bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-medium text-[#8392a8]">
                  Total Pendapatan
                </p>

                <h3 className="mt-2 text-3xl font-bold text-[#07152f]">
                  {formatRupiah(
                    totalPendapatan
                  )}
                </h3>

                <p className="mt-2 text-xs text-[#98a4b5]">
                  Hanya dari booking yang
                  sudah dikonfirmasi
                </p>

              </div>


              <Link
                href="/admin/laporan"
                className="rounded-xl bg-[#07152f] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#152849]"
              >
                Lihat Laporan
              </Link>

            </div>

          </div>


          {/* =================================================
              TABLE
          ================================================= */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-[#e2e7ee] bg-white shadow-sm">

            {/* TABLE HEADER */}

            <div className="border-b border-[#e8edf2] p-6">

              <h3 className="text-xl font-bold text-[#07152f]">
                Pemesanan Terdaftar
              </h3>

              <p className="mt-1 text-sm text-[#8a98ac]">
                {totalBooking} pemesanan ditemukan
              </p>

            </div>


            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1250px]">

                <thead>

                  <tr className="border-b border-[#e9edf2] bg-[#fafbfd]">

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8997aa]">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8997aa]">
                      Lapangan
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8997aa]">
                      Tanggal
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8997aa]">
                      Waktu
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8997aa]">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8997aa]">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#8997aa]">
                      Aksi
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {bookings.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-6 py-20 text-center"
                      >

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f4f8] text-2xl">
                          📅
                        </div>

                        <h3 className="mt-4 font-bold text-[#52627a]">
                          Belum Ada Pemesanan
                        </h3>

                        <p className="mt-1 text-sm text-[#98a4b5]">
                          Data pemesanan customer
                          akan muncul di sini.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    bookings.map(
                      (booking) => {

                        const durasi =
                          hitungDurasi(
                            booking.startTime,
                            booking.endTime
                          );

                        const total =
                          booking.lapangan.price *
                          durasi;


                        return (

                          <tr
                            key={booking.id}
                            className="border-b border-[#edf0f4] transition hover:bg-[#fafbfd]"
                          >

                            {/* CUSTOMER */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9eef5] text-sm font-bold text-[#263b5e]">

                                  {(
                                    booking.customer.name ||
                                    booking.customer.username ||
                                    "C"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>


                                <div>

                                  <p className="font-semibold text-[#17243d]">
                                    {booking.customer.name ||
                                      booking.customer.username}
                                  </p>

                                  <p className="mt-1 text-xs text-[#8d9aab]">
                                    {booking.customer.email}
                                  </p>

                                </div>

                              </div>

                            </td>


                            {/* LAPANGAN */}

                            <td className="px-6 py-5">

                              <p className="font-semibold text-[#17243d]">
                                {booking.lapangan.name}
                              </p>

                              <p className="mt-1 text-xs text-[#8d9aab]">
                                {booking.lapangan.location}
                              </p>

                            </td>


                            {/* TANGGAL */}

                            <td className="px-6 py-5">

                              <p className="text-sm font-medium text-[#52627a]">
                                {formatTanggal(
                                  booking.startTime
                                )}
                              </p>

                            </td>


                            {/* WAKTU */}

                            <td className="px-6 py-5">

                              <p className="text-sm font-semibold text-[#263b5e]">
                                {formatJam(
                                  booking.startTime
                                )}
                                {" - "}
                                {formatJam(
                                  booking.endTime
                                )}
                              </p>

                              <p className="mt-1 text-xs text-[#8d9aab]">
                                {durasi} jam
                              </p>

                            </td>


                            {/* TOTAL */}

                            <td className="px-6 py-5">

                              <p className="font-bold text-[#17243d]">
                                {formatRupiah(
                                  total
                                )}
                              </p>

                            </td>


                            {/* STATUS */}

                            <td className="px-6 py-5">

                              <StatusBadge
                                status={
                                  booking.status
                                }
                              />

                            </td>


                            {/* AKSI */}

                            <td className="px-6 py-5">

                              {booking.status ===
                              "PENDING" ? (

                                <div className="flex flex-col gap-2">

                                  {/* KONFIRMASI */}

                                  <form
                                    action={
                                      updateBookingStatus
                                    }
                                  >

                                    <input
                                      type="hidden"
                                      name="bookingId"
                                      value={
                                        booking.id
                                      }
                                    />

                                    <input
                                      type="hidden"
                                      name="status"
                                      value="CONFIRMED"
                                    />

                                    <button
                                      type="submit"
                                      className="w-full rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700"
                                    >
                                      ✓ Konfirmasi
                                    </button>

                                  </form>


                                  {/* BATALKAN */}

                                  <form
                                    action={
                                      updateBookingStatus
                                    }
                                  >

                                    <input
                                      type="hidden"
                                      name="bookingId"
                                      value={
                                        booking.id
                                      }
                                    />

                                    <input
                                      type="hidden"
                                      name="status"
                                      value="CANCELLED"
                                    />

                                    <button
                                      type="submit"
                                      className="w-full rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                                    >
                                      × Batalkan
                                    </button>

                                  </form>

                                </div>

                              ) : booking.status ===
                                "CONFIRMED" ? (

                                <span className="text-xs font-semibold text-green-600">
                                  ✓ Sudah dikonfirmasi
                                </span>

                              ) : (

                                <span className="text-xs font-semibold text-red-500">
                                  ✕ Pemesanan dibatalkan
                                </span>

                              )}

                            </td>

                          </tr>

                        );
                      }
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}