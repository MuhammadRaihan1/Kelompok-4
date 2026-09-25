"use client";

import { useState } from "react";
import { tambahLapangan } from "./actions";

/* =====================================================
   PROPS
===================================================== */

type Props = {
  onSuccess?: () => Promise<void> | void;
};

/* =====================================================
   KOMPONEN TAMBAH LAPANGAN
===================================================== */

export default function TambahLapangan({
  onSuccess,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [price, setPrice] =
    useState("");

  /* =====================================================
     SUBMIT FORM
  ===================================================== */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form =
      event.currentTarget;

    setLoading(true);

    try {
      /* -------------------------------------------------
         AMBIL DATA FORM
      ------------------------------------------------- */

      const formData =
        new FormData(form);

      /* -------------------------------------------------
         TAMBAH LAPANGAN KE DATABASE
      ------------------------------------------------- */

      await tambahLapangan(
        formData
      );

      /* -------------------------------------------------
         RESET FORM
      ------------------------------------------------- */

      form.reset();

      setPrice("");

      setOpen(false);

      /* -------------------------------------------------
         PESAN BERHASIL
      ------------------------------------------------- */

      alert(
        "Lapangan berhasil ditambahkan."
      );

      /* -------------------------------------------------
         REFRESH DATA DI PAGE.TSX
      ------------------------------------------------- */

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error(
        "Gagal menambahkan lapangan:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan lapangan."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     FORMAT / VALIDASI HARGA
  ===================================================== */

  function handlePriceChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    let value =
      event.target.value;

    /*
     * Hanya mengizinkan angka
     * dan titik.
     *
     * Contoh:
     * 100.000
     * 150.000
     * 1.500.000
     */

    value =
      value.replace(
        /[^\d.]/g,
        ""
      );

    setPrice(value);
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <>
      {/* =================================================
          TOMBOL TAMBAH LAPANGAN
      ================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>

        Tambah Lapangan
      </button>

      {/* =================================================
          MODAL
      ================================================== */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* =================================================
                HEADER MODAL
            ================================================== */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Tambah Lapangan
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Tambahkan lapangan
                  futsal baru ke sistem.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!loading) {
                    setOpen(false);
                  }
                }}
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />

                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* =================================================
                  NAMA LAPANGAN
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nama Lapangan
                </label>

                <input
                  name="name"
                  type="text"
                  placeholder="Contoh: Lapangan Futsal A"
                  required
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                />
              </div>

              {/* =================================================
                  JENIS OLAHRAGA
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Jenis Olahraga
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">

                  <span className="text-xl">
                    ⚽
                  </span>

                  <span className="text-sm font-medium text-slate-700">
                    Futsal
                  </span>

                </div>

                {/* Dikirim ke Server Action */}

                <input
                  type="hidden"
                  name="category"
                  value="Futsal"
                />
              </div>

              {/* =================================================
                  HARGA
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Harga per Jam
                </label>

                <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">

                  <div className="flex items-center bg-slate-50 px-4 text-sm font-medium text-slate-500">
                    Rp
                  </div>

                  <input
                    name="price"
                    type="text"
                    inputMode="numeric"
                    value={price}
                    onChange={
                      handlePriceChange
                    }
                    placeholder="Contoh: 100.000"
                    required
                    disabled={loading}
                    className="h-11 flex-1 bg-white px-4 text-sm text-slate-800 outline-none disabled:bg-slate-50"
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Masukkan harga sesuai
                  tarif lapangan. Contoh:
                  100.000 = Rp100.000.
                </p>
              </div>

              {/* =================================================
                  LOKASI
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Lokasi
                </label>

                <input
                  name="location"
                  type="text"
                  placeholder="Contoh: Padang"
                  defaultValue="Padang"
                  required
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                />
              </div>

              {/* =================================================
                  DESKRIPSI
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Deskripsi
                </label>

                <textarea
                  name="description"
                  rows={4}
                  placeholder="Contoh: Lapangan futsal sintetis dengan fasilitas lengkap."
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                />
              </div>

              {/* =================================================
                  BUTTON
              ================================================== */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                {/* =================================================
                    BATAL
                ================================================== */}

                <button
                  type="button"
                  onClick={() => {
                    if (!loading) {
                      setOpen(false);
                    }
                  }}
                  disabled={loading}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Batal
                </button>

                {/* =================================================
                    SIMPAN
                ================================================== */}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">

                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Menyimpan...

                    </span>
                  ) : (
                    "Simpan Lapangan"
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 