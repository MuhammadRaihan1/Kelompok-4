
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lapangan =
      await prisma.lapangan.findMany({
        orderBy: {
          name: "asc",
        },
      });

    return NextResponse.json(
      lapangan,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET LAPANGAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal mengambil data lapangan.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const price =
      Number(body.price);

    const picture_url =
      typeof body.picture_url === "string" &&
      body.picture_url.trim()
        ? body.picture_url.trim()
        : null;

    const isActive =
      body.isActive !== false;

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Nama lapangan wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error:
            "Kategori lapangan wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Harga lapangan tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    if (!location) {
      return NextResponse.json(
        {
          error:
            "Lokasi lapangan wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const lapangan =
      await prisma.lapangan.create({
        data: {
          name,
          category,
          price,
          location,
          description:
            description || null,
          picture_url,
          isActive,
        },
      });

    return NextResponse.json(
      lapangan,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST LAPANGAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal menyimpan lapangan.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const body =
      await request.json();

    const id =
      typeof body.id === "string"
        ? body.id
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error:
            "ID lapangan tidak ditemukan.",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.lapangan.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Lapangan tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.lapangan.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Lapangan berhasil dihapus.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE LAPANGAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal menghapus lapangan.",
      },
      {
        status: 500,
      }
    );
  }
}
