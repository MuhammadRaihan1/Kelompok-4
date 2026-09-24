import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

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
      <path d="M10 21h4" />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function LapanganPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
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

  async function logout() {
    "use server";

    await auth.api.signOut({
      headers: await nextHeaders(),
    });

    redirect("/");
  }

  /* =======================================================
     AMBIL DATA LAPANGAN DARI DATABASE

     Hanya lapangan dengan isActive = true
     yang ditampilkan kepada Customer.
  ======================================================= */

  const { q } = await searchParams;
  const keyword = q?.trim() || "";

  const lapangan = await prisma.lapangan.findMany({
    where: {
      isActive: true,
      ...(keyword
        ? {
            OR: [
              { name: { contains: keyword } },
              { category: { contains: keyword } },
              { location: { contains: keyword } },
              { description: { contains: keyword } },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /* =======================================================
     FORMAT RUPIAH
  ======================================================= */

  const formatRupiah = (price: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const namaUser =
    user.name?.trim() || "Pelanggan";

  const namaDepan =
    namaUser.split(" ")[0] || "Pelanggan";

  const avatarText =
    namaUser.charAt(0).toUpperCase();

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* =================================================
            SIDEBAR
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
                className="group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
               
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition group-hover:bg-white/10 group-hover:text-white">
                  <DashboardIcon />
                </span>

                Dashboard
              </Link>

              {/* LAPANGAN */}

              <Link
                href="/dashboard/lapangan"
                 className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-[#07152f] shadow-lg shadow-black/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#07152f] text-white">
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
            MAIN AREA
        ================================================= */}

        <div className="flex-2 min-w-0 lg:ml-64">

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

              <div className="hidden items-center gap-2 lg:flex">
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

            {/* =================================================
                LIST HEADER
            ================================================= */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Daftar Lapangan
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {lapangan.length} lapangan tersedia
                  {keyword && ` untuk "${keyword}"`}
                </p>
              </div>

              <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
              <form method="get" className="ml-auto mt-4 flex max-w-5xl gap-1">
                <input
                  type="search"
                  name="q"
                  defaultValue={keyword}
                  placeholder="Cari nama, kategori, lokasi, atau deskripsi..."
                  aria-label="Cari lapangan"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  type="submit"
                  className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Cari
                </button>
              </form>
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
                  {keyword ? "Lapangan Tidak Ditemukan" : "Belum Ada Lapangan"}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                  {keyword
                    ? "Tidak ada lapangan yang sesuai dengan pencarian. Coba gunakan kata kunci lain."
                    : "Saat ini belum ada lapangan aktif yang tersedia. Lapangan yang ditambahkan oleh Admin akan muncul otomatis di halaman ini."}
                </p>
              </div>

            ) : (

              /* =================================================
                 LIST LAPANGAN
              ================================================= */

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {lapangan.map((item) => (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* =================================================
                        COVER / GAMBAR LAPANGAN
                    ================================================= */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      {/* =================================================
                          JIKA ADA GAMBAR DARI ADMIN
                      ================================================= */}
                      {item.picture_url ? (
                        <img
                          src={item.picture_url}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        /* =================================================
                           JIKA BELUM ADA GAMBAR
                        ================================================= */
                        <div className="flex h-full items-center justify-center">
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
                        </div>
                      )}
                      {/* =================================================
                          CATEGORY
                      ================================================= */}
                      <div className="absolute left-4 top-4">
                        <span className="inline-flex rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                          {item.category}
                        </span>
                      </div>
                      {/* =================================================
                          STATUS
                      ================================================= */}
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
                              {formatRupiah(
                                Number(item.price)
                              )}
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