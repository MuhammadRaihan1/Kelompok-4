import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


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
// FORMAT TANGGAL LENGKAP
// ============================================================

function formatTanggalLengkap(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
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
    | "history"
    | "logout"
    | "search"
    | "admin"
    | "customer"
    | "calendar"
    | "more"
    | "arrow"
    | "back";
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
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

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

  if (type === "users") {
    return (
      <svg {...common}>
        <circle cx="9" cy="7" r="4" />
        <path d="M2 21c.7-4 3-6 7-6s6.3 2 7 6" />
        <path d="M16 3.2a4 4 0 0 1 0 7.6" />
        <path d="M17 15c2.8.5 4.4 2.4 5 6" />
      </svg>
    );
  }

  if (type === "history") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
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

  if (type === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    );
  }

  if (type === "admin") {
    return (
      <svg {...common}>
        <path d="M12 3l7 4v5c0 4.8-3 7.7-7 9-4-1.3-7-4.2-7-9V7l7-4Z" />
        <path d="M9.5 12l1.7 1.7 3.8-4" />
      </svg>
    );
  }

  if (type === "customer") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.8-4.3 3.5-6.5 8-6.5s7.2 2.2 8 6.5" />
      </svg>
    );
  }

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

  if (type === "more") {
    return (
      <svg {...common}>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </svg>
    );
  }

  if (type === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}


// ============================================================
// PAGE
// ============================================================

export default async function AdminCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    role?: string;
    success?: string;
    error?: string;
  }>;
}) {
  // ==========================================================
  // PARAMETER
  // ==========================================================

  const params = await searchParams;

  const search =
    params.search?.trim() || "";

  const role =
    params.role || "ALL";


  // ==========================================================
  // AUTH ADMIN
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
  // CEK ROLE DARI DATABASE
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
  // FILTER USER
  // ==========================================================

  const where: any = {};


  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
        },
      },
      {
        email: {
          contains: search,
        },
      },
    ];
  }


  if (
    role === "USER" ||
    role === "ADMIN"
  ) {
    where.role = role;
  }


  // ==========================================================
  // AMBIL USER
  // ==========================================================

  const users =
    await prisma.user.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });


  // ==========================================================
  // CUSTOMER DATA
  // ==========================================================

  const customers =
    await prisma.customer.findMany({
      select: {
        id: true,
        userId: true,
        username: true,
        name: true,
        email: true,

        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });


  // ==========================================================
  // MAP CUSTOMER
  // ==========================================================

  const customerMap =
    new Map(
      customers.map(
        (customer) => [
          customer.userId,
          customer,
        ]
      )
    );


  // ==========================================================
  // STATISTIK
  // ==========================================================

  const totalUsers =
    await prisma.user.count();


  const totalAdmin =
    await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });


  const totalCustomer =
    await prisma.user.count({
      where: {
        role: "USER",
      },
    });


  const totalBookings =
    await prisma.booking.count();


  // ==========================================================
  // SERVER ACTION UBAH ROLE
  // ==========================================================

  async function updateRole(
    formData: FormData
  ) {
    "use server";


    // ========================================================
    // AUTH
    // ========================================================

    const currentHeaders =
      await headers();

    const currentSession =
      await auth.api.getSession({
        headers: currentHeaders,
      });


    if (!currentSession) {
      redirect("/admin/login");
    }


    // ========================================================
    // CEK ADMIN
    // ========================================================

    const currentAdmin =
      await prisma.user.findUnique({
        where: {
          id: currentSession.user.id,
        },

        select: {
          role: true,
        },
      });


    if (
      !currentAdmin ||
      currentAdmin.role !== "ADMIN"
    ) {
      redirect("/dashboard");
    }


    // ========================================================
    // DATA FORM
    // ========================================================

    const userId =
      formData
        .get("userId")
        ?.toString();

    const newRole =
      formData
        .get("role")
        ?.toString();


    if (
      !userId ||
      (
        newRole !== "USER" &&
        newRole !== "ADMIN"
      )
    ) {
      redirect(
        "/admin/customer?error=Data%20role%20tidak%20valid"
      );
    }


    // ========================================================
    // CEGAH ADMIN MENURUNKAN DIRINYA SENDIRI
    // ========================================================

    if (
      userId === currentSession.user.id &&
      newRole !== "ADMIN"
    ) {
      redirect(
        "/admin/customer?error=Admin%20tidak%20dapat%20menurunkan%20role%20akunnya%20sendiri"
      );
    }


    // ========================================================
    // UPDATE ROLE
    // ========================================================

    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        role:
          newRole as
            | "USER"
            | "ADMIN",
      },
    });


    // ========================================================
    // REFRESH
    // ========================================================

    revalidatePath(
      "/admin/customer"
    );


    redirect(
      "/admin/customer?success=Role%20user%20berhasil%20diperbarui"
    );
  }


  // ==========================================================
  // LOGOUT
  // ==========================================================

  async function logout() {
    "use server";

    const currentHeaders =
      await headers();

    const currentSession =
      await auth.api.getSession({
        headers: currentHeaders,
      });

    if (currentSession) {
      await auth.api.signOut({
        headers: currentHeaders,
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

        <aside className="hidden w-[260px] flex-col bg-[#020817] text-white lg:flex">

          {/* LOGO */}

          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">

            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">

              <img
                src="/logo2.jpg"
                alt="Lapangin"
                className="h-full w-full object-cover"
              />

            </div>

            <div>

              <h1 className="text-lg font-bold">
                Lapangin
              </h1>

              <p className="text-xs text-slate-500">
                Admin Panel
              </p>

            </div>

          </div>


          {/* MENU */}

          <nav className="flex-1 px-4 py-6">

            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Menu Utama
            </p>


            <Link
              href="/admin/dashboard"
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >

              <Icon type="dashboard" />

              Dashboard

            </Link>


            <Link
              href="/admin/lapangan"
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >

              <Icon type="field" />

              Lapangan

            </Link>


            <Link
              href="/admin/booking"
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >

              <Icon type="booking" />

              Riwayat Pemesanan

            </Link>


            <Link
              href="/admin/customer"
              className="mb-1 flex items-center gap-3 rounded-xl bg-slate-800 px-3 py-3 font-semibold text-white"
            >

              <Icon type="users" />

              Manajemen User
              </Link>
            <Link
              href="/admin/laporan"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >

              <Icon type="history" />

              Laporan Pendapatan
            </Link>

          </nav>


          {/* ADMIN PROFILE */}

          <div className="border-t border-white/10 p-4">

            <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-900 p-3">

              {adminUser.image ? (

                <img
                  src={adminUser.image}
                  alt={
                    adminUser.name ||
                    "Admin"
                  }
                  className="h-10 w-10 rounded-full object-cover"
                />

              ) : (

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 font-bold">

                  {(
                    adminUser.name ||
                    adminUser.email ||
                    "A"
                  )
                    .charAt(0)
                    .toUpperCase()}

                </div>

              )}


              <div className="min-w-0">

                <p className="truncate text-sm font-semibold">
                  {adminUser.name ||
                    "Administrator"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {adminUser.email}
                </p>

              </div>

            </div>


            <form action={logout}>

              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
              >

                <Icon type="logout" />

                Keluar

              </button>

            </form>

          </div>

        </aside>


        {/* ==================================================
            MAIN
        ================================================== */}

        <div className="min-w-0 flex-1">


          {/* TOPBAR */}

          <header className="h-20 border-b border-slate-200 bg-white">

            <div className="flex h-full items-center justify-between px-5 md:px-8">

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Admin Panel
                </p>

                <h2 className="text-xl font-bold">
                  Manajemen User
                </h2>

              </div>


              <div className="hidden items-center gap-3 sm:flex">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                  <Icon type="admin" />

                </div>

                <div>

                  <p className="text-sm font-bold">
                    Administrator
                  </p>

                  <p className="text-xs text-slate-400">
                    Kelola pengguna sistem
                  </p>

                </div>

              </div>

            </div>

          </header>


          {/* CONTENT */}

          <div className="p-5 md:p-8">


            {/* HEADER */}

            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

              <div>

                <p className="mb-2 text-sm font-semibold text-blue-600">
                  Pengguna Sistem
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                  Manajemen User
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Kelola data pengguna dan hak akses
                  aplikasi Lapangin.
                </p>

              </div>


              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

                <p className="text-xs text-slate-400">
                  Total User
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {totalUsers}
                </p>

              </div>

            </div>


            {/* =================================================
                NOTIFICATION
            ================================================= */}

            {params.success && (

              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-600">
                    ✓
                  </div>

                  <p className="text-sm font-semibold text-green-800">
                    {params.success}
                  </p>

                </div>

              </div>

            )}


            {params.error && (

              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                    !
                  </div>

                  <p className="text-sm font-semibold text-red-800">
                    {params.error}
                  </p>

                </div>

              </div>

            )}


            {/* =================================================
                STATISTIK
            ================================================= */}

            <div className="mb-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">


              {/* TOTAL */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-400">
                      Total User
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {totalUsers}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    <Icon type="users" />

                  </div>

                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Semua pengguna terdaftar
                </p>

              </div>


              {/* CUSTOMER */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-400">
                      Customer
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {totalCustomer}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">

                    <Icon type="customer" />

                  </div>

                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Role USER
                </p>

              </div>


              {/* ADMIN */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-400">
                      Administrator
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {totalAdmin}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                    <Icon type="admin" />

                  </div>

                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Role ADMIN
                </p>

              </div>


              {/* BOOKING */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-400">
                      Total Booking
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {totalBookings}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">

                    <Icon type="booking" />

                  </div>

                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Booking seluruh user
                </p>

              </div>

            </div>


            {/* =================================================
                FILTER
            ================================================= */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <form
                method="GET"
                className="flex flex-col gap-4 lg:flex-row"
              >


                {/* SEARCH */}

                <div className="relative flex-1">

                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

                    <Icon type="search" />

                  </div>

                  <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Cari nama atau email user..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>


                {/* ROLE */}

                <select
                  name="role"
                  defaultValue={role}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >

                  <option value="ALL">
                    Semua Role
                  </option>

                  <option value="USER">
                    Customer / USER
                  </option>

                  <option value="ADMIN">
                    Administrator
                  </option>

                </select>


                {/* BUTTON */}

                <button
                  type="submit"
                  className="rounded-xl bg-[#020817] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Cari User
                </button>


                {(search ||
                  role !== "ALL") && (

                  <Link
                    href="/admin/customer"
                    className="flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Reset
                  </Link>

                )}

              </form>

            </div>


            {/* =================================================
                USER TABLE
            ================================================= */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Daftar Pengguna
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Menampilkan {users.length} user
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
                  Data diperbarui otomatis
                </div>

              </div>


              {users.length === 0 ? (

                <div className="px-6 py-20 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                    <Icon type="users" />

                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-800">
                    User tidak ditemukan
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Coba gunakan nama atau email yang
                    berbeda.
                  </p>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px]">

                    <thead>

                      <tr className="border-b border-slate-100 bg-slate-50/70">

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          Pengguna
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          Username
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          Role
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          Booking
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          Terdaftar
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                          Kelola Role
                        </th>

                      </tr>

                    </thead>


                    <tbody className="divide-y divide-slate-100">

                      {users.map(
                        (user) => {

                          const customer =
                            customerMap.get(
                              user.id
                            );


                          return (

                            <tr
                              key={user.id}
                              className="transition hover:bg-slate-50"
                            >


                              {/* USER */}

                              <td className="px-6 py-5">

                                <div className="flex items-center gap-3">

                                  {user.image ? (

                                    <img
                                      src={user.image}
                                      alt={
                                        user.name ||
                                        "User"
                                      }
                                      className="h-11 w-11 rounded-full object-cover"
                                    />

                                  ) : (

                                    <div
                                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold ${
                                        user.role ===
                                        "ADMIN"
                                          ? "bg-purple-100 text-purple-700"
                                          : "bg-blue-100 text-blue-700"
                                      }`}
                                    >

                                      {(
                                        user.name ||
                                        user.email ||
                                        "U"
                                      )
                                        .charAt(0)
                                        .toUpperCase()}

                                    </div>

                                  )}


                                  <div className="min-w-0">

                                    <p className="truncate font-bold text-slate-800">

                                      {user.name ||
                                        "Tanpa Nama"}

                                    </p>

                                    <p className="max-w-[240px] truncate text-xs text-slate-400">

                                      {user.email}

                                    </p>

                                  </div>

                                </div>

                              </td>


                              {/* USERNAME */}

                              <td className="px-6 py-5">

                                {customer ? (

                                  <div>

                                    <p className="font-semibold text-slate-700">
                                      @{customer.username}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                      Customer
                                    </p>

                                  </div>

                                ) : (

                                  <span className="text-sm text-slate-400">
                                    —
                                  </span>

                                )}

                              </td>


                              {/* ROLE */}

                              <td className="px-6 py-5">

                                {user.role ===
                                "ADMIN" ? (

                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700">

                                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />

                                    ADMIN

                                  </span>

                                ) : (

                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">

                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                                    USER

                                  </span>

                                )}

                              </td>


                              {/* BOOKING */}

                              <td className="px-6 py-5">

                                <div className="flex items-center gap-2">

                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">

                                    <Icon type="booking" />

                                  </div>

                                  <span className="font-bold text-slate-700">

                                    {customer?._count
                                      .bookings ??
                                      0}

                                  </span>

                                </div>

                              </td>


                              {/* TANGGAL */}

                              <td className="px-6 py-5">

                                <div className="flex items-center gap-2 text-sm">

                                  <span className="text-slate-400">

                                    <Icon type="calendar" />

                                  </span>

                                  <span className="font-medium text-slate-600">

                                    {formatTanggal(
                                      user.createdAt
                                    )}

                                  </span>

                                </div>

                              </td>


                              {/* ROLE ACTION */}

                              <td className="px-6 py-5">

                                <form
                                  action={
                                    updateRole
                                  }
                                  className="flex items-center justify-end gap-2"
                                >

                                  <input
                                    type="hidden"
                                    name="userId"
                                    value={
                                      user.id
                                    }
                                  />


                                  <select
                                    name="role"
                                    defaultValue={
                                      user.role
                                    }
                                    disabled={
                                      user.id ===
                                      adminUser.id
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-blue-500"
                                  >

                                    <option value="USER">
                                      USER
                                    </option>

                                    <option value="ADMIN">
                                      ADMIN
                                    </option>

                                  </select>


                                  <button
                                    type="submit"
                                    disabled={
                                      user.id ===
                                      adminUser.id
                                    }
                                    className="rounded-lg bg-[#020817] px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    Simpan
                                  </button>

                                </form>

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
                INFORMATION
            ================================================= */}

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  i
                </div>

                <div>

                  <h3 className="font-bold text-blue-900">
                    Informasi Manajemen User
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-blue-700">

                    Role <b>USER</b> digunakan untuk
                    pelanggan yang melakukan pemesanan
                    lapangan. Role <b>ADMIN</b> memiliki
                    akses ke halaman administrasi untuk
                    mengelola lapangan, booking, dan
                    pengguna.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}