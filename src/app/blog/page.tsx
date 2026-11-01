"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Tag,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const ARTICLES_PER_PAGE = 2;

export default function BlogListPage() {
  const { cms, products, isAdminAuthenticated } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showDraftPreview, setShowDraftPreview] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const visibleArticles = cms.articles.filter((art) => {
    const statusMatch = showDraftPreview ? true : art.status === "published";
    const categoryMatch =
      selectedCategory === "ALL" || art.category === selectedCategory;
    return statusMatch && categoryMatch;
  });

  const categories = [
    "ALL",
    ...Array.from(new Set(cms.articles.map((a) => a.category))),
  ];

  const totalPages = Math.max(
    1,
    Math.ceil(visibleArticles.length / ARTICLES_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedArticles = visibleArticles.slice(
    (safePage - 1) * ARTICLES_PER_PAGE,
    safePage * ARTICLES_PER_PAGE
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            <BookOpen className="h-3.5 w-3.5" />
            Pusat Edukasi & Blog UMKM Kodeva
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Tips Kelola Kasir, Pajak PPh 21 & Operasional Bisnis
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Artikel praktis untuk pemilik toko, kafe, dan HR perusahaan. Setiap
            artikel dapat dikelola langsung dari CMS Admin dan menautkan produk
            marketplace terkait.
          </p>
        </div>

        {/* Toggle Draft Preview Mode (Bonus Feature) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setShowDraftPreview((prev) => !prev);
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
              showDraftPreview
                ? "border-amber-400 bg-amber-50 text-amber-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>
              {showDraftPreview
                ? "Mode Preview Draft: Aktif"
                : "Tampilkan Artikel Draft (Preview)"}
            </span>
          </button>

          {isAdminAuthenticated && (
            <Link
              href="/admin"
              className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
            >
              + Tulis Artikel di CMS
            </Link>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`min-h-[40px] rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedCategory === cat
                ? "bg-slate-900 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {cat === "ALL" ? "Semua Kategori" : cat}
          </button>
        ))}
      </div>

      {/* Article Cards Grid */}
      {paginatedArticles.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-base font-bold text-slate-800">
            Belum ada artikel pada kategori ini.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Silakan pilih kategori lain atau tambahkan artikel baru melalui CMS
            Admin.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {paginatedArticles.map((article) => {
            const linkedProducts = products.filter((p) =>
              article.linkedProductIds.includes(p.id)
            );

            return (
              <article
                key={article.id}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-xl"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.coverImage}
                      alt={article.coverAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                        {article.category}
                      </span>
                      {article.status === "draft" && (
                        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold text-slate-950">
                          DRAFT PREVIEW
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {article.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {article.readingTimeMinutes} menit baca
                      </span>
                    </div>

                    <h2 className="mt-3 text-xl font-extrabold leading-snug text-slate-900 hover:text-indigo-600">
                      <Link
                        href={`/blog/${article.slug}${
                          article.status === "draft" ? "?preview=true" : ""
                        }`}
                      >
                        {article.title}
                      </Link>
                    </h2>

                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                  {/* Linked Marketplace Products Badges */}
                  {linkedProducts.length > 0 && (
                    <div className="mb-3 flex flex-wrap items-center gap-1.5">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <Tag className="h-3 w-3 text-indigo-600" />
                        Produk Terkait:
                      </span>
                      {linkedProducts.map((lp) => (
                        <Link
                          key={lp.id}
                          href={`/catalog/${lp.slug}`}
                          className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100"
                        >
                          {lp.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Oleh {article.author}
                    </span>
                    <Link
                      href={`/blog/${article.slug}${
                        article.status === "draft" ? "?preview=true" : ""
                      }`}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination Artikel Blog"
          className="mt-10 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="min-h-[42px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
          >
            ← Sebelumnya
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`min-h-[42px] min-w-[42px] rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${
                  safePage === pageNum
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="min-h-[42px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
          >
            Berikutnya →
          </button>
        </nav>
      )}
    </div>
  );
}

