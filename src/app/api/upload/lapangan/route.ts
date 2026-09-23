
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "File gambar tidak ditemukan.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Format gambar harus JPG, JPEG, PNG, atau WEBP.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          error:
            "Ukuran gambar maksimal 5 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const uploadDir =
      path.join(
        process.cwd(),
        "public",
        "uploads",
        "lapangan"
      );

    await mkdir(
      uploadDir,
      {
        recursive: true,
      }
    );

    const originalName =
      file.name;

    const originalExtension =
      originalName
        .split(".")
        .pop()
        ?.toLowerCase();

    const extension =
      originalExtension &&
      ["jpg", "jpeg", "png", "webp"].includes(
        originalExtension
      )
        ? originalExtension
        : "jpg";

    const fileName =
      `lapangan-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${extension}`;

    const filePath =
      path.join(
        uploadDir,
        fileName
      );

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    await writeFile(
      filePath,
      buffer
    );

    const imageUrl =
      `/uploads/lapangan/${fileName}`;

    return NextResponse.json(
      {
        success: true,
        imageUrl,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "UPLOAD LAPANGAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal mengupload gambar.",
      },
      {
        status: 500,
      }
    );
  }
}
