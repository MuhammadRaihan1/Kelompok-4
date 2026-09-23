import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


// ============================================================
// CONSTANT
// ============================================================

const START_HOUR = 8;
const END_HOUR = 22;
const SLOT_HEIGHT = 72;


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
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}


// ============================================================
// FORMAT TANGGAL SINGKAT
// ============================================================

function formatTanggalSingkat(date: Date) {
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
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);
}


// ============================================================
// AMBIL JAM DALAM WIB
// ============================================================

function getHour(date: Date) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(date)
  );
}


// ============================================================
// AMBIL MENIT DALAM WIB
// ============================================================

function getMinute(date: Date) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(date)
  );
}


// ============================================================
// UBAH JAM KE MENIT
// ============================================================

function timeToMinutes(date: Date) {
  return (
    getHour(date) * 60 +
    getMinute(date)
  );
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

function formatDurasi(durasi: number) {
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
    | "history"
    | "calendar"
    | "clock"
    | "users"
    | "money"
    | "arrow"
    | "check"
    | "location"
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

  if (type === "history") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
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

  if (type === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
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

  if (type === "money") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10" />
        <path d="M15 9.5c-.5-1-1.5-1.5-3-1.5-1.7 0-3 .8-3 2s1.2 1.8 3 2c1.8.2 3 .8 3 2s-1.3 2-3 2c-1.5 0-2.5-.5-3-1.5" />
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

  if (type === "check") {
    return (
      <svg {...common}>
        <path d="M5 12l4 4L19 6" />
      </svg>
    );
  }

  if (type === "location") {
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
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

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{
    lapangan?: string;
    tanggal?: string;
    error?: string;
  }>;
}) {

  // ==========================================================
  // PARAMETER
  // ==========================================================

  const params = await searchParams;

  const lapanganId = params.lapangan;

  const tanggalParam = params.tanggal;

  const errorMessage = params.error;


  // ==========================================================
  // SESSION
  // ==========================================================

  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/");
  }


  // ==========================================================
  // CEK LAPANGAN
  // ==========================================================

  if (!lapanganId) {
    redirect("/dashboard/lapangan");
  }


  const lapangan =
    await prisma.lapangan.findUnique({
      where: {
        id: lapanganId,
      },
    });


  if (!lapangan || !lapangan.isActive) {
    redirect("/dashboard/lapangan");
  }


  // ==========================================================
  // TANGGAL YANG DIPILIH
  // ==========================================================

  const selectedDate =
    tanggalParam ||
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Jakarta",
      }
    ).format(new Date());


  // ==========================================================
  // VALIDASI FORMAT TANGGAL
  // ==========================================================

  const selectedDateObject =
    new Date(
      `${selectedDate}T00:00:00+07:00`
    );


  // ==========================================================
  // AWAL DAN AKHIR HARI
  // ==========================================================

  const dayStart =
    new Date(
      `${selectedDate}T00:00:00+07:00`
    );

  const dayEnd =
    new Date(
      `${selectedDate}T23:59:59+07:00`
    );


  // ==========================================================
  // AMBIL BOOKING PADA TANGGAL TERSEBUT
  //
  // PENDING + CONFIRMED = SLOT TERISI
  // CANCELLED = TIDAK DITAMPILKAN
  // ==========================================================

  const bookings =
    await prisma.booking.findMany({

      where: {

        lapanganId:
          lapangan.id,

        status: {
          in: [
            "PENDING",
            "CONFIRMED",
          ],
        },

        startTime: {
          lt: dayEnd,
        },

        endTime: {
          gt: dayStart,
        },

      },

      orderBy: {
        startTime: "asc",
      },

      include: {
        customer: true,

        payments: {
          orderBy: {
            createdAt: "desc",
          },

          take: 1,
        },
      },
    });


  // ==========================================================
  // TANGGAL SEBELUMNYA
  // ==========================================================

  const previousDate =
    new Date(
      `${selectedDate}T00:00:00+07:00`
    );

  previousDate.setDate(
    previousDate.getDate() - 1
  );


  const previousDateString =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Jakarta",
      }
    ).format(previousDate);


  // ==========================================================
  // TANGGAL BERIKUTNYA
  // ==========================================================

  const nextDate =
    new Date(
      `${selectedDate}T00:00:00+07:00`
    );

  nextDate.setDate(
    nextDate.getDate() + 1
  );


  const nextDateString =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Jakarta",
      }
    ).format(nextDate);


  // ==========================================================
  // SERVER ACTION
  // ==========================================================

  async function createBooking(
    formData: FormData
  ) {
    "use server";


    // ========================================================
    // SESSION
    // ========================================================

    const currentHeaders =
      await headers();

    const currentSession =
      await auth.api.getSession({
        headers: currentHeaders,
      });


    if (!currentSession) {
      redirect("/");
    }


    // ========================================================
    // FORM DATA
    // ========================================================

    const lapanganId =
      formData
        .get("lapanganId")
        ?.toString();

    const tanggal =
      formData
        .get("tanggal")
        ?.toString();

    const jamMulai =
      formData
        .get("jamMulai")
        ?.toString();

    const jamSelesai =
      formData
        .get("jamSelesai")
        ?.toString();


    // ========================================================
    // VALIDASI
    // ========================================================

    if (
      !lapanganId ||
      !tanggal ||
      !jamMulai ||
      !jamSelesai
    ) {

      redirect(
        `/dashboard/booking?lapangan=${lapanganId}&tanggal=${tanggal}&error=${encodeURIComponent(
          "Semua data booking wajib diisi."
        )}`
      );

    }


    // ========================================================
    // CEK LAPANGAN
    // ========================================================

    const selectedLapangan =
      await prisma.lapangan.findUnique({

        where: {
          id: lapanganId,
        },

      });


    if (
      !selectedLapangan ||
      !selectedLapangan.isActive
    ) {

      redirect(
        "/dashboard/lapangan"
      );

    }


    // ========================================================
    // BATAS JAM OPERASIONAL
    // ========================================================

    const startHour =
      Number(
        jamMulai.split(":")[0]
      );

    const startMinute =
      Number(
        jamMulai.split(":")[1]
      );

    const endHour =
      Number(
        jamSelesai.split(":")[0]
      );

    const endMinute =
      Number(
        jamSelesai.split(":")[1]
      );


    if (
      startHour < START_HOUR ||
      endHour > END_HOUR ||
      (
        endHour === END_HOUR &&
        endMinute > 0
      )
    ) {

      redirect(
        `/dashboard/booking?lapangan=${lapanganId}&tanggal=${tanggal}&error=${encodeURIComponent(
          `Jam booking hanya tersedia pukul ${START_HOUR
            .toString()
            .padStart(2, "0")}:00 sampai ${END_HOUR
            .toString()
            .padStart(2, "0")}:00.`
        )}`
      );

    }


    // ========================================================
    // BUAT DATE WIB
    // ========================================================

    const startTime =
      new Date(
        `${tanggal}T${jamMulai}:00+07:00`
      );

    const endTime =
      new Date(
        `${tanggal}T${jamSelesai}:00+07:00`
      );


    // ========================================================
    // JAM HARUS VALID
    // ========================================================

    if (
      endTime.getTime() <=
      startTime.getTime()
    ) {

      redirect(
        `/dashboard/booking?lapangan=${lapanganId}&tanggal=${tanggal}&error=${encodeURIComponent(
          "Jam selesai harus lebih besar dari jam mulai."
        )}`
      );

    }


    // ========================================================
    // DURASI
    // ========================================================

    const durasi =
      (
        endTime.getTime() -
        startTime.getTime()
      ) /
      (1000 * 60 * 60);


    if (durasi < 1) {

      redirect(
        `/dashboard/booking?lapangan=${lapanganId}&tanggal=${tanggal}&error=${encodeURIComponent(
          "Minimal booking adalah 1 jam."
        )}`
      );

    }


    // ========================================================
    // TANGGAL TIDAK BOLEH LEWAT
    // ========================================================

    if (
      startTime.getTime() <=
      Date.now()
    ) {

      redirect(
        `/dashboard/booking?lapangan=${lapanganId}&tanggal=${tanggal}&error=${encodeURIComponent(
          "Waktu booking tersebut sudah lewat."
        )}`
      );

    }


    // ========================================================
    // CEK BENTROK
    // ========================================================

    const overlapping =
      await prisma.booking.findFirst({

        where: {

          lapanganId,

          status: {
            in: [
              "PENDING",
              "CONFIRMED",
            ],
          },

          startTime: {
            lt: endTime,
          },

          endTime: {
            gt: startTime,
          },

        },

      });


    if (overlapping) {

      redirect(
        `/dashboard/booking?lapangan=${lapanganId}&tanggal=${tanggal}&error=${encodeURIComponent(
          "Waktu tersebut sudah dibooking. Silakan pilih waktu yang kosong."
        )}`
      );

    }


    // ========================================================
    // CARI CUSTOMER
    // ========================================================

    const userId =
      currentSession.user.id;

    const userEmail =
      currentSession.user.email;

    const userName =
      currentSession.user.name ||
      "Pelanggan";


    let customer =
      await prisma.customer.findUnique({

        where: {
          userId,
        },

      });


    // ========================================================
    // CUSTOMER SUDAH ADA
    // ========================================================

    if (customer) {

      customer =
        await prisma.customer.update({

          where: {
            id: customer.id,
          },

          data: {
            name: userName,
            email: userEmail,
          },

        });

    }

    // ========================================================
    // CUSTOMER BELUM ADA
    // ========================================================

    else {

      const customerByEmail =
        await prisma.customer.findUnique({

          where: {
            email: userEmail,
          },

        });


      if (customerByEmail) {

        customer =
          await prisma.customer.update({

            where: {
              id: customerByEmail.id,
            },

            data: {
              userId,
              name: userName,
            },

          });

      }

      else {

        const usernameBase =
          userEmail
            .split("@")[0]
            .replace(
              /[^a-zA-Z0-9_]/g,
              ""
            )
            .slice(0, 20) ||
          "customer";


        let username =
          usernameBase;

        let counter = 1;


        while (
          await prisma.customer.findUnique({
            where: {
              username,
            },
          })
        ) {

          username =
            `${usernameBase}_${counter}`;

          counter++;

        }


        customer =
          await prisma.customer.create({

            data: {

              userId,

              email:
                userEmail,

              name:
                userName,

              username,

              password:
                crypto.randomUUID(),

            },

          });

      }

    }


    // ========================================================
    // BUAT BOOKING
    // ========================================================

    await prisma.booking.create({

      data: {

        customerId:
          customer.id,

        lapanganId:
          selectedLapangan.id,

        startTime,

        endTime,

        status:
          "PENDING",

      },

    });


    // ========================================================
    // KE RIWAYAT
    // ========================================================

    redirect(
      "/dashboard/riwayat?booking=success"
    );
  }


  // ==========================================================
  // JUMLAH BOOKING
  // ==========================================================

  const totalBooking =
    bookings.length;


  // ==========================================================
  // HTML
  // ==========================================================

  return (

    <main className="min-h-screen bg-[#f5f7fa] text-[#0d1b35]">

      <div className="flex min-h-screen">


        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="hidden w-[260px] flex-col bg-[#020817] text-white lg:flex">

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
                Booking Lapangan
              </p>

            </div>

          </div>


          <nav className="flex-1 px-4 py-6">

            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Menu Utama
            </p>


            <Link
              href="/dashboard"
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >

              <Icon type="dashboard" />

              Dashboard

            </Link>


            <Link
              href="/dashboard/lapangan"
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >

              <Icon type="field" />

              Lapangan

            </Link>


            <Link
              href="/dashboard/booking"
              className="mb-1 flex items-center gap-3 rounded-xl bg-slate-800 px-3 py-3 font-semibold text-white"
            >

              <Icon type="booking" />

              Pesan Lapangan

            </Link>


            <Link
              href="/dashboard/riwayat"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >

              <Icon type="history" />

              Riwayat Pemesanan

            </Link>

          </nav>


          <div className="border-t border-white/10 p-4">

            <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">

              {session.user.image ? (

                <img
                  src={session.user.image}
                  alt={
                    session.user.name ||
                    "User"
                  }
                  className="h-10 w-10 rounded-full object-cover"
                />

              ) : (

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 font-bold">

                  {(
                    session.user.name ||
                    session.user.email ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}

                </div>

              )}


              <div className="min-w-0">

                <p className="truncate text-sm font-semibold">
                  {session.user.name ||
                    "Pelanggan"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {session.user.email}
                </p>

              </div>

            </div>

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
                  Pemesanan
                </p>

                <h2 className="text-xl font-bold">
                  Jadwal Booking
                </h2>

              </div>


              <Link
                href="/dashboard/riwayat"
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Riwayat Booking
              </Link>

            </div>

          </header>


          {/* CONTENT */}

          <div className="p-5 md:p-8">


            {/* BACK */}

            <Link
              href="/dashboard/lapangan"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
            >

              <Icon type="back" />

              Kembali ke daftar lapangan

            </Link>


            {/* ERROR */}

            {errorMessage && (

              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                    !
                  </div>

                  <div>

                    <h3 className="font-bold text-red-800">
                      Booking Tidak Berhasil
                    </h3>

                    <p className="mt-1 text-sm text-red-700">
                      {errorMessage}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                LAPANGAN HEADER
            ================================================= */}

            <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-col md:flex-row">


                {/* IMAGE */}

                <div className="h-52 w-full bg-slate-100 md:h-auto md:w-[280px]">

                  {lapangan.picture_url ? (

                    <img
                      src={lapangan.picture_url}
                      alt={lapangan.name}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-full min-h-[210px] items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-6xl">
                      ⚽
                    </div>

                  )}

                </div>


                {/* INFO */}

                <div className="flex-1 p-6 md:p-7">

                  <div className="mb-3 flex flex-wrap gap-2">

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {lapangan.category}
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      ● Aktif
                    </span>

                  </div>


                  <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {lapangan.name}
                  </h1>


                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                    <Icon type="location" />

                    {lapangan.location}

                  </div>


                  <div className="mt-5 flex flex-wrap items-center gap-8">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Harga
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">

                        {formatRupiah(
                          lapangan.price
                        )}

                        <span className="ml-1 text-xs font-medium text-slate-400">
                          / jam
                        </span>

                      </p>

                    </div>


                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Booking Hari Ini
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">

                        {totalBooking}

                        <span className="ml-1 text-sm font-medium text-slate-400">
                          jadwal
                        </span>

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                DATE NAVIGATOR
            ================================================= */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


                <Link
                  href={`/dashboard/booking?lapangan=${lapangan.id}&tanggal=${previousDateString}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >

                  ← Hari Sebelumnya

                </Link>


                <div className="text-center">

                  <div className="flex items-center justify-center gap-2 text-blue-600">

                    <Icon type="calendar" />

                    <span className="text-xs font-bold uppercase tracking-wider">
                      Jadwal Lapangan
                    </span>

                  </div>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">

                    {formatTanggal(
                      selectedDateObject
                    )}

                  </h2>

                </div>


                <Link
                  href={`/dashboard/booking?lapangan=${lapangan.id}&tanggal=${nextDateString}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >

                  Besok →

                </Link>

              </div>

            </div>


            {/* =================================================
                LEGEND
            ================================================= */}

            <div className="mb-5 flex flex-wrap items-center gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

              <span className="text-sm font-bold text-slate-700">
                Keterangan:
              </span>


              <div className="flex items-center gap-2 text-sm text-slate-500">

                <span className="h-3 w-3 rounded-full bg-green-500" />

                Tersedia

              </div>


              <div className="flex items-center gap-2 text-sm text-slate-500">

                <span className="h-3 w-3 rounded-full bg-yellow-500" />

                Menunggu

              </div>


              <div className="flex items-center gap-2 text-sm text-slate-500">

                <span className="h-3 w-3 rounded-full bg-blue-600" />

                Dikonfirmasi

              </div>

            </div>


            {/* =================================================
                TIME TABLE
            ================================================= */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-5 py-5">

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Time Table Booking
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Lihat waktu yang sudah dibooking
                      sebelum memilih jadwal.
                    </p>

                  </div>


                  <div className="rounded-xl bg-slate-50 px-4 py-2 text-sm">

                    <span className="text-slate-400">
                      Jam operasional
                    </span>

                    <span className="ml-2 font-bold text-slate-800">
                      08:00 - 22:00
                    </span>

                  </div>

                </div>

              </div>


              {/* =================================================
                  GRAFIK
              ================================================= */}

              <div className="overflow-x-auto">

                <div
                  className="relative min-w-[760px]"
                  style={{
                    height:
                      (END_HOUR -
                        START_HOUR) *
                        SLOT_HEIGHT +
                      30,
                  }}
                >


                  {/* ===========================================
                      GARIS JAM
                  =========================================== */}

                  {Array.from(
                    {
                      length:
                        END_HOUR -
                        START_HOUR +
                        1,
                    },
                    (_, index) => {

                      const hour =
                        START_HOUR +
                        index;

                      const top =
                        index *
                        SLOT_HEIGHT;


                      return (

                        <div
                          key={hour}
                          className="absolute left-0 right-0 border-t border-slate-100"
                          style={{
                            top,
                          }}
                        >

                          <div className="absolute left-0 top-[-10px] w-[80px] px-4 text-right text-xs font-bold text-slate-400">

                            {hour
                              .toString()
                              .padStart(
                                2,
                                "0"
                              )}
                            :00

                          </div>

                        </div>

                      );

                    }
                  )}


                  {/* ===========================================
                      AREA GRAFIK
                  =========================================== */}

                  <div className="absolute left-[80px] right-5 top-0 bottom-0 rounded-2xl border border-slate-200 bg-slate-50">


                    {/* =========================================
                        SLOT TERSEDIA
                    ========================================= */}

                    {Array.from(
                      {
                        length:
                          END_HOUR -
                          START_HOUR,
                      },
                      (_, index) => {

                        const hour =
                          START_HOUR +
                          index;

                        const top =
                          index *
                          SLOT_HEIGHT;


                        return (

                          <div
                            key={`available-${hour}`}
                            className="absolute left-0 right-0 border-b border-dashed border-slate-200"
                            style={{
                              top,
                              height:
                                SLOT_HEIGHT,
                            }}
                          >

                            <div className="flex h-full items-center justify-end pr-5">

                              <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-600 opacity-0 transition group-hover:opacity-100">
                                Tersedia
                              </span>

                            </div>

                          </div>

                        );

                      }
                    )}


                    {/* =========================================
                        BOOKING BLOCK
                    ========================================= */}

                    {bookings.map(
                      (booking) => {

                        const startMinutes =
                          timeToMinutes(
                            booking.startTime
                          );

                        const endMinutes =
                          timeToMinutes(
                            booking.endTime
                          );


                        const openingMinutes =
                          START_HOUR *
                          60;


                        const topMinutes =
                          startMinutes -
                          openingMinutes;


                        const durationMinutes =
                          endMinutes -
                          startMinutes;


                        const top =
                          (
                            topMinutes /
                            60
                          ) *
                          SLOT_HEIGHT;


                        const height =
                          (
                            durationMinutes /
                            60
                          ) *
                          SLOT_HEIGHT;


                        const durasi =
                          hitungDurasi(
                            booking.startTime,
                            booking.endTime
                          );


                        const totalHarga =
                          durasi *
                          lapangan.price;


                        const confirmed =
                          booking.status ===
                          "CONFIRMED";


                        return (

                          <div
                            key={booking.id}
                            className={`absolute left-2 right-2 overflow-hidden rounded-2xl border p-3 shadow-sm transition hover:shadow-lg ${
                              confirmed
                                ? "border-blue-200 bg-blue-600 text-white"
                                : "border-yellow-200 bg-yellow-400 text-yellow-950"
                            }`}
                            style={{
                              top,
                              height:
                                Math.max(
                                  height -
                                    4,
                                  58
                                ),
                            }}
                          >

                            <div className="flex h-full flex-col justify-between">


                              {/* BOOKING INFO */}

                              <div>

                                <div className="flex items-start justify-between gap-3">

                                  <div className="min-w-0">

                                    <p className="truncate text-sm font-bold">

                                      {booking
                                        .customer
                                        .name ||
                                        booking
                                          .customer
                                          .username ||
                                        "Pelanggan"}

                                    </p>

                                    <p
                                      className={`mt-0.5 text-xs ${
                                        confirmed
                                          ? "text-blue-100"
                                          : "text-yellow-900/70"
                                      }`}
                                    >

                                      {formatJam(
                                        booking.startTime
                                      )}

                                      {" - "}

                                      {formatJam(
                                        booking.endTime
                                      )}

                                    </p>

                                  </div>


                                  <span
                                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                                      confirmed
                                        ? "bg-white/20 text-white"
                                        : "bg-white/50 text-yellow-900"
                                    }`}
                                  >

                                    {confirmed
                                      ? "DIKONFIRMASI"
                                      : "MENUNGGU"}

                                  </span>

                                </div>


                                {/* DETAIL */}

                                {height >=
                                  100 && (

                                  <div
                                    className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] ${
                                      confirmed
                                        ? "text-blue-100"
                                        : "text-yellow-900/70"
                                    }`}
                                  >

                                    <span>
                                      {formatDurasi(
                                        durasi
                                      )}
                                    </span>

                                    <span>
                                      {formatRupiah(
                                        totalHarga
                                      )}
                                    </span>

                                  </div>

                                )}

                              </div>


                              {/* STATUS */}

                              {height >=
                                130 && (

                                <div
                                  className={`flex items-center gap-1 text-[10px] font-medium ${
                                    confirmed
                                      ? "text-blue-100"
                                      : "text-yellow-900/70"
                                  }`}
                                >

                                  <Icon type="check" />

                                  Jadwal terisi

                                </div>

                              )}

                            </div>

                          </div>

                        );

                      }
                    )}


                    {/* =========================================
                        GARIS WAKTU SEKARANG
                    ========================================= */}

                    {selectedDate ===
                      new Intl.DateTimeFormat(
                        "en-CA",
                        {
                          timeZone:
                            "Asia/Jakarta",
                        }
                      ).format(
                        new Date()
                      ) && (

                      <div
                        className="pointer-events-none absolute left-0 right-0 z-30"
                        style={{
                          top:
                            (
                              (
                                new Date()
                                  .getHours() +
                                7 -
                                START_HOUR
                              ) *
                                60 +
                              new Date().getMinutes()
                            ) /
                              60 *
                              SLOT_HEIGHT,
                        }}
                      >

                        <div className="flex items-center">

                          <div className="h-2 w-2 rounded-full bg-red-500" />

                          <div className="h-[2px] flex-1 bg-red-500" />

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                FORM BOOKING
            ================================================= */}

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    <Icon type="booking" />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Buat Booking Baru
                    </h2>

                    <p className="text-sm text-slate-500">
                      Pilih tanggal dan waktu yang masih
                      tersedia.
                    </p>

                  </div>

                </div>

              </div>


              <form
                action={createBooking}
                className="grid gap-5 md:grid-cols-4"
              >

                <input
                  type="hidden"
                  name="lapanganId"
                  value={lapangan.id}
                />


                {/* TANGGAL */}

                <div>

                  <label
                    htmlFor="tanggal"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Tanggal
                  </label>

                  <input
                    id="tanggal"
                    name="tanggal"
                    type="date"
                    min={
                      new Intl.DateTimeFormat(
                        "en-CA",
                        {
                          timeZone:
                            "Asia/Jakarta",
                        }
                      ).format(
                        new Date()
                      )
                    }
                    defaultValue={
                      selectedDate
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                </div>


                {/* JAM MULAI */}
<div>
  <label
    htmlFor="jamMulai"
    className="mb-2 block text-sm font-bold text-slate-700"
  >
    Jam Mulai
  </label>

  <input
    id="jamMulai"
    name="jamMulai"
    type="time"
    min="08:00"
    max="21:59"
    required
    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
  />
</div>
                

                {/* JAM SELESAI */}
<div>
  <label
    htmlFor="jamSelesai"
    className="mb-2 block text-sm font-bold text-slate-700"
  >
    Jam Selesai
  </label>

  <input
    id="jamSelesai"
    name="jamSelesai"
    type="time"
    min="08:01"
    max="22:00"
    required
    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
  />
</div>


                {/* BUTTON */}

                <div className="flex items-end">

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#020817] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.99]"
                  >

                    <Icon type="check" />

                    Booking Sekarang

                  </button>

                </div>

              </form>


              {/* HARGA */}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="text-slate-500">
                    <Icon type="money" />
                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Harga lapangan
                    </p>

                    <p className="font-bold text-slate-800">
                      {formatRupiah(
                        lapangan.price
                      )}
                      / jam
                    </p>

                  </div>

                </div>


                <p className="text-xs text-slate-400">
                  Total = durasi × harga per jam
                </p>

              </div>

            </div>


            {/* =================================================
                MOBILE BOOKING LIST
            ================================================= */}

            {bookings.length >
              0 && (

              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:hidden">

                <h3 className="font-bold text-slate-900">
                  Detail Booking Hari Ini
                </h3>

                <div className="mt-4 space-y-3">

                  {bookings.map(
                    (booking) => {

                      const durasi =
                        hitungDurasi(
                          booking.startTime,
                          booking.endTime
                        );


                      return (

                        <div
                          key={booking.id}
                          className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                        >

                          <div className="flex items-center justify-between">

                            <div>

                              <p className="font-bold text-slate-800">

                                {booking
                                  .customer
                                  .name ||
                                  booking
                                    .customer
                                    .username ||
                                  "Pelanggan"}

                              </p>

                              <p className="mt-1 text-xs text-slate-500">

                                {formatJam(
                                  booking.startTime
                                )}

                                {" - "}

                                {formatJam(
                                  booking.endTime
                                )}

                              </p>

                            </div>


                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                                booking.status ===
                                "CONFIRMED"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >

                              {booking.status ===
                              "CONFIRMED"
                                ? "Dikonfirmasi"
                                : "Menunggu"}

                            </span>

                          </div>


                          <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-xs">

                            <span className="text-slate-400">
                              Durasi
                            </span>

                            <span className="font-bold text-slate-700">
                              {formatDurasi(
                                durasi
                              )}
                            </span>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            )}


            {/* =================================================
                INFO
            ================================================= */}

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  i
                </div>

                <div>

                  <h3 className="font-bold text-blue-900">
                    Cara membaca jadwal
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-blue-700">

                    Blok berwarna pada grafik menunjukkan
                    waktu yang sudah digunakan.{" "}
                    <b>Biru</b> berarti booking sudah
                    dikonfirmasi, sedangkan{" "}
                    <b>kuning</b> berarti masih menunggu
                    konfirmasi. Waktu yang tidak memiliki
                    blok berarti masih tersedia.

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