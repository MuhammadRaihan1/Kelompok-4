import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/* =========================================================
   GET
   MENGAMBIL DATA LAPANGAN UNTUK HALAMAN BOOKING
========================================================= */

export async function GET(request: Request) {
  try {
    /* =====================================================
       SESSION
    ===================================================== */

    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Silakan login terlebih dahulu.",
        },
        {
          status: 401,
        }
      );
    }

    /* =====================================================
       AMBIL PARAMETER
    ===================================================== */

    const url = new URL(request.url);

    const lapanganId =
      url.searchParams.get("lapanganId");

    if (!lapanganId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID lapangan tidak ditemukan.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CARI LAPANGAN
    ===================================================== */

    const lapangan =
      await prisma.lapangan.findUnique({
        where: {
          id: lapanganId,
        },
      });

    if (!lapangan) {
      return NextResponse.json(
        {
          success: false,
          message: "Lapangan tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       CEK AKTIF
    ===================================================== */

    if (!lapangan.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Lapangan sedang tidak aktif.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      success: true,
      data: {
        id: lapangan.id,
        name: lapangan.name,
        category: lapangan.category,
        description: lapangan.description,
        location: lapangan.location,
        price: Number(lapangan.price),
        picture_url: lapangan.picture_url,
        isActive: lapangan.isActive,
      },
    });
  } catch (error: any) {
    console.error(
      "GET BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal mengambil data lapangan.",
        detail:
          process.env.NODE_ENV ===
          "development"
            ? error?.message
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST
   MEMBUAT BOOKING
========================================================= */

export async function POST(request: Request) {
  try {
    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      "MEMULAI PROSES BOOKING"
    );
    console.log(
      "========================================"
    );

    /* =====================================================
       SESSION
    ===================================================== */

    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Session login tidak ditemukan. Silakan login kembali.",
        },
        {
          status: 401,
        }
      );
    }

    console.log(
      "User ID:",
      session.user.id
    );

    console.log(
      "User Name:",
      session.user.name
    );

    console.log(
      "User Email:",
      session.user.email
    );

    /* =====================================================
       BODY
    ===================================================== */

    const body = await request.json();

    console.log(
      "BODY:",
      body
    );

    const {
      lapanganId,
      date,
      startTime,
      endTime,
    } = body;

    /* =====================================================
       VALIDASI LAPANGAN
    ===================================================== */

    if (!lapanganId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Lapangan belum dipilih.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDASI TANGGAL
    ===================================================== */

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tanggal bermain wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDASI JAM MULAI
    ===================================================== */

    if (!startTime) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Jam mulai wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDASI JAM SELESAI
    ===================================================== */

    if (!endTime) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Jam selesai wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDASI FORMAT TANGGAL
    ===================================================== */

    const startDate = new Date(
      `${date}T${startTime}:00`
    );

    const endDate = new Date(
      `${date}T${endTime}:00`
    );

    if (
      Number.isNaN(
        startDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tanggal atau jam mulai tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      Number.isNaN(
        endDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tanggal atau jam selesai tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       JAM SELESAI
    ===================================================== */

    if (endDate <= startDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Jam selesai harus lebih besar dari jam mulai.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CEK TANGGAL MASA LALU
    ===================================================== */

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const selectedDate =
      new Date(
        `${date}T00:00:00`
      );

    if (
      selectedDate < today
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tanggal booking tidak boleh sebelum hari ini.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CEK JAM HARI INI
    ===================================================== */

    const now = new Date();

    if (
      selectedDate.getTime() ===
      today.getTime()
    ) {
      if (
        startDate <= now
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Jam mulai sudah lewat. Silakan pilih jam lain.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /* =====================================================
       CARI LAPANGAN
    ===================================================== */

    const lapangan =
      await prisma.lapangan.findUnique({
        where: {
          id: lapanganId,
        },
      });

    if (!lapangan) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Lapangan tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       CEK LAPANGAN AKTIF
    ===================================================== */

    if (!lapangan.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Lapangan sedang tidak tersedia.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CEK BENTROK BOOKING
    ===================================================== */

    const existingBooking =
      await prisma.booking.findFirst({
        where: {
          lapanganId:
            lapanganId,

          status: {
            in: [
              "PENDING",
              "CONFIRMED",
            ],
          },

          startTime: {
            lt: endDate,
          },

          endTime: {
            gt: startDate,
          },
        },
      });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Jadwal tersebut sudah dibooking. Silakan pilih jadwal lain.",
        },
        {
          status: 409,
        }
      );
    }

    /* =====================================================
       CARI CUSTOMER
    ===================================================== */

    let customer =
      await prisma.customer.findUnique({
        where: {
          userId:
            session.user.id,
        },
      });

    console.log(
      "Customer ditemukan:",
      customer?.id ||
        "BELUM ADA"
    );

    /* =====================================================
       BUAT CUSTOMER OTOMATIS
    ===================================================== */

    if (!customer) {
      console.log(
        "Membuat customer baru..."
      );

      customer =
        await prisma.customer.create({
          data: {
            userId:
              session.user.id,

            email:
              session.user.email,

            name:
              session.user.name ||
              "Customer",

            username:
              session.user.email,

            password:
              null,
          },
        });

      console.log(
        "Customer berhasil dibuat:",
        customer.id
      );
    }

    /* =====================================================
       HITUNG DURASI
    ===================================================== */

    const duration =
      (
        endDate.getTime() -
        startDate.getTime()
      ) /
      (1000 * 60 * 60);

    if (duration <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Durasi booking tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       HARGA
    ===================================================== */

    const pricePerHour =
      Number(
        lapangan.price
      );

    /* =====================================================
       TOTAL
    ===================================================== */

    const total =
      pricePerHour *
      duration;

    console.log(
      "Durasi:",
      duration
    );

    console.log(
      "Harga:",
      pricePerHour
    );

    console.log(
      "Total:",
      total
    );

    /* =====================================================
       TRANSACTION
    ===================================================== */

    const result =
      await prisma.$transaction(
        async (tx) => {

          /* ===============================================
             BOOKING
          =============================================== */

          const booking =
            await tx.booking.create({
              data: {
                customerId:
                  customer.id,

                lapanganId:
                  lapangan.id,

                startTime:
                  startDate,

                endTime:
                  endDate,

                status:
                  "PENDING",
              },
            });

          console.log(
            "Booking dibuat:",
            booking.id
          );

          /* ===============================================
             PAYMENT
          =============================================== */

          const payment =
            await tx.payment.create({
              data: {
                bookingId:
                  booking.id,

                amount:
                  total,

                status:
                  "PENDING",

                paymentDate:
                  new Date(),

                statusMessage:
                  "Menunggu pembayaran",

                currency:
                  "IDR",
              },
            });

          console.log(
            "Payment dibuat:",
            payment.id
          );

          return {
            booking,
            payment,
          };
        }
      );

    /* =====================================================
       BERHASIL
    ===================================================== */

    console.log(
      "========================================"
    );

    console.log(
      "BOOKING BERHASIL"
    );

    console.log(
      "========================================"
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Booking berhasil dibuat.",

        bookingId:
          result.booking.id,

        paymentId:
          result.payment.id,

        customerId:
          customer.id,

        lapanganId:
          lapangan.id,

        lapangan:
          lapangan.name,

        date:
          date,

        startTime:
          startTime,

        endTime:
          endTime,

        duration:
          duration,

        pricePerHour:
          pricePerHour,

        total:
          total,

        status:
          result.booking.status,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {

    /* =====================================================
       ERROR
    ===================================================== */

    console.error(
      "========================================"
    );

    console.error(
      "BOOKING ERROR"
    );

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "CODE:",
      error?.code
    );

    console.error(
      "META:",
      error?.meta
    );

    console.error(
      "FULL ERROR:",
      error
    );

    console.error(
      "========================================"
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Terjadi kesalahan pada server saat membuat booking.",

        detail:
          process.env.NODE_ENV ===
          "development"
            ? error?.message
            : undefined,

        code:
          process.env.NODE_ENV ===
          "development"
            ? error?.code
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}