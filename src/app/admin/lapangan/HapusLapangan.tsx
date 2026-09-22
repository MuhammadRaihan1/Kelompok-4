"use client";

import { useState } from "react";
import { hapusLapangan } from "./actions";

type Props = {
  id: string;
  name: string;
};

export default function HapusLapangan({
  id,
  name,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  async function handleDelete() {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus "${name}"?`
    );

    if (!yakin) {
      return;
    }

    setLoading(true);

    try {
      await hapusLapangan(id);

      alert(
        "Lapangan berhasil dihapus."
      );
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

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
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

      {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}