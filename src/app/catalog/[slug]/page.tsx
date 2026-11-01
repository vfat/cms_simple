"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { calculateCyclePrice, formatCurrency } from "@/lib/format";
import { getProductTotalInCart } from "@/lib/quota-guard";
import { trackViewItemOnce } from "@/lib/analytics";
import { BillingCycle, PackageTierId } from "@/types";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const { products, items, locale, addToCart, setIsCartOpen } = useAppStore();
  const product = products.find((p) => p.slug === slug);

  const [selectedTier, setSelectedTier] = useState<PackageTierId>("pro");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const activePackage =
    product?.packages.find((pk) => pk.id === selectedTier) ??
    product?.packages[0];

  // Track GA4 `view_item` with strict anti-duplication guard
  useEffect(() => {
    if (!product || !activePackage) return;
    const { promoUnitPrice } = calculateCyclePrice(activePackage, billingCycle);
    trackViewItemOnce(product, activePackage, promoUnitPrice);
  }, [product, activePackage, billingCycle]);

  if (!product || !activePackage) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Produk Tidak Ditemukan
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Produk dengan kode URL <code className="font-mono">{slug}</code> tidak
          tersedia di katalog Kodeva.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Katalog Produk</span>
        </Link>
      </div>
    );
  }

  const priceCalc = calculateCyclePrice(activePackage, billingCycle);
  const inCartForThisProduct = getProductTotalInCart(items, product.id);
  const remainingAvailable = Math.max(
    0,
    product.promoQuota - inCartForThisProduct
  );

  // Breakdown of packages of this product currently in cart
  const productItemsInCart = items.filter((i) => i.productId === product.id);

  const handleAddToCart = () => {
    setFeedback(null);
    const result = addToCart({
      productId: product.id,
      packageId: activePackage.id,
      billingCycle,
      quantity,
    });

    if (!result.allowed) {
      setFeedback({
        type: "error",
        text:
          result.reason ??
          "Jumlah lisensi melebihi sisa kuota promo bersama produk ini.",
      });
      return;
    }

    setQuantity(1);
    setFeedback({
      type: "success",
      text: `Berhasil menambahkan ${quantity} ${product.unitLabel} (Paket ${activePackage.name}) ke keranjang!`,
    });
  };

  const activeScreenshot =
    product.screenshots[activeScreenIndex] ?? product.screenshots[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Katalog Marketplace</span>
      </Link>

      {/* Main Product Grid */}
      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left Column: Feature Screenshots & Highlights */}
        <div className="lg:col-span-6">
          {activeScreenshot && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-bold text-slate-300">
                    Pratinjau Fitur: {activeScreenshot.title}
                  </span>
                </div>
                <span className="rounded-md bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300">
                  Layar {activeScreenIndex + 1} / {product.screenshots.length}
                </span>
              </div>

              <div
                className={`mt-5 rounded-2xl bg-gradient-to-br ${activeScreenshot.accentColor} p-6 shadow-inner`}
              >
                <div className="text-lg font-extrabold text-white">
                  {activeScreenshot.title}
                </div>
                <p className="mt-1 text-xs text-white/90">
                  {activeScreenshot.caption}
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {activeScreenshot.metricsPreview.map((metric, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-slate-950/40 p-3 backdrop-blur-sm"
                    >
                      <div className="text-[11px] text-white/75">
                        {metric.label}
                      </div>
                      <div className="mt-1 text-sm font-extrabold text-white sm:text-base">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screenshot Tabs */}
              {product.screenshots.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.screenshots.map((sc, idx) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setActiveScreenIndex(idx)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                        activeScreenIndex === idx
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {idx + 1}. {sc.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Product Description & Key Highlights */}
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900">
              Tentang {product.name}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {product.fullDescription}
            </p>

            <h3 className="mt-5 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Keunggulan Utama
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-700 sm:text-sm">
              {product.highlights.map((hl, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive Package Picker, Quota Guard & Add to Cart */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400">
                  ({product.reviewCount} ulasan)
                </span>
              </div>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-1.5 text-xs text-slate-600 sm:text-sm">
              {product.tagline}
            </p>

            {/* Shared Promo Quota Box (Crucial Requirement B4) */}
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950">
                  🔥 Sisa Kuota Lisensi Promo (Gabungan Semua Paket):
                </span>
                <span className="rounded-full bg-amber-500 px-2.5 py-0.5 font-extrabold text-slate-950">
                  Sisa {remainingAvailable} dari {product.promoQuota}{" "}
                  {product.unitLabel}
                </span>
              </div>

              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-amber-200/70">
                <div
                  className="h-full rounded-full bg-amber-600 transition-all"
                  style={{
                    width: `${
                      product.promoQuota > 0
                        ? Math.min(
                            100,
                            (inCartForThisProduct / product.promoQuota) * 100
                          )
                        : 100
                    }%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[11px] text-amber-900">
                Pilihan paket Basic, Pro, dan Business pada produk ini berbagi
                kuota promo yang sama ({product.promoQuota} {product.unitLabel}
                ).{" "}
                {inCartForThisProduct > 0 && (
                  <strong>
                    Saat ini sudah ada {inCartForThisProduct}{" "}
                    {product.unitLabel} di keranjang Anda (
                    {productItemsInCart
                      .map((i) => `${i.packageName}: ${i.quantity}`)
                      .join(", ")}
                    ).
                  </strong>
                )}
              </p>
            </div>

            {/* Bonus Feature: Billing Duration Toggle (Monthly vs Yearly) */}
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-100 p-1.5">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Langganan Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                  billingCycle === "yearly"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tahunan (Ekstra Hemat 20%)
              </button>
            </div>

            {/* Package Tier Selector (Basic / Pro / Business) */}
            <div className="mt-5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Pilih Paket Lisensi (Harga Berubah Otomatis):
              </label>

              <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                {product.packages.map((pkg) => {
                  const isSelected = pkg.id === activePackage.id;
                  const pkgCalc = calculateCyclePrice(pkg, billingCycle);

                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedTier(pkg.id)}
                      className={`relative flex flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {pkg.isPopular && (
                        <span className="mb-1 rounded bg-indigo-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                          Terpopuler
                        </span>
                      )}
                      <span className="text-sm font-extrabold text-slate-900">
                        {pkg.name}
                      </span>
                      <span className="mt-1 text-xs font-bold text-indigo-700">
                        {formatCurrency(pkgCalc.promoUnitPrice, locale)}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatCurrency(pkgCalc.normalUnitPrice, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Package Price & Features Box */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-500">
                    Harga Paket {activePackage.name} ({activePackage.maxUsersOrOutlets}):
                  </span>
                  <div className="mt-1 flex items-baseline gap-2.5">
                    <span className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                      {formatCurrency(priceCalc.promoUnitPrice, locale)}
                    </span>
                    <span className="text-sm font-medium text-slate-400 line-through">
                      {formatCurrency(priceCalc.normalUnitPrice, locale)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {priceCalc.periodLabel}
                    </span>
                  </div>
                </div>

                <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800">
                  Hemat{" "}
                  {formatCurrency(
                    priceCalc.normalUnitPrice - priceCalc.promoUnitPrice,
                    locale
                  )}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600">
                {activePackage.description}
              </p>

              <ul className="mt-3.5 space-y-1.5 border-t border-slate-200/80 pt-3 text-xs text-slate-700">
                {activePackage.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-600" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Stepper & Add to Cart Button */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-3 py-2 sm:w-44">
                <span className="text-xs font-bold text-slate-500">
                  Jumlah:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[24px] text-center text-sm font-extrabold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={remainingAvailable === 0}
                className="flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>
                  {remainingAvailable === 0
                    ? "Kuota Promo Produk Ini Penuh di Cart"
                    : `Tambah ke Keranjang • ${formatCurrency(
                        priceCalc.promoUnitPrice * quantity,
                        locale
                      )}`}
                </span>
              </button>
            </div>

            {/* Feedback Banner */}
            {feedback && (
              <div
                className={`mt-4 flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs ${
                  feedback.type === "success"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                    : "border-rose-300 bg-rose-50 text-rose-900"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                )}
                <div className="flex-1">
                  <p className="font-bold">{feedback.text}</p>
                  {feedback.type === "success" && (
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(true)}
                      className="mt-1 font-extrabold text-indigo-700 underline"
                    >
                      Buka Keranjang Belanja Sekarang →
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>
                Garansi uang kembali 14 hari • Bebas upgrade paket kapan saja
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Feature: Feature Comparison Table across Packages */}
      {product.comparisonTable.length > 0 && (
        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600">
              <Sparkles className="h-3.5 w-3.5" />
              Perbandingan Spesifikasi Paket
            </span>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              Tabel Perbandingan Fitur Basic vs Pro vs Business
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-6 py-4 font-extrabold">Komponen Fitur</th>
                  <th className="px-6 py-4 text-center font-extrabold">
                    Paket Basic
                  </th>
                  <th className="bg-indigo-50/60 px-6 py-4 text-center font-extrabold text-indigo-900">
                    Paket Pro (Populer)
                  </th>
                  <th className="px-6 py-4 text-center font-extrabold">
                    Paket Business
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {product.comparisonTable.map((row, idx) => {
                  const renderCell = (val: string | boolean) => {
                    if (typeof val === "boolean") {
                      return val ? (
                        <Check className="mx-auto h-5 w-5 text-emerald-600" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-slate-300" />
                      );
                    }
                    return <span className="font-bold text-slate-800">{val}</span>;
                  };

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="px-6 py-3.5 font-semibold text-slate-800">
                        {row.featureName}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {renderCell(row.basic)}
                      </td>
                      <td className="bg-indigo-50/30 px-6 py-3.5 text-center">
                        {renderCell(row.pro)}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {renderCell(row.business)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

