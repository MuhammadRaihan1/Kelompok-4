"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  customerName: string;
  customerEmail: string;
  lapanganName: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
};

function formatTanggal(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatJam(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function waktuRelatif(date: string) {
  const sekarang = Date.now();
  const waktu = new Date(date).getTime();

  const selisih = Math.floor((sekarang - waktu) / 1000);

  if (selisih < 60) {
    return "Baru saja";
  }

  if (selisih < 3600) {
    return `${Math.floor(selisih / 60)} menit lalu`;
  }

  if (selisih < 86400) {
    return `${Math.floor(selisih / 3600)} jam lalu`;
  }

  return `${Math.floor(selisih / 86400)} hari lalu`;
}

function statusText(status: NotificationItem["status"]) {
  if (status === "CONFIRMED") return "Dikonfirmasi";
  if (status === "CANCELLED") return "Dibatalkan";
  return "Menunggu";
}

function statusClass(status: NotificationItem["status"]) {
  if (status === "CONFIRMED") {
    return "bg-green-100 text-green-700";
  }

  if (status === "CANCELLED") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // =====================================================
  // LOAD NOTIFICATION
  // =====================================================

  async function loadNotifications() {
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // LOAD READ ID DARI LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "lapangin_admin_read_notifications"
      );

      if (saved) {
        setReadIds(JSON.parse(saved));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // =====================================================
  // LOAD PERTAMA
  // =====================================================

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // CLOSE KETIKA KLIK DI LUAR
  // =====================================================

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =====================================================
  // UNREAD
  // =====================================================

  const unreadNotifications = notifications.filter(
    (item) => !readIds.includes(item.id)
  );

  // Maksimal angka badge 99+
  const unreadCount = unreadNotifications.length;

  // =====================================================
  // BUKA NOTIFIKASI
  // =====================================================

  function handleOpen() {
    setOpen((value) => !value);
  }

  // =====================================================
  // TANDAI SATU SUDAH DIBACA
  // =====================================================

  function markAsRead(id: string) {
    const updated = Array.from(new Set([...readIds, id]));

    setReadIds(updated);

    localStorage.setItem(
      "lapangin_admin_read_notifications",
      JSON.stringify(updated)
    );
  }

  // =====================================================
  // TANDAI SEMUA
  // =====================================================

  function markAllAsRead() {
    const ids = notifications.map((item) => item.id);

    setReadIds(ids);

    localStorage.setItem(
      "lapangin_admin_read_notifications",
      JSON.stringify(ids)
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* =================================================
          BUTTON BELL
      ================================================= */}

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifikasi"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe5ed] bg-[#f8fafc] text-[#13213a] transition hover:bg-[#eef2f7]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>

        {/* BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* =================================================
          DROPDOWN
      ================================================= */}

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[390px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#e2e7ee] bg-white shadow-2xl">
          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-[#edf0f4] px-5 py-4">
            <div>
              <h3 className="text-sm font-bold text-[#07152f]">
                Notifikasi
              </h3>

              <p className="mt-1 text-xs text-[#91a0b5]">
                Aktivitas pemesanan terbaru
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#2563eb] hover:underline"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* CONTENT */}

          <div className="max-h-[450px] overflow-y-auto">
            {loading ? (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#07152f]" />

                <p className="mt-3 text-xs text-[#91a0b5]">
                  Memuat notifikasi...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f4f8] text-2xl">
                  🔔
                </div>

                <p className="mt-4 text-sm font-semibold text-[#52627a]">
                  Belum ada notifikasi
                </p>

                <p className="mt-1 text-xs text-[#9aa6b7]">
                  Booking customer akan muncul di sini.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !readIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => markAsRead(item.id)}
                    className={`w-full border-b border-[#edf0f4] px-5 py-4 text-left transition hover:bg-[#f8fafc] ${
                      isUnread ? "bg-blue-50/40" : "bg-white"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* ICON */}

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isUnread
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="17"
                            rx="2"
                          />
                          <path d="M16 2v4" />
                          <path d="M8 2v4" />
                          <path d="M3 10h18" />
                          <path d="M8 14h.01" />
                          <path d="M12 14h.01" />
                          <path d="M16 14h.01" />
                        </svg>
                      </div>

                      {/* DATA */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-[#17243d]">
                            {item.title}
                          </p>

                          {isUnread && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-[#64748b]">
                          <span className="font-semibold text-[#334155]">
                            {item.customerName}
                          </span>{" "}
                          melakukan pemesanan.
                        </p>

                        <div className="mt-2 rounded-lg bg-[#f8fafc] px-3 py-2">
                          <p className="text-xs font-semibold text-[#334155]">
                            {item.lapanganName}
                          </p>

                          <p className="mt-1 text-[11px] text-[#64748b]">
                            {formatTanggal(item.startTime)} •{" "}
                            {formatJam(item.startTime)} -{" "}
                            {formatJam(item.endTime)}
                          </p>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusClass(
                              item.status
                            )}`}
                          >
                            {statusText(item.status)}
                          </span>

                          <span className="text-[10px] text-[#94a3b8]">
                            {waktuRelatif(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* FOOTER */}

          <div className="border-t border-[#edf0f4] bg-[#fafbfd] p-3">
            <Link
              href="/admin/booking"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-[#07152f] px-4 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#152849]"
            >
              Lihat Semua Pemesanan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}