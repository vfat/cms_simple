"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { calculateCartTotals, getProductTotalInCart } from "@/lib/quota-guard";
import { formatCurrency } from "@/lib/format";
import { trackBeginCheckout } from "@/lib/analytics";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    products,
    vouchers,
    appliedVoucherCode,
    isCartOpen,
    setIsCartOpen,
    updateCartItemQuantity,
    removeCartItem,
    applyVoucher,
    removeVoucher,
    locale,
  } = useAppStore();

  const [voucherInput, setVoucherInput] = useState("");
  const [quotaAlert, setQuotaAlert] = useState<string | null>(null);
  const [voucherFeedback, setVoucherFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const totals = calculateCartTotals(items, appliedVoucherCode, vouchers);

  const handleQtyChange = (itemKey: string, nextQty: number) => {
    setQuotaAlert(null);
    const res = updateCartItemQuantity(itemKey, nextQty);
    if (!res.allowed && res.reason) {
      setQuotaAlert(res.reason);
    }
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyVoucher(voucherInput);
    setVoucherFeedback({
      type: res.valid ? "success" : "error",
      text: res.message,
    });
    if (res.valid) {
      setVoucherInput("");
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    trackBeginCheckout(items, totals.grandTotal, appliedVoucherCode);
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <>
      {/* Mobile Bottom Floating Cart Bar (Visible on mobile when cart has items and drawer is closed) */}
      {items.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 right-4 z-30 sm:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex min-h-[48px] items-center gap-3 rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-xl ring-2 ring-white/20 transition active:scale-95"
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>
              {totals.totalLicenseCount} Lisensi •{" "}
              {formatCurrency(totals.grandTotal, locale)}
            </span>
          </button>
        </div>
      )}

      {/* Backdrop & Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="flex w-screen max-w-md flex-col bg-white shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Keranjang Lisensi
                    </h2>
                    <p className="text-xs text-slate-500">
                      {totals.totalLicenseCount} lisensi dipilih • Tersimpan
                      otomatis
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Tutup Keranjang"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quota Warning Banner */}
              {quotaAlert && (
                <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div className="flex-1">
                    <p className="font-semibold">Batas Kuota Promo Bersama</p>
                    <p className="mt-0.5">{quotaAlert}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuotaAlert(null)}
                    className="text-amber-700 hover:text-amber-950"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-900">
                      Keranjang Anda Masih Kosong
                    </h3>
                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                      Pilih aplikasi kasir POS, software HRIS Payroll, atau
                      add-on bisnis UMKM dengan harga Promo Akhir Tahun.
                    </p>
                    <Link
                      href="/catalog"
                      onClick={() => setIsCartOpen(false)}
                      className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Jelajahi Katalog Produk
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => {
                      const parentProduct = products.find(
                        (p) => p.id === item.productId
                      );
                      const maxProductQuota = parentProduct?.promoQuota ?? 0;
                      const totalProductInCart = getProductTotalInCart(
                        items,
                        item.productId
                      );
                      const isAtProductQuotaLimit =
                        totalProductInCart >= maxProductQuota;

                      return (
                        <div
                          key={item.key}
                          className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-indigo-200"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={`/catalog/${item.productSlug}`}
                                onClick={() => setIsCartOpen(false)}
                                className="text-sm font-bold text-slate-900 hover:text-indigo-600"
                              >
                                {item.productName}
                              </Link>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-800">
                                  Paket {item.packageName}
                                </span>
                                <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                  {item.billingCycle === "yearly"
                                    ? "Tahunan (-20%)"
                                    : "Bulanan"}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCartItem(item.key)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              aria-label={`Hapus ${item.productName}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Shared Quota Indicator per Product */}
                          <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-[11px] text-slate-600 ring-1 ring-slate-200/80">
                            <span>Kuota Promo Produk (Gabungan Paket):</span>
                            <span
                              className={`font-bold ${
                                isAtProductQuotaLimit
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {totalProductInCart} / {maxProductQuota}{" "}
                              {item.unitLabel}
                            </span>
                          </div>

                          {/* Price & Quantity Stepper */}
                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <div className="text-xs text-slate-400 line-through">
                                {formatCurrency(
                                  item.normalUnitPrice * item.quantity,
                                  locale
                                )}
                              </div>
                              <div className="text-sm font-extrabold text-slate-900">
                                {formatCurrency(
                                  item.promoUnitPrice * item.quantity,
                                  locale
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQtyChange(item.key, item.quantity - 1)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
                                aria-label="Kurangi jumlah lisensi"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[32px] text-center text-sm font-bold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleQtyChange(item.key, item.quantity + 1)
                                }
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                  isAtProductQuotaLimit
                                    ? "cursor-not-allowed text-slate-300"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`}
                                aria-label="Tambah jumlah lisensi"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Voucher Section */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-indigo-600" />
                          Kode Voucher Promo
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Coba: AKHIRTAHUN10 / UMKMMAJU
                        </span>
                      </div>

                      {appliedVoucherCode ? (
                        <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>Voucher {appliedVoucherCode} aktif</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              removeVoucher();
                              setVoucherFeedback(null);
                            }}
                            className="font-semibold text-rose-600 hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <form
                          onSubmit={handleApplyVoucher}
                          className="mt-2 flex gap-2"
                        >
                          <input
                            type="text"
                            value={voucherInput}
                            onChange={(e) =>
                              setVoucherInput(e.target.value.toUpperCase())
                            }
                            placeholder="Ketik kode voucher..."
                            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold uppercase text-slate-900 placeholder:normal-case focus:border-indigo-500 focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                          >
                            Pakai
                          </button>
                        </form>
                      )}

                      {voucherFeedback && (
                        <p
                          className={`mt-1.5 text-[11px] font-medium ${
                            voucherFeedback.type === "success"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {voucherFeedback.text}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Totals & Checkout CTA */}
              {items.length > 0 && (
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Harga Normal</span>
                      <span className="line-through">
                        {formatCurrency(totals.subtotalNormal, locale)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-emerald-600">
                      <span>Hemat Promo Akhir Tahun</span>
                      <span>-{formatCurrency(totals.promoSavings, locale)}</span>
                    </div>
                    {totals.voucherDiscount > 0 && (
                      <div className="flex justify-between font-medium text-indigo-600">
                        <span>Diskon Voucher ({appliedVoucherCode})</span>
                        <span>
                          -{formatCurrency(totals.voucherDiscount, locale)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                      <span>Total Bayar</span>
                      <span>{formatCurrency(totals.grandTotal, locale)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Lanjut ke Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
