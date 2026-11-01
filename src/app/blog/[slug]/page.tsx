"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Share2,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { formatCurrency } from "@/lib/format";

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const { cms, products, locale } = useAppStore();

  const article = cms.articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Artikel Tidak Ditemukan
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Artikel dengan slug <code className="font-mono">{slug}</code> tidak
          tersedia atau telah dihapus.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Daftar Artikel</span>
        </Link>
      </div>
    );
  }

  const linkedProducts = products.filter((p) =>
    article.linkedProductIds.includes(p.id)
  );

  const paragraphs = article.content.split("\n\n");

  const shareText = encodeURIComponent(
    `${article.title} — Baca panduan UMKM di Kodeva Blog`
  );
  const whatsappShareUrl = `https://wa.me/?text=${shareText}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Daftar Blog UMKM</span>
      </Link>

      {article.status === "draft" && (
        <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">
          ⚠️ Mode Preview Draft: Artikel ini masih berstatus{" "}
          <strong>DRAFT</strong> di CMS dan belum tampil untuk pengunjung umum
          kecuali dipublikasikan.
        </div>
      )}

      <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-64 w-full bg-slate-100 sm:h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.coverAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold">
              {article.category}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {/* Meta Info & WhatsApp Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <User className="h-3.5 w-3.5 text-indigo-600" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {article.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readingTimeMinutes} menit baca
              </span>
            </div>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Bagikan ke WhatsApp</span>
            </a>
          </div>

          {/* Rich Text Body */}
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-slate-700 sm:text-base sm:leading-8">
            {paragraphs.map((block, index) => {
              const trimmed = block.trim();
              if (trimmed.startsWith("### ")) {
                return (
                  <h2
                    key={index}
                    className="pt-3 text-lg font-extrabold text-slate-900 sm:text-xl"
                  >
                    {trimmed.replace("### ", "")}
                  </h2>
                );
              }
              return (
                <p key={index} className="whitespace-pre-line">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* SEO Keywords & WhatsApp OpenGraph Preview Box */}
          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="text-xs font-bold text-emerald-900">
              📱 Pratinjau Tautan WhatsApp (OpenGraph Metadata Ready)
            </div>
            <div className="mt-2 flex flex-col gap-3 rounded-xl border border-emerald-200/80 bg-white p-3 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImage}
                alt={article.coverAlt}
                className="h-16 w-24 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-slate-900">
                  {article.title}
                </div>
                <div className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                  {article.excerpt}
                </div>
                <div className="mt-1 text-[10px] font-semibold text-emerald-700">
                  kodeva.id/blog/{article.slug}
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Marketplace Products (Requirement A: Artikel bisa menautkan produk dari marketplace) */}
          {linkedProducts.length > 0 && (
            <div className="mt-10 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 p-6">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                <Sparkles className="h-4 w-4" />
                <span>Rekomendasi Produk Kodeva Terkait Artikel Ini</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Klaim harga spesial Promo Akhir Tahun sebelum kuota lisensi
                habis:
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {linkedProducts.map((product) => {
                  const popularPkg =
                    product.packages.find((pk) => pk.isPopular) ??
                    product.packages[0];

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                            {product.categoryLabel}
                          </span>
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Sisa {product.promoQuota} kuota promo
                          </span>
                        </div>
                        <h3 className="mt-2 text-sm font-extrabold text-slate-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {product.tagline}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div>
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(popularPkg.normalPrice, locale)}
                          </div>
                          <div className="text-sm font-extrabold text-slate-900">
                            {formatCurrency(popularPkg.promoPrice, locale)}
                            <span className="text-[10px] font-normal text-slate-500">
                              /bln
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/catalog/${product.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Lihat Produk</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
