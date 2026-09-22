"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/* =========================================================
   TAMBAH LAPANGAN
========================================================= */

export async function tambahLapangan(
  formData: FormData
) {
  /* =======================================================
     CEK SESSION
  ======================================================= */

  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    throw new Error(
      "Anda harus login terlebih dahulu."
    );
  }

  /* =======================================================
     AMBIL DATA
  ======================================================= */

  const name = String(
    formData.get("name") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const location = String(
    formData.get("location") || ""
  ).trim();

  const priceValue = String(
    formData.get("price") || ""
  ).trim();

  /* =======================================================
     KATEGORI OTOMATIS FUTSAL
  ======================================================= */

  const category = "Futsal";

  /* =======================================================
     VALIDASI
  ======================================================= */

  if (!name) {
    throw new Error(
      "Nama lapangan wajib diisi."
    );
  }

  if (!location) {
    throw new Error(
      "Lokasi lapangan wajib diisi."
    );
  }

  if (!priceValue) {
    throw new Error(
      "Harga lapangan wajib diisi."
    );
  }

  /* =======================================================
     NORMALISASI HARGA

     Contoh:
     100.000  -> 100000
     150.000  -> 150000
     75000    -> 75000
     1.500.000 -> 1500000
  ======================================================= */

  const normalizedPrice = priceValue
    .replace(/\./g, "")
    .replace(/,/g, "");

  const price = Number(normalizedPrice);

  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {
    throw new Error(
      "Harga lapangan tidak valid."
    );
  }

  /* =======================================================
     SIMPAN KE DATABASE
  ======================================================= */

  try {
    await prisma.lapangan.create({
      data: {
        name,
        category: "Futsal",
        description: description || null,
        location,
        price,
        picture_url: null,

        // Semua lapangan baru otomatis aktif
        isActive: true,
      },
    });
  } catch (error) {
    console.error(
      "Error Prisma saat menambahkan lapangan:",
      error
    );

    throw new Error(
      "Lapangan gagal disimpan ke database."
    );
  }

  /* =======================================================
     REFRESH DATA
  ======================================================= */

  revalidatePath("/admin/lapangan");
  revalidatePath("/dashboard/lapangan");

  return {
    success: true,
    message:
      "Lapangan berhasil ditambahkan.",
  };
}

/* =========================================================
   HAPUS LAPANGAN
========================================================= */

export async function hapusLapangan(
  id: string
) {
  /* =======================================================
     CEK SESSION
  ======================================================= */

  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    throw new Error(
      "Anda harus login terlebih dahulu."
    );
  }

  /* =======================================================
     VALIDASI ID
  ======================================================= */

  if (!id) {
    throw new Error(
      "ID lapangan tidak ditemukan."
    );
  }

  /* =======================================================
     CEK LAPANGAN
  ======================================================= */

  const lapangan =
    await prisma.lapangan.findUnique({
      where: {
        id,
      },
    });

  if (!lapangan) {
    throw new Error(
      "Lapangan tidak ditemukan."
    );
  }

  /* =======================================================
     CEK BOOKING

     Jika lapangan sudah memiliki booking,
     jangan langsung dihapus.
  ======================================================= */

  const jumlahBooking =
    await prisma.booking.count({
      where: {
        lapanganId: id,
      },
    });

  if (jumlahBooking > 0) {
    throw new Error(
      "Lapangan tidak dapat dihapus karena sudah memiliki data booking."
    );
  }

  /* =======================================================
     HAPUS DATABASE
  ======================================================= */

  try {
    await prisma.lapangan.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(
      "Error Prisma saat menghapus lapangan:",
      error
    );

    throw new Error(
      "Lapangan gagal dihapus."
    );
  }

  /* =======================================================
     REFRESH
  ======================================================= */

  revalidatePath("/admin/lapangan");
  revalidatePath("/dashboard/lapangan");

  return {
    success: true,
    message:
      "Lapangan berhasil dihapus.",
  };
}