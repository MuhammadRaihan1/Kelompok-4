"use client";

import { useState } from "react";
import { editLapangan } from "./actions";

type Props = {
  id: string;
  name: string;
  category: string;
  price: number | string;
  location: string;
  description: string | null;
  picture_url: string | null;

  // Dipanggil setelah edit berhasil
  onSuccess?: () => Promise<void> | void;
};

export default function EditLapangan({
  id,
  name,
  category,
  price,
  location,
  description,
  picture_url,
  onSuccess,
}: Props) {
  /* =====================================================
     STATE
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  /* =====================================================
     FORM STATE
  ===================================================== */

  const [formName, setFormName] =
    useState(name);

  const [formCategory, setFormCategory] =
    useState(category);

  const [formPrice, setFormPrice] =
    useState(String(price));

  const [formLocation, setFormLocation] =
    useState(location);

  const [formDescription, setFormDescription] =
    useState(description || "");

  const [formPictureUrl, setFormPictureUrl] =
    useState(picture_url || "");

  /* =====================================================
     BUKA MODAL
  ===================================================== */

  function openModal() {
    setFormName(name);

    setFormCategory(category);

    setFormPrice(
      String(price)
    );

    setFormLocation(location);

    setFormDescription(
      description || ""
    );

    setFormPictureUrl(
      picture_url || ""
    );

    setShowModal(true);
  }

  /* =====================================================
     TUTUP MODAL
  ===================================================== */

  function closeModal() {
    if (loading) {
      return;
    }

    setShowModal(false);
  }

  /* =====================================================
     SIMPAN EDIT
  ===================================================== */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    /* ---------------------------------------------------
       VALIDASI NAMA
    --------------------------------------------------- */

    if (!formName.trim()) {
      alert(
        "Nama lapangan wajib diisi."
      );

      return;
    }

    /* ---------------------------------------------------
       VALIDASI HARGA
    --------------------------------------------------- */

    if (
      !formPrice ||
      Number(formPrice) <= 0
    ) {
      alert(
        "Harga lapangan wajib diisi."
      );

      return;
    }

    /* ---------------------------------------------------
       VALIDASI LOKASI
    --------------------------------------------------- */

    if (!formLocation.trim()) {
      alert(
        "Lokasi lapangan wajib diisi."
      );

      return;
    }

    try {
      setLoading(true);

      /* =================================================
         FORM DATA
      ================================================= */

      const formData =
        new FormData();

      formData.append(
        "id",
        id
      );

      formData.append(
        "name",
        formName.trim()
      );

      formData.append(
        "category",
        formCategory
      );

      formData.append(
        "price",
        String(
          Number(formPrice)
        )
      );

      formData.append(
        "location",
        formLocation.trim()
      );

      formData.append(
        "description",
        formDescription.trim()
      );

      formData.append(
        "picture_url",
        formPictureUrl
      );

      /* =================================================
         PANGGIL SERVER ACTION
      ================================================= */

      await editLapangan(
        formData
      );

      /* =================================================
         BERHASIL
      ================================================= */

      alert(
        "Lapangan berhasil diperbarui."
      );

      setShowModal(false);

      /* =================================================
         REFRESH DATA DI PAGE.TSX
      ================================================= */

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error(
        "EDIT LAPANGAN ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengedit lapangan."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <>
      {/* =================================================
          TOMBOL EDIT
      ================================================= */}

      <button
        type="button"
        onClick={openModal}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* ICON EDIT */}

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 20h9" />

          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>

        Edit
      </button>

      {/* =================================================
          MODAL EDIT
      ================================================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Lapangan
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Perbarui informasi
                  lapangan.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
            >

              {/* =================================================
                  NAMA
              ================================================= */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Nama Lapangan
                </label>

                <input
                  type="text"
                  value={formName}
                  onChange={(event) =>
                    setFormName(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  required
                />
              </div>

              {/* =================================================
                  KATEGORI
              ================================================= */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Jenis Olahraga
                </label>

                <select
                  value={formCategory}
                  onChange={(event) =>
                    setFormCategory(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                >
                  <option value="Futsal">
                    ⚽ Futsal
                  </option>

                  <option value="Badminton">
                    🏸 Badminton
                  </option>

                  <option value="Basket">
                    🏀 Basket
                  </option>

                  <option value="Volleyball">
                    🏐 Volleyball
                  </option>
                </select>
              </div>

              {/* =================================================
                  HARGA
              ================================================= */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Harga per Jam
                </label>

                <div className="flex overflow-hidden rounded-xl border border-slate-200">

                  <div className="flex items-center bg-slate-50 px-4 text-sm font-medium text-slate-600">
                    Rp
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={formPrice}
                    onChange={(event) =>
                      setFormPrice(
                        event.target.value
                      )
                    }
                    disabled={loading}
                    className="h-11 flex-1 px-4 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              {/* =================================================
                  LOKASI
              ================================================= */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Lokasi
                </label>

                <input
                  type="text"
                  value={formLocation}
                  onChange={(event) =>
                    setFormLocation(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  required
                />
              </div>

              {/* =================================================
                  DESKRIPSI
              ================================================= */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Deskripsi
                </label>

                <textarea
                  value={formDescription}
                  onChange={(event) =>
                    setFormDescription(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>

              {/* =================================================
                  URL GAMBAR
              ================================================= */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  URL Gambar
                </label>

                <input
                  type="text"
                  value={formPictureUrl}
                  onChange={(event) =>
                    setFormPictureUrl(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  placeholder="/uploads/lapangan.jpg"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />

                {/* PREVIEW GAMBAR */}

                {formPictureUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={formPictureUrl}
                      alt={formName}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* =================================================
                  BUTTON
              ================================================= */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-xl bg-green-950 px-5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}