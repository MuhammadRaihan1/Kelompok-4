import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // =====================================================
    // SESSION
    // =====================================================

    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // CEK ADMIN
    // =====================================================

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },

      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    // =====================================================
    // AMBIL BOOKING TERBARU
    // =====================================================

    const bookings = await prisma.booking.findMany({
      take: 20,

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
          },
        },
      },
    });

    // =====================================================
    // FORMAT NOTIFIKASI
    // =====================================================

    const notifications = bookings.map((booking) => ({
      id: booking.id,

      title: "Booking Baru",

      message: `${
        booking.customer.name ||
        booking.customer.username ||
        booking.customer.email
      } melakukan pemesanan`,

      customerName:
        booking.customer.name ||
        booking.customer.username ||
        "Customer",

      customerEmail: booking.customer.email,

      lapanganName: booking.lapangan.name,

      startTime: booking.startTime.toISOString(),

      endTime: booking.endTime.toISOString(),

      status: booking.status,

      createdAt: booking.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        notifications,
        total: notifications.length,
      },
      {
        status: 200,

        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "ADMIN NOTIFICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Gagal mengambil notifikasi",
      },
      {
        status: 500,
      }
    );
  }
}