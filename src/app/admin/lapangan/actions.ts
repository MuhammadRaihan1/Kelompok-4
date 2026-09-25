"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/* =========================================================
   TAMBAH LAPANGAN
========================================================= */

export async function tambahLapangan(formData: FormData) {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    throw new Error("Anda harus login terlebih dahulu.");
  }

  const name = String(formData.get("name") || "").trim();
  const description = String(
    formData.get("description") || ""
  ).trim();
  const location = String(
    formData.get("location") || ""
  ).trim();
  const priceValue = String(
    formData.get("price") || ""
  ).trim();

  const category = "Futsal";

  if (!name) {
    throw new Error("Nama lapangan wajib diisi.");
  }

  if (!location) {
    throw new Error("Lokasi lapangan wajib diisi.");
  }

  if (!priceValue) {
    throw new Error("Harga lapangan wajib diisi.");
  }

  const normalizedPrice = priceValue
    .replace(/\./g, "")
    .replace(/,/g, "");

  const price = Number(normalizedPrice);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Harga lapangan tidak valid.");
  }

  try {
    await prisma.lapangan.create({
      data: {
        name,
        category,
        description: description || null,
        location,
        price,
        picture_url: null,
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

  revalidatePath("/admin/lapangan");
  revalidatePath("/dashboard/lapangan");

  return {
    success: true,
    message: "Lapangan berhasil ditambahkan.",
  };
}

/* =========================================================
   EDIT LAPANGAN
========================================================= */

export async function editLapangan(formData: FormData) {
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

  const id = String(
    formData.get("id") || ""
  ).trim();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const category = String(
    formData.get("category") || ""
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

  const pictureUrlValue =
    formData.get("picture_url");

  /* =======================================================
     VALIDASI
  ======================================================= */

  if (!id) {
    throw new Error(
      "ID lapangan tidak ditemukan."
    );
  }

  if (!name) {
    throw new Error(
      "Nama lapangan wajib diisi."
    );
  }

  if (!category) {
    throw new Error(
      "Jenis olahraga wajib dipilih."
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
     GAMBAR

     Jika tidak ada gambar baru,
     gunakan gambar lama.

     Jika ada gambar baru,
     gunakan gambar baru.
  ======================================================= */

  const picture_url =
    pictureUrlValue === null
      ? lapangan.picture_url
      : String(
          pictureUrlValue
        ).trim() || null;

  /* =======================================================
     UPDATE DATABASE
  ======================================================= */

  try {
    await prisma.lapangan.update({
      where: {
        id,
      },

      data: {
        name,
        category,
        description:
          description || null,
        location,
        price,
        picture_url,
      },
    });
  } catch (error) {
    console.error(
      "Error Prisma saat mengedit lapangan:",
      error
    );

    throw new Error(
      "Lapangan gagal diperbarui."
    );
  }

  /* =======================================================
     REFRESH
  ======================================================= */

  revalidatePath(
    "/admin/lapangan"
  );

  revalidatePath(
    "/dashboard/lapangan"
  );

  return {
    success: true,
    message:
      "Lapangan berhasil diperbarui.",
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

  revalidatePath(
    "/admin/lapangan"
  );

  revalidatePath(
    "/dashboard/lapangan"
  );

  return {
    success: true,
    message:
      "Lapangan berhasil dihapus.",
  };
}