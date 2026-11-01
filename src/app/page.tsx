"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Flame,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Users,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { formatCurrency } from "@/lib/format";
import { getStoredUTMParams, trackLandingCtaClick } from "@/lib/analytics";
import { LandingSectionId } from "@/types";

export default function LandingPage() {
  const { cms, products, locale, submitLeadCapture } = useAppStore();
  const { hero, sections, featuredProductIds, testimonials, faqs } = cms;

  const [openFaqId, setOpenFaqId] = useState<string | null>(
    faqs[0]?.id ?? null
  );

  // Lead Capture Form State
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [interestedCategory, setInterestedCategory] = useState(
    "Aplikasi Kasir (POS)"
  );
  // Honeypot anti-bot spam field
  const [honeypotWebsite, setHoneypotWebsite] = useState("");
  const [lastSubmitTimestamp, setLastSubmitTimestamp] = useState<number>(0);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadSuccess, setLeadSuccess] = useState<string | null>(null);

  const featuredProducts = products.filter((p) =>
    featuredProductIds.includes(p.id)
  );

  // Check promo schedule status (Bonus Feature: Penjadwalan Konten Promo dari CMS)
  const todayStr = new Date().toISOString().slice(0, 10);
  const isPromoScheduleActive =
    (!hero.promoStartDate || todayStr >= hero.promoStartDate) &&
    (!hero.promoEndDate || todayStr <= hero.promoEndDate);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError(null);
    setLeadSuccess(null);

    // 1. Proteksi Spam Honeypot
    if (honeypotWebsite.trim() !== "") {
      setLeadError("Permintaan terdeteksi sebagai aktivitas bot otomatis.");
      return;
    }

    // 2. Proteksi Rate Limit Dasar (Cooldown 10 detik)
    const now = Date.now();
    if (now - lastSubmitTimestamp < 10000) {
      setLeadError(
        "Mohon tunggu beberapa detik sebelum mengirim formulir kembali."
      );
      return;
    }

    // 3. Validasi Input
    if (fullName.trim().length < 3) {
      setLeadError("Nama lengkap minimal terdiri dari 3 karakter.");
      return;
    }

    const trimmedContact = contact.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
    const isPhone = /^(\+62|62|08|\+60|\+65)[0-9\-\s]{7,14}$/.test(
      trimmedContact
    );

    if (!isEmail && !isPhone) {
      setLeadError(
        "Masukkan alamat Email yang valid atau Nomor WhatsApp aktif (contoh: 08123456789 / nama@bisnis.com)."
      );
      return;
    }

    if (businessName.trim().length < 2) {
      setLeadError("Masukkan nama toko atau bisnis UMKM Anda.");
      return;
    }

    const savedLead = submitLeadCapture({
      fullName,
      contact: trimmedContact,
      businessName,
      interestedCategory,
    });

    setLastSubmitTimestamp(now);
    setFullName("");
    setContact("");
    setBusinessName("");
    const utmSourceLabel = savedLead.utm.utm_source
      ? ` (Atribusi UTM: ${savedLead.utm.utm_source})`
      : "";
    setLeadSuccess(
      `Terima kasih ${savedLead.fullName}! Tim konsultan Kodeva akan segera menghubungi Anda di ${savedLead.contact}.${utmSourceLabel}`
    );
  };

  const sortedVisibleSections = [...sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const renderSection = (sectionId: LandingSectionId) => {
    switch (sectionId) {
      case "hero":
        return (
          <section
            key="hero"
            className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 py-16 text-white sm:py-24"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                {/* Left Copy */}
                <div className="lg:col-span-7">
                  <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>{hero.campaignBadge}</span>
                    {isPromoScheduleActive ? (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                        Aktif s/d {hero.promoEndDate}
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">
                        Terjadwal ({hero.promoStartDate} - {hero.promoEndDate})
                      </span>
                    )}
                  </div>

                  <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:leading-[1.15]">
                    {hero.title}{" "}
                    <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                      {hero.highlightText}
                    </span>
                  </h1>

                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                    {hero.subtitle}
                  </p>

                  {/* CTA Buttons with GA4 dataLayer tracking */}
                  <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                    <Link
                      href={hero.primaryCtaHref || "/catalog"}
                      onClick={() =>
                        trackLandingCtaClick(
                          hero.primaryCtaText,
                          hero.primaryCtaHref || "/catalog"
                        )
                      }
                      className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500"
                    >
                      <span>{hero.primaryCtaText}</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>

                    <a
                      href="#lead-capture"
                      onClick={() =>
                        trackLandingCtaClick(
                          hero.secondaryCtaText,
                          "#lead-capture"
                        )
                      }
                      className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-3.5 text-sm font-bold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                    >
                      <span>{hero.secondaryCtaText}</span>
                    </a>
                  </div>

                  {/* Key Metrics */}
                  <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-8">
                    {hero.stats.map((stat, i) => (
                      <div key={i}>
                        <div className="text-xl font-extrabold text-white sm:text-2xl">
                          {stat.value}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-400">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Interactive Dashboard Illustration (Zero CLS, Instant LCP for Mobile Lighthouse) */}
                <div className="lg:col-span-5">
                  <div
                    role="img"
                    aria-label={hero.heroImageAlt}
                    className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl ring-1 ring-white/10"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-rose-500" />
                        <span className="h-3 w-3 rounded-full bg-amber-400" />
                        <span className="h-3 w-3 rounded-full bg-emerald-400" />
                        <span className="ml-2 text-xs font-semibold text-slate-300">
                          Kodeva Cloud Console v4.2
                        </span>
                      </div>
                      <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                        ● Live Sync
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-800/80 p-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Store className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Omzet Kasir Hari Ini</span>
                        </div>
                        <div className="mt-1.5 text-lg font-extrabold text-white">
                          {formatCurrency(24850000, locale)}
                        </div>
                        <div className="mt-1 text-[11px] font-semibold text-emerald-400">
                          ▲ +28.4% vs minggu lalu
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-800/80 p-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Users className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Kehadiran & Shift HR</span>
                        </div>
                        <div className="mt-1.5 text-lg font-extrabold text-white">
                          64 / 65 Hadir
                        </div>
                        <div className="mt-1 text-[11px] font-semibold text-cyan-300">
                          PPh 21 TER Siap Proses
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/50 to-violet-900/50 p-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-200">
                          Status Kuota Promo Akhir Tahun
                        </span>
                        <span className="rounded bg-amber-400/20 px-2 py-0.5 font-bold text-amber-300">
                          Sisa Terbatas
                        </span>
                      </div>
                      <div className="mt-2.5 space-y-2">
                        {products.slice(0, 3).map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="truncate text-slate-300">
                              {p.name}
                            </span>
                            <span className="font-bold text-white">
                              Sisa {p.promoQuota} {p.unitLabel}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        Offline-First & Auto Backup
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                        Diedit via CMS tanpa coding
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case "featured_products":
        return (
          <section key="featured_products" className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    Produk Unggulan Campaign
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    Solusi Paling Dicari Pemilik UMKM
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Pilih paket Basic, Pro, atau Business sesuai skala usaha
                    Anda dengan kuota lisensi promo akhir tahun.
                  </p>
                </div>
                <Link
                  href="/catalog"
                  onClick={() =>
                    trackLandingCtaClick(
                      "Lihat Semua 6 Produk di Katalog",
                      "/catalog"
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <span>Lihat Semua ({products.length} Produk)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {featuredProducts.map((product) => {
                  const popularPkg =
                    product.packages.find((pk) => pk.isPopular) ??
                    product.packages[0];

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {product.categoryLabel}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              product.promoQuota <= 3
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-800"
                            }`}
                          >
                            Sisa {product.promoQuota} kuota promo
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                          {product.name}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                          {product.shortDescription}
                        </p>

                        <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                          {product.highlights.slice(0, 3).map((hl, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-4">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[11px] font-medium text-slate-400 line-through">
                              {formatCurrency(popularPkg.normalPrice, locale)}
                            </span>
                            <div className="text-xl font-extrabold text-slate-900">
                              {formatCurrency(popularPkg.promoPrice, locale)}
                              <span className="text-xs font-normal text-slate-500">
                                {" "}
                                / bln
                              </span>
                            </div>
                          </div>
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                            Paket {popularPkg.name}
                          </span>
                        </div>

                        <Link
                          href={`/catalog/${product.slug}`}
                          onClick={() =>
                            trackLandingCtaClick(
                              `Beli ${product.name}`,
                              `/catalog/${product.slug}`
                            )
                          }
                          className="mt-4 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600"
                        >
                          <span>Pilih Paket & Klaim Kuota</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case "testimonials":
        return (
          <section
            key="testimonials"
            className="border-y border-slate-200/80 bg-white py-16 sm:py-20"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Cerita Sukses UMKM
                </span>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Dipercaya Ribuan Pemilik Toko, Kafe & Perusahaan
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
                  Konten testimoni di bawah ini dapat dikelola langsung oleh tim
                  marketing melalui halaman CMS Admin.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                {testimonials.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/70 p-6"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: item.rating }).map((_, idx) => (
                          <Star
                            key={idx}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-slate-700">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    <div className="mt-6 border-t border-slate-200/80 pt-4">
                      <div className="text-sm font-bold text-slate-900">
                        {item.authorName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.authorRole} • {item.businessName} ({item.city})
                      </div>
                      <div className="mt-1.5 inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                        Pengguna {item.productUsed}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "faq":
        return (
          <section key="faq" className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  Pertanyaan yang Sering Diajukan (FAQ)
                </span>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Semua yang Perlu Anda Ketahui Tentang Lisensi Kodeva
                </h2>
              </div>

              <div className="mt-8 space-y-3">
                {faqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaqId(isOpen ? null : faq.id)
                        }
                        className="flex min-h-[52px] w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-slate-900 hover:bg-slate-50"
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                            isOpen ? "rotate-180 text-indigo-600" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-slate-100 px-5 py-4 text-xs leading-relaxed text-slate-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case "lead_capture":
        return (
          <section
            key="lead_capture"
            id="lead-capture"
            className="bg-slate-900 py-16 text-white sm:py-20"
          >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 p-6 shadow-2xl sm:p-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      Konsultasi & Demo Gratis
                    </span>
                    <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                      Masih Bingung Pilih Paket untuk Usaha Anda?
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Tinggalkan kontak Anda. Konsultan solusi UMKM kami akan
                      membantu menghitungkan kebutuhan lisensi terbaik sekaligus
                      mengamankan kuota Promo Akhir Tahun Anda.
                    </p>

                    <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Demo live 1-on-1 via Zoom / WhatsApp Call</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Bantuan migrasi data menu & karyawan gratis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>
                          Parameter UTM iklan otomatis tercatat untuk tim
                          marketing
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <form
                      onSubmit={handleLeadSubmit}
                      className="rounded-2xl bg-white p-5 text-slate-900 shadow-xl sm:p-6"
                      noValidate
                    >
                      <h3 className="text-base font-bold text-slate-900">
                        Formulir Permintaan Demo & Kuota Promo
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Data langsung tersimpan di tab Leads pada CMS Admin.
                      </p>

                      {/* Hidden Honeypot Input for Bot Spam Protection */}
                      <div className="hidden" aria-hidden="true">
                        <label htmlFor="website_url_honeypot">
                          Jangan isi kolom ini
                        </label>
                        <input
                          id="website_url_honeypot"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypotWebsite}
                          onChange={(e) => setHoneypotWebsite(e.target.value)}
                        />
                      </div>

                      <div className="mt-4 space-y-3.5">
                        <div>
                          <label
                            htmlFor="lead-name"
                            className="block text-xs font-bold text-slate-700"
                          >
                            Nama Lengkap *
                          </label>
                          <input
                            id="lead-name"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Contoh: Budi Hartono"
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="lead-contact"
                            className="block text-xs font-bold text-slate-700"
                          >
                            Nomor WhatsApp atau Email Aktif *
                          </label>
                          <input
                            id="lead-contact"
                            type="text"
                            required
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="081234567890 atau budi@tokomaju.id"
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="lead-business"
                              className="block text-xs font-bold text-slate-700"
                            >
                              Nama Toko / Bisnis *
                            </label>
                            <input
                              id="lead-business"
                              type="text"
                              required
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              placeholder="Kopi Maju Bersama"
                              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="lead-category"
                              className="block text-xs font-bold text-slate-700"
                            >
                              Solusi yang Diminati
                            </label>
                            <select
                              id="lead-category"
                              value={interestedCategory}
                              onChange={(e) =>
                                setInterestedCategory(e.target.value)
                              }
                              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                            >
                              <option value="Aplikasi Kasir (POS)">
                                Aplikasi Kasir (POS)
                              </option>
                              <option value="Aplikasi HR & Payroll">
                                Aplikasi HR & Payroll
                              </option>
                              <option value="Add-on Gudang & Akuntansi">
                                Add-on Gudang & Akuntansi
                              </option>
                              <option value="Paket Lengkap Ekosistem UMKM">
                                Paket Lengkap UMKM
                              </option>
                            </select>
                          </div>
                        </div>

                        {leadError && (
                          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                            {leadError}
                          </div>
                        )}

                        {leadSuccess && (
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                            {leadSuccess}
                          </div>
                        )}

                        <button
                          type="submit"
                          onClick={() => {
                            // Ensure current UTM is read
                            getStoredUTMParams();
                          }}
                          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                        >
                          <Send className="h-4 w-4" />
                          <span>Kirim & Dapatkan Kuota Promo</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {sortedVisibleSections.map((sec) => renderSection(sec.id))}
    </div>
  );
}
