"use client";

import { useState } from "react";
import { hapusLapangan } from "./actions";

type Props = {
  id: string;
  name: string;

  // Dipanggil setelah hapus berhasil
  onSuccess?: () => Promise<void> | void;
};

export default function HapusLapangan({
  id,
  name,
  onSuccess,
}: Props) {
  /* =====================================================
     STATE
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  /* =====================================================
     HANDLE DELETE
  ===================================================== */

  async function handleDelete() {
    /* ---------------------------------------------------
       KONFIRMASI
    --------------------------------------------------- */

    const yakin =
      window.confirm(
        `Apakah kamu yakin ingin menghapus "${name}"?`
      );

    if (!yakin) {
      return;
    }

    try {
      setLoading(true);

      /* -------------------------------------------------
         HAPUS DARI DATABASE
      ------------------------------------------------- */

      await hapusLapangan(id);

      /* -------------------------------------------------
         PESAN BERHASIL
      ------------------------------------------------- */

      alert(
        "Lapangan berhasil dihapus."
      );

      /* -------------------------------------------------
         REFRESH DATA DI PAGE.TSX
      ------------------------------------------------- */

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error(
        "Gagal menghapus lapangan:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Lapangan gagal dihapus."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {/* =================================================
          ICON HAPUS
      ================================================= */}

      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3 6h18" />

        <path d="M8 6V4h8v2" />

        <path d="M19 6l-1 15H6L5 6" />

        <path d="M10 11v6" />

        <path d="M14 11v6" />
      </svg>

      {loading
        ? "Menghapus..."
        : "Hapus"}
    </button>
  );
}