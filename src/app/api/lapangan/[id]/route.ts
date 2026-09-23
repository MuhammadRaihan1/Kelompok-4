import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const lapangan = await prisma.lapangan.findUnique({
      where: {
        id,
      },
    });

    if (!lapangan) {
      return NextResponse.json(
        {
          success: false,
          message: "Lapangan tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    let bookings: any[] = [];

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00`);
      const endOfDay = new Date(`${date}T23:59:59`);

      bookings = await prisma.booking.findMany({
        where: {
          lapanganId: id,

          startTime: {
            gte: startOfDay,
            lte: endOfDay,
          },

          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },

        orderBy: {
          startTime: "asc",
        },

        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      lapangan,
      bookings,
    });
  } catch (error) {
    console.error("GET LAPANGAN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data lapangan",
      },
      {
        status: 500,
      }
    );
  }
}