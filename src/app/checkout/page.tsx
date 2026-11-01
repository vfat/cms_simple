"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  KeyRound,
  Link2,
  ShieldCheck,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { calculateCartTotals } from "@/lib/quota-guard";
import { formatCurrency } from "@/lib/format";
import { getStoredUTMParams, trackBeginCheckout } from "@/lib/analytics";
import { OrderRecord, UTMParams } from "@/types";

export default function CheckoutPage() {
  const {
    items,
    vouchers,
    appliedVoucherCode,
    locale,
    simulateCheckoutOrder,
  } = useAppStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [notes, setNotes] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(
    null
  );
  const [failedOrderAlert, setFailedOrderAlert] = useState<string | null>(null);
  const [utm, setUtm] = useState<UTMParams>({});

  const totals = calculateCartTotals(items, appliedVoucherCode, vouchers);

  useEffect(() => {
    setUtm(getStoredUTMParams());
    if (items.length > 0) {
      trackBeginCheckout(items, totals.grandTotal, appliedVoucherCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateBuyerForm = (): boolean => {
    setFormError(null);
    if (fullName.trim().length < 3) {
      setFormError("Nama lengkap pembeli minimal terdiri dari 3 karakter.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError(
        "Masukkan alamat email yang valid untuk pengiriman kode lisensi (contoh: owner@tokoku.id)."
      );
      return false;
    }

    if (whatsapp.trim().length < 8) {
      setFormError("Masukkan nomor WhatsApp aktif minimal 8 digit.");
      return false;
    }

    if (companyName.trim().length < 2) {
      setFormError("Masukkan nama toko atau perusahaan UMKM Anda.");
      return false;
    }

    return true;
  };

  const handlePaymentSimulation = (mode: "SUCCESS" | "FAILED") => {
    setFailedOrderAlert(null);
    if (!validateBuyerForm()) return;

    const result = simulateCheckoutOrder({
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        companyName: companyName.trim(),
        notes: notes.trim() || undefined,
      },
      simulateMode: mode,
    });

    if (!result.success) {
      setFailedOrderAlert(
        result.errorMessage ?? "Pembayaran gagal diproses. Silakan coba lagi."
      );
      return;
    }

    if (result.order) {
      setCompletedOrder(result.order);
    }
  };

  const fillSampleBuyer = () => {
    setFullName("Rendra Pratama");
    setEmail("rendra@kopinusantara.id");
    setWhatsapp("081298765432");
    setCompanyName("Kopi Nusantara Sejahtera");
    setNotes("Mohon jadwalkan sesi onboarding tim kasir hari Senin.");
    setFormError(null);
  };

  // ORDER SUCCESS CONFIRMATION VIEW
  if (completedOrder) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <span className="mt-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Pembayaran Berhasil Diverifikasi • Status: PAID
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Terima Kasih, {completedOrder.customer.fullName}!
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Pesanan <strong>#{completedOrder.orderId}</strong> untuk{" "}
            <strong>{completedOrder.customer.companyName}</strong> telah aktif.
            Kuota promo telah dikunci dan kode lisensi telah dikirim ke{" "}
            <span className="font-semibold text-indigo-600">
              {completedOrder.customer.email}
            </span>
            .
          </p>

          {/* Instant License Keys Box */}
          <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-800">
              <KeyRound className="h-4 w-4" />
              <span>Kode Aktivasi Lisensi Anda ({completedOrder.licenseKeys.length})</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {completedOrder.licenseKeys.map((key) => (
                <span
                  key={key}
                  className="rounded-xl border border-indigo-300 bg-white px-3 py-1.5 font-mono text-xs font-bold text-indigo-950 shadow-sm"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>

          {/* Order Payload + UTM Verification Box (Requirement C3) */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400">
                Payload Order Mock (Beserta Atribusi UTM)
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                POST /api/v1/orders
              </span>
            </div>
            <pre className="mt-2 max-h-56 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-300">
              {JSON.stringify(
                {
                  orderId: completedOrder.orderId,
                  status: completedOrder.status,
                  customer: completedOrder.customer,
                  grandTotal: completedOrder.grandTotal,
                  voucherCode: completedOrder.voucherCode ?? null,
                  utmAttribution: completedOrder.utm,
                  items: completedOrder.items.map((i) => ({
                    productId: i.productId,
                    packageId: i.packageId,
                    billingCycle: i.billingCycle,
                    quantity: i.quantity,
                    promoUnitPrice: i.promoUnitPrice,
                  })),
                },
                null,
                2
              )}
            </pre>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-700"
            >
              <span>Kembali ke Katalog Marketplace</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <span>Lihat Order di CMS Admin</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART STATE
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
          Keranjang Belanja Masih Kosong
        </h1>
        <p className="mt-2 text-xs text-slate-600 sm:text-sm">
          Silakan pilih produk software UMKM di katalog terlebih dahulu sebelum
          melanjutkan ke pembayaran.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-700"
        >
          <span>Jelajahi Katalog Produk</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Katalog Produk</span>
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Checkout & Aktivasi Lisensi Kodeva
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Lengkapi data pembeli di bawah ini lalu uji simulasi pembayaran
            Sukses maupun Gagal.
          </p>
        </div>
        <button
          type="button"
          onClick={fillSampleBuyer}
          className="self-start rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 sm:self-auto"
        >
          ⚡ Isi Otomatis Data Pembeli Contoh
        </button>
      </div>

      {/* Simulated Failed Payment Banner */}
      {failedOrderAlert && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 shadow-sm">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div className="flex-1">
            <div className="font-extrabold">Status Pembayaran: GAGAL (FAILED)</div>
            <p className="mt-1 leading-relaxed">{failedOrderAlert}</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Buyer Information Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-extrabold text-slate-900">
              1. Informasi Pembeli & Penerima Lisensi
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="buyer-name"
                  className="block text-xs font-bold text-slate-700"
                >
                  Nama Lengkap *
                </label>
                <input
                  id="buyer-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Rendra Pratama"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="buyer-email"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Email Pengiriman Lisensi *
                  </label>
                  <input
                    id="buyer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@bisnisumkm.id"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="buyer-wa"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    id="buyer-wa"
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="081298765432"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="buyer-company"
                  className="block text-xs font-bold text-slate-700"
                >
                  Nama Toko / Perusahaan UMKM *
                </label>
                <input
                  id="buyer-company"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Contoh: Kopi Nusantara Sejahtera"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="buyer-notes"
                  className="block text-xs font-bold text-slate-700"
                >
                  Catatan Onboarding (Opsional)
                </label>
                <textarea
                  id="buyer-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jadwal instalasi atau permintaan khusus..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-700">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
            </div>

            {/* Active UTM Attribution Badge */}
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <Link2 className="h-4 w-4 text-indigo-600" />
                <span>Atribusi Parameter UTM Terkunci pada Order Ini:</span>
              </div>
              <p className="mt-1 text-slate-600">
                Source:{" "}
                <strong className="text-slate-900">
                  {utm.utm_source || "direct"}
                </strong>{" "}
                • Medium:{" "}
                <strong className="text-slate-900">
                  {utm.utm_medium || "none"}
                </strong>{" "}
                • Campaign:{" "}
                <strong className="text-slate-900">
                  {utm.utm_campaign || "promo_akhir_tahun_2026"}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary & Payment Simulator */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-extrabold text-slate-900">
              2. Ringkasan Pesanan ({totals.totalLicenseCount} Lisensi)
            </h2>

            <div className="mt-4 divide-y divide-slate-100">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between py-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {item.productName}
                    </div>
                    <div className="text-slate-500">
                      Paket {item.packageName} ({item.billingCycle}) ×{" "}
                      {item.quantity} {item.unitLabel}
                    </div>
                  </div>
                  <div className="text-right font-bold text-slate-900">
                    {formatCurrency(item.promoUnitPrice * item.quantity, locale)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Harga Normal</span>
                <span className="line-through">
                  {formatCurrency(totals.subtotalNormal, locale)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-600">
                <span>Potongan Promo Akhir Tahun</span>
                <span>-{formatCurrency(totals.promoSavings, locale)}</span>
              </div>
              {totals.voucherDiscount > 0 && (
                <div className="flex justify-between font-semibold text-indigo-600">
                  <span>Diskon Voucher ({appliedVoucherCode})</span>
                  <span>-{formatCurrency(totals.voucherDiscount, locale)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
                <span>Total Pembayaran</span>
                <span>{formatCurrency(totals.grandTotal, locale)}</span>
              </div>
            </div>

            {/* Interactive Payment Simulator Buttons (Requirement B5) */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                <CreditCard className="h-4 w-4 text-indigo-600" />
                <span>Simulator Payment Gateway</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Pilih skenario di bawah untuk menguji alur pembayaran berhasil
                (memotong kuota & menerbitkan lisensi) atau gagal:
              </p>

              <div className="mt-3.5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => handlePaymentSimulation("SUCCESS")}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Simulasi Bayar SUKSES (Kirim Lisensi)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentSimulation("FAILED")}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-5 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-50"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Simulasi Bayar GAGAL (Uji Error Handling)</span>
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Enkripsi SSL 256-bit • Lisensi Aktif Instan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
