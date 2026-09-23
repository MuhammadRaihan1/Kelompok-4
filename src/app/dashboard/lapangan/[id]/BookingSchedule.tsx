"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type BookingData = {
  id: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
};

type Props = {
  lapanganId: string;
  bookings: BookingData[];
};

function formatTanggal(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatJam(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  const now = new Date();

  return getDateKey(now);
}

function getDateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export default function BookingSchedule({
  lapanganId,
  bookings,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(getToday());

  /*
   * Booking yang dibatalkan tidak dianggap
   * sebagai jam yang terisi.
   */
  const activeBookings = useMemo(() => {
    return bookings.filter(
      (booking) => booking.status !== "CANCELLED"
    );
  }, [bookings]);

  /*
   * Booking pada tanggal yang dipilih.
   */
  const selectedBookings = useMemo(() => {
    return activeBookings
      .filter((booking) => {
        const start = new Date(booking.startTime);

        return getDateKey(start) === selectedDate;
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() -
          new Date(b.startTime).getTime()
      );
  }, [activeBookings, selectedDate]);

  /*
   * Buat daftar tanggal yang bisa dipilih.
   * 7 hari dari hari ini.
   */
  const dateOptions = useMemo(() => {
    const dates = [];

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);

      date.setDate(today.getDate() + i);

      dates.push(date);
    }

    return dates;
  }, []);

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
            Jadwal Lapangan
          </p>

          <h3 className="mt-1 text-2xl font-bold text-slate-950">
            Pilih Jadwal Bermain
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Lihat jam yang sudah dipesan sebelum melakukan booking.
          </p>

        </div>

        <div className="flex flex-wrap gap-3 text-xs">

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-emerald-500" />

            <span className="text-slate-500">
              Tersedia
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-orange-500" />

            <span className="text-slate-500">
              Menunggu
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-red-500" />

            <span className="text-slate-500">
              Dipesan
            </span>

          </div>

        </div>

      </div>

      {/* PILIH TANGGAL */}

      <div className="mt-6">

        <p className="mb-3 text-sm font-semibold text-slate-700">
          Pilih tanggal
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">

          {dateOptions.map((date) => {
            const key = getDateKey(date);

            const active = key === selectedDate;

            const hasBooking = activeBookings.some((booking) => {
              return (
                getDateKey(new Date(booking.startTime)) === key
              );
            });

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDate(key)}
                className={[
                  "rounded-xl border p-3 text-left transition",
                  active
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50",
                ].join(" ")}
              >

                <p
                  className={[
                    "text-xs font-medium",
                    active
                      ? "text-slate-300"
                      : "text-slate-400",
                  ].join(" ")}
                >
                  {new Intl.DateTimeFormat("id-ID", {
                    weekday: "short",
                  }).format(date)}
                </p>

                <p className="mt-1 text-lg font-bold">
                  {date.getDate()}
                </p>

                <p
                  className={[
                    "text-xs",
                    active
                      ? "text-slate-300"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  {new Intl.DateTimeFormat("id-ID", {
                    month: "short",
                  }).format(date)}
                </p>

                {hasBooking && (
                  <div className="mt-2 flex items-center gap-1">

                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        active
                          ? "bg-orange-400"
                          : "bg-orange-500",
                      ].join(" ")}
                    />

                    <span
                      className={[
                        "text-[10px]",
                        active
                          ? "text-slate-300"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      Ada booking
                    </span>

                  </div>
                )}

              </button>
            );
          })}

        </div>

      </div>

      {/* TANGGAL TERPILIH */}

      <div className="mt-8">

        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

          <div>

            <p className="text-sm text-slate-400">
              Jadwal tanggal
            </p>

            <p className="font-semibold text-slate-900">
              {formatTanggal(
                getDateFromKey(selectedDate)
              )}
            </p>

          </div>

          <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
            {selectedBookings.length} booking
          </div>

        </div>

        {/* JIKA TIDAK ADA BOOKING */}

        {selectedBookings.length === 0 ? (

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                ✓
              </div>

              <div>

                <p className="font-semibold text-emerald-700">
                  Belum ada booking
                </p>

                <p className="mt-1 text-sm text-emerald-600">
                  Semua jadwal pada tanggal ini masih tersedia.
                </p>

              </div>

            </div>

          </div>

        ) : (

          <div className="space-y-3">

            {selectedBookings.map((booking) => {

              const start = new Date(
                booking.startTime
              );

              const end = new Date(
                booking.endTime
              );

              const isPending =
                booking.status === "PENDING";

              return (
                <div
                  key={booking.id}
                  className={[
                    "flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center",
                    isPending
                      ? "border-orange-100 bg-orange-50"
                      : "border-red-100 bg-red-50",
                  ].join(" ")}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={[
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        isPending
                          ? "bg-orange-100 text-orange-600"
                          : "bg-red-100 text-red-600",
                      ].join(" ")}
                    >
                      ◷
                    </div>

                    <div>

                      <p className="text-lg font-bold text-slate-900">
                        {formatJam(start)} - {formatJam(end)}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        ID Booking #
                        {booking.id
                          .slice(0, 8)
                          .toUpperCase()}
                      </p>

                    </div>

                  </div>

                  <div>

                    {isPending ? (

                      <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">

                        <span className="h-2 w-2 rounded-full bg-orange-500" />

                        Menunggu Konfirmasi

                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">

                        <span className="h-2 w-2 rounded-full bg-red-500" />

                        Sudah Dipesan

                      </span>

                    )}

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

      {/* INFO */}

      <div className="mt-6 rounded-xl bg-slate-50 p-4">

        <p className="text-sm leading-6 text-slate-500">

          <span className="font-semibold text-slate-700">
            Catatan:
          </span>{" "}
          Jam yang berstatus menunggu maupun sudah dikonfirmasi
          dianggap tidak tersedia untuk booking baru agar tidak terjadi
          bentrok jadwal.

        </p>

      </div>

      {/* BUTTON BOOKING */}

      <div className="mt-6">

        <Link
          href={`/dashboard/booking?lapanganId=${lapanganId}&date=${selectedDate}`}
          className="flex w-full items-center justify-center rounded-xl bg-[#020719] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#111827]"
        >
          Booking untuk{" "}
          {new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(getDateFromKey(selectedDate))}
        </Link>

      </div>

    </div>
  );
}