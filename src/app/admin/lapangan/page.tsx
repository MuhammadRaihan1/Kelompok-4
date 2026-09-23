"use client";

import { useCallback, useEffect, useState } from "react";

/* =========================================================
   TYPE
========================================================= */

type Lapangan = {
  id: string;
  name: string;
  category: string;
  price: number | string;
  location: string;
  description: string | null;
  picture_url: string | null;
  isActive: boolean;
};

/* =========================================================
   ICONS
========================================================= */

function DashboardIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function FieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 5h16v14H4z" />
      <path d="M4 9h16M8 5v14M16 5v14" />
    </svg>
  );
}

function BookingIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h3" />
      <path d="M8 17h6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19V5" />
      <path d="M4 19h17" />
      <path d="m7 15 4-4 3 2 5-6" />
      <path d="M16 7h3v3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function PlusIcon() {
  return (
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
  );
}

function LocationIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

/* =========================================================
   FORMAT RUPIAH
========================================================= */

function formatRupiah(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

/* =========================================================
   ADMIN LAPANGAN
========================================================= */

export default function AdminLapanganPage() {
  const [lapangan, setLapangan] = useState<Lapangan[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");

  const [category, setCategory] = useState("Futsal");

  const [price, setPrice] = useState("");

  const [location, setLocation] = useState("Padang");

  const [description, setDescription] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");

  /* =========================================================
     LOAD DATA LAPANGAN
  ========================================================= */

  const loadLapangan = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/lapangan", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal mengambil data lapangan"
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("Data lapangan tidak valid");
      }

      setLapangan(data);
    } catch (error) {
      console.error("LOAD LAPANGAN ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data lapangan."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLapangan();
  }, [loadLapangan]);

  /* =========================================================
     RESET FORM
  ========================================================= */

  function resetForm() {
    setName("");
    setCategory("Futsal");
    setPrice("");
    setLocation("Padang");
    setDescription("");
    setImage(null);
    setImagePreview("");
  }

  /* =========================================================
     MODAL
  ========================================================= */

  function openModal() {
    resetForm();
    setShowModal(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setShowModal(false);
    resetForm();
  }

  /* =========================================================
     HANDLE IMAGE
  ========================================================= */

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Format gambar harus JPG, JPEG, PNG, atau WEBP."
      );

      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5 MB.");

      event.target.value = "";

      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  /* =========================================================
     UPLOAD IMAGE
  ========================================================= */

  async function uploadImage() {
    if (!image) {
      return null;
    }

    const formData = new FormData();

    formData.append("file", image);

    const response = await fetch(
      "/api/upload/lapangan",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Gagal upload gambar."
      );
    }

    return data.imageUrl as string;
  }

  /* =========================================================
     SUBMIT TAMBAH LAPANGAN
  ========================================================= */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Nama lapangan wajib diisi.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Harga lapangan wajib diisi.");
      return;
    }

    if (!location.trim()) {
      alert("Lokasi wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      let pictureUrl: string | null = null;

      /* UPLOAD GAMBAR */

      if (image) {
        pictureUrl = await uploadImage();
      }

      /* SIMPAN KE DATABASE */

      const response = await fetch(
        "/api/lapangan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            category,
            price: Number(price),
            location: location.trim(),
            description:
              description.trim() || null,
            picture_url: pictureUrl,
            isActive: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Gagal menyimpan lapangan."
        );
      }

      alert(
        "Lapangan berhasil ditambahkan!"
      );

      setShowModal(false);

      resetForm();

      await loadLapangan();
    } catch (error) {
      console.error(
        "SAVE LAPANGAN ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     DELETE LAPANGAN
  ========================================================= */

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus lapangan ini?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        "/api/lapangan",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Gagal menghapus lapangan."
        );
      }

      await loadLapangan();

      alert(
        "Lapangan berhasil dihapus."
      );
    } catch (error) {
      console.error(
        "DELETE LAPANGAN ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus lapangan."
      );
    }
  }

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredLapangan = lapangan.filter(
    (item) => {
      const keyword = search
        .toLowerCase()
        .trim();

      return (
        item.name
          .toLowerCase()
          .includes(keyword) ||
        item.category
          .toLowerCase()
          .includes(keyword) ||
        item.location
          .toLowerCase()
          .includes(keyword)
      );
    }
  );

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <div className="flex min-h-screen">

        {/* =====================================================
            SIDEBAR ADMIN
        ===================================================== */}

        <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 text-white lg:flex">

          {/* ===================================================
              LOGO
          =================================================== */}

          <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-950">
              L
            </div>

            <div>

              <h1 className="text-lg font-bold tracking-tight">
                Lapangin
              </h1>

              <p className="text-xs text-slate-500">
                Admin Panel
              </p>

            </div>

          </div>

          {/* ===================================================
              MENU
          =================================================== */}

          <nav className="flex-1 px-4 py-7">

            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Menu Utama
            </p>

            <div className="space-y-1.5">

              {/* DASHBOARD */}

              <a
                href="/admin/dashboard"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >

                <DashboardIcon />

                <span>
                  Dashboard
                </span>

              </a>

              {/* LAPANGAN AKTIF */}

              <a
                href="/admin/lapangan"
                className="flex items-center gap-3 rounded-xl bg-[#1d2d47] px-3.5 py-3 text-sm font-semibold text-white shadow-sm"
              >

                <FieldIcon />

                <span>
                  Lapangan
                </span>

              </a>

              {/* RIWAYAT PEMESANAN */}

              <a
                href="/admin/riwayat"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >

                <BookingIcon />

                <span>
                  Riwayat Pemesanan
                </span>

              </a>

              {/* MANAJEMEN USER */}

              <a
                href="/admin/users"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >

                <UserIcon />

                <span>
                  Manajemen User
                </span>

              </a>

              {/* LAPORAN */}

              <a
                href="/admin/laporan"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >

                <ReportIcon />

                <span>
                  Laporan Pendapatan
                </span>

              </a>

            </div>

          </nav>

          {/* ===================================================
              DASHBOARD USER
          =================================================== */}

          <div className="border-t border-slate-800 p-4">

            <a
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">

                <span className="text-sm">
                  N
                </span>

              </div>

              <span>
                Dashboard User
              </span>

            </a>

          </div>

        </aside>

        {/* =====================================================
            MAIN AREA
        ===================================================== */}

        <div className="min-w-0 flex-1">

          {/* ===================================================
              HEADER
          =================================================== */}

          <header className="flex h-24 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">

            <div>

              <p className="text-sm text-slate-400">
                Admin Panel
              </p>

              <h1 className="text-2xl font-bold text-slate-900">
                Kelola Lapangan
              </h1>

            </div>

            <div className="flex items-center gap-4">

              {/* SEARCH HEADER */}

              <div className="hidden w-72 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 md:flex">

                <SearchIcon />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Cari lapangan..."
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />

              </div>

              {/* GARIS */}

              <div className="h-10 w-px bg-slate-200" />

              {/* ADMIN NAME */}

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-slate-900">
                  Muhammad Raihan
                </p>

                <p className="text-xs text-slate-400">
                  Administrator
                </p>

              </div>

              {/* ADMIN AVATAR */}

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 font-semibold text-white">
                M
              </div>

            </div>

          </header>

          {/* ===================================================
              CONTENT
          =================================================== */}

          <section className="mx-auto max-w-[1600px] p-5 md:p-8">

            {/* =================================================
                TITLE
            ================================================= */}

            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <p className="mb-2 text-sm font-medium text-slate-400">
                  Manajemen
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Daftar Lapangan
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Kelola lapangan yang tersedia untuk pengguna.
                </p>

              </div>

              <button
                type="button"
                onClick={openModal}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >

                <PlusIcon />

                Tambah Lapangan

              </button>

            </div>

            {/* =================================================
                TOTAL
            ================================================= */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Total Lapangan
              </p>

              <p className="mt-2 text-3xl font-bold">
                {lapangan.length}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Semua lapangan yang terdaftar
              </p>

            </div>

            {/* =================================================
                SEARCH MOBILE
            ================================================= */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:hidden">

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4">

                <SearchIcon />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Cari nama lapangan..."
                  className="h-12 w-full bg-transparent text-sm outline-none"
                />

              </div>

            </div>

            {/* =================================================
                LAPANGAN TERDAFTAR
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-5">

                <h3 className="text-lg font-bold">
                  Lapangan Terdaftar
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {filteredLapangan.length} lapangan ditemukan
                </p>

              </div>

              {/* LOADING */}

              {loading ? (

                <div className="py-16 text-center">

                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

                  <p className="text-sm text-slate-400">
                    Memuat data lapangan...
                  </p>

                </div>

              ) : filteredLapangan.length === 0 ? (

                /* EMPTY */

                <div className="py-16 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                    <ImageIcon />

                  </div>

                  <h3 className="mt-5 font-bold">
                    Belum Ada Lapangan
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Tambahkan lapangan menggunakan tombol di atas.
                  </p>

                </div>

              ) : (

                /* LIST */

                <div className="space-y-4">

                  {filteredLapangan.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="flex flex-col gap-5 rounded-2xl border border-slate-200 p-4 transition hover:shadow-sm md:flex-row md:items-center"
                      >

                        {/* GAMBAR */}

                        <div className="h-36 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 md:w-52">

                          {item.picture_url ? (

                            <img
                              src={item.picture_url}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">

                              <ImageIcon />

                              <span className="text-xs">
                                Belum ada gambar
                              </span>

                            </div>

                          )}

                        </div>

                        {/* DETAIL */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h4 className="text-lg font-bold">
                              {item.name}
                            </h4>

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold">
                              {item.category}
                            </span>

                          </div>

                          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">

                            <LocationIcon />

                            <span>
                              {item.location}
                            </span>

                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-500">
                            {item.description ||
                              "Tidak ada deskripsi."}
                          </p>

                        </div>

                        {/* HARGA */}

                        <div className="shrink-0">

                          <p className="text-xs text-slate-400">
                            Harga per jam
                          </p>

                          <p className="mt-1 text-lg font-bold">
                            {formatRupiah(
                              item.price
                            )}
                          </p>

                        </div>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >

                          <TrashIcon />

                          Hapus

                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </section>

        </div>

      </div>

      {/* =====================================================
          MODAL TAMBAH LAPANGAN
      ===================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold">
                  Tambah Lapangan
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Tambahkan lapangan baru ke sistem.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 disabled:opacity-50"
              >

                <CloseIcon />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
            >

              {/* NAMA */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Nama Lapangan
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Lapangan Futsal A"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  required
                />

              </div>

              {/* KATEGORI */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Jenis Olahraga
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none"
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

              {/* HARGA */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Harga per Jam
                </label>

                <div className="flex overflow-hidden rounded-xl border border-slate-200">

                  <div className="flex items-center bg-slate-50 px-4 text-sm font-medium">
                    Rp
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    placeholder="100000"
                    className="h-11 flex-1 px-4 text-sm outline-none"
                    required
                  />

                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Contoh: 100000 = Rp100.000
                </p>

              </div>

              {/* LOKASI */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Lokasi
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  placeholder="Padang"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none"
                  required
                />

              </div>

              {/* DESKRIPSI */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Deskripsi
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Lapangan futsal sintetis dengan fasilitas lengkap."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />

              </div>

              {/* GAMBAR */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Gambar Lapangan
                </label>

                <div className="overflow-hidden rounded-xl border-2 border-dashed border-slate-200">

                  {imagePreview ? (

                    <div className="relative">

                      <img
                        src={imagePreview}
                        alt="Preview gambar"
                        className="h-56 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview("");
                        }}
                        disabled={saving}
                        className="absolute right-3 top-3 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        Hapus Gambar
                      </button>

                    </div>

                  ) : (

                    <label className="flex cursor-pointer flex-col items-center justify-center px-5 py-10 text-center transition hover:bg-slate-50">

                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">

                        <ImageIcon />

                      </div>

                      <p className="text-sm font-semibold">
                        Pilih gambar lapangan
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PNG, JPG, JPEG, atau WEBP
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Maksimal 5 MB
                      </p>

                      <span className="mt-4 rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white">
                        Pilih Gambar
                      </span>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={
                          handleImageChange
                        }
                      />

                    </label>

                  )}

                </div>

              </div>

              {/* BUTTON */}

              <div className="flex gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 flex-1 rounded-xl bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >

                  {saving
                    ? "Menyimpan..."
                    : "Simpan Lapangan"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}