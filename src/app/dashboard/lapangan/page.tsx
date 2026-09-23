  import { auth } from "@/lib/auth";
  import { prisma } from "@/lib/prisma";
  import { headers as nextHeaders } from "next/headers";
  import { redirect } from "next/navigation";

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

  function PaymentIcon() {
    return (
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

  function SearchIcon() {
    return (
      <svg
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

  /* =========================================================
    PAGE
  ========================================================= */

  export default async function LapanganPage() {
    /* =======================================================
      CEK SESSION
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
      
      HANYA LAPANGAN AKTIF YANG DITAMPILKAN CUSTOMER
    ======================================================= */

    const lapangan = await prisma.lapangan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /* =======================================================
      FORMAT RUPIAH
    ======================================================= */

    const formatRupiah = (price: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(price));
    };

    /* =======================================================
      RETURN
    ======================================================= */

    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">

        <div className="flex min-h-screen">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 text-white lg:flex">

            {/* =================================================
                LOGO
            ================================================= */}

            <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-950">
                L
              </div>

              <div>

                <h1 className="text-lg font-bold tracking-tight">
                  Lapangin
                </h1>

                <p className="text-xs text-slate-500">
                  Booking Lapangan
                </p>

              </div>

            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="flex-1 px-4 py-6">
  <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
    Menu Utama
  </p>

  <div className="space-y-1">

    {/* DASHBOARD */}
   {/* DASHBOARD */}
<a
  href="/dashboard"
  className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
>
  <DashboardIcon />
  <span>Dashboard</span>
</a>

{/* LAPANGAN */}
<a
  href="/dashboard/lapangan"
  className="flex items-center gap-3 rounded-xl bg-slate-800 px-3 py-3 font-medium text-white"
>
  <FieldIcon />
  <span>Lapangan</span>
</a>

    {/* PESAN LAPANGAN */}
    <a
      href="/dashboard/booking"
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
    >
      <BookingIcon />

      <span>
        Pesan Lapangan
      </span>
    </a>

    {/* RIWAYAT */}
    <a
      href="/dashboard/riwayat"
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
    >
      <HistoryIcon />

      <span>
        Riwayat Pemesanan
      </span>
    </a>
              </div>

            </nav>

            {/* =================================================
                USER
            ================================================= */}

            <div className="border-t border-slate-800 p-4">

              <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">

                {user.image ? (

                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />

                ) : (

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 font-semibold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                )}

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-white">
                    {user.name || "Customer"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>

                </div>

              </div>

            </div>

          </aside>

          {/* =================================================
              MAIN AREA
          ================================================= */}

          <div className="min-w-0 flex-1">

            {/* =================================================
                TOPBAR
            ================================================= */}

            <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">

              {/* MOBILE LOGO */}

              <div className="flex items-center gap-3 lg:hidden">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 font-bold text-white">
                  L
                </div>

                <span className="font-bold">
                  Lapangin
                </span>

              </div>

              {/* BREADCRUMB */}

              <div className="hidden items-center gap-2 text-sm md:flex">

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
                  Lapangan
                </span>

              </div>

              {/* USER HEADER */}

              <div className="ml-auto flex items-center gap-3">

                <div className="hidden text-right sm:block">

                  <p className="text-sm font-semibold text-slate-900">
                    {user.name || "Customer"}
                  </p>

                  <p className="text-xs text-slate-500">
                    Pelanggan
                  </p>

                </div>

                {user.image ? (

                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                  />

                ) : (

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                )}

              </div>

            </header>

            {/* =================================================
                PAGE CONTENT
            ================================================= */}

            <main className="mx-auto max-w-[1600px] p-5 md:p-8">

              {/* =================================================
                  HEADING
              ================================================= */}

              <div className="mb-8">

                <p className="mb-2 text-sm font-medium text-slate-500">
                  Lapangan
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  Pilih Lapangan
                </h1>

                <p className="mt-2 text-slate-500">
                  Cari lapangan, cek ketersediaan, dan pilih jadwal bermainmu.
                </p>

              </div>

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Daftar Lapangan
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {lapangan.length} lapangan tersedia
                  </p>

                </div>

                <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">

                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  Tersedia

                </div>

              </div>

              {/* =================================================
                  JIKA DATABASE KOSONG
              ================================================= */}

              {lapangan.length === 0 ? (

                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <FieldIcon />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-800">
                    Belum Ada Lapangan
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Saat ini belum ada lapangan aktif yang tersedia.
                    Lapangan yang ditambahkan oleh Admin akan muncul
                    otomatis di halaman ini.
                  </p>

                </div>

              ) : (

                /* =================================================
                  LIST DARI DATABASE
                ================================================= */

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                  {lapangan.map((item) => (

                    <div
                      key={item.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >

                      {/* =================================================
                          COVER
                      ================================================= */}

                      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">

                        <div className="text-7xl transition duration-300 group-hover:scale-110">

                          {item.category === "Futsal" && "⚽"}

                          {item.category === "Badminton" && "🏸"}

                          {item.category === "Basket" && "🏀"}

                          {item.category === "Volleyball" && "🏐"}

                          {![
                            "Futsal",
                            "Badminton",
                            "Basket",
                            "Volleyball",
                          ].includes(item.category) && "🏟️"}

                        </div>

                        {/* CATEGORY */}

                        <div className="absolute left-4 top-4">

                          <span className="inline-flex rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">

                            {item.category}

                          </span>

                        </div>

                        {/* STATUS */}

                        <div className="absolute right-4 top-4">

                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                            <span className="h-2 w-2 rounded-full bg-emerald-500" />

                            Tersedia

                          </span>

                        </div>

                      </div>

                      {/* =================================================
                          CARD CONTENT
                      ================================================= */}

                      <div className="p-5">

                        {/* NAME */}

                        <h3 className="text-lg font-bold text-slate-950">
                          {item.name}
                        </h3>

                        {/* LOCATION */}

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">

                          <LocationIcon />

                          <span>
                            {item.location}
                          </span>

                        </div>

                        {/* DESCRIPTION */}

                        <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-500">

                          {item.description ||
                            "Tidak ada deskripsi."}

                        </p>

                        {/* SEPARATOR */}

                        <div className="my-5 h-px bg-slate-100" />

                        {/* PRICE */}

                        <div className="mb-5 flex items-end justify-between">

                          <div>

                            <p className="text-xs text-slate-400">
                              Harga per jam
                            </p>

                            <div className="mt-1 flex items-end gap-1">

                              <p className="text-xl font-bold text-slate-950">
                                {formatRupiah(Number(item.price))}
                              </p>

                              <span className="mb-0.5 text-sm text-slate-400">
                                /jam
                              </span>

                            </div>

                          </div>

                          {/* CLOCK */}

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                            <svg
                              width="19"
                              height="19"
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

                          </div>

                        </div>

                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div className="flex gap-3">

                          {/* DETAIL */}

                          <a
                            href={`/dashboard/lapangan/${item.id}`}
                            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Lihat Detail
                          </a>

                          {/* BOOKING */}
<a
  href={`/dashboard/booking?lapangan=${item.id}`}
  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
>
  Booking
</a>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

              {/* =================================================
                  INFORMATION
              ================================================= */}

              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

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

                      <path d="M12 11v5" />

                      <path d="M12 8h.01" />
                    </svg>

                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      Informasi Lapangan
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Data lapangan pada halaman ini diambil langsung
                      dari database. Lapangan yang ditambahkan oleh
                      Admin dengan status Aktif akan otomatis muncul
                      di halaman Customer.
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