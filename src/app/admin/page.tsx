"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  FilePlus,
  KeyRound,
  LayoutTemplate,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { slugify, formatCurrency } from "@/lib/format";
import { BlogArticle, FAQItem, TestimonialItem } from "@/types";

type AdminTab = "landing" | "blog" | "leads" | "quotas";

export default function AdminCMSPage() {
  const {
    cms,
    products,
    orders,
    locale,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateHeroContent,
    updateLandingSections,
    updateFeaturedProducts,
    upsertTestimonial,
    deleteTestimonial,
    upsertFAQ,
    deleteFAQ,
    upsertArticle,
    deleteArticle,
    updateProductQuota,
    resetAllDemoData,
  } = useAppStore();

  // Login State
  const [email, setEmail] = useState("admin@kodeva.id");
  const [password, setPassword] = useState("promo2026");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab & Notification
  const [activeTab, setActiveTab] = useState<AdminTab>("landing");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Hero Editor Local State
  const [heroDraft, setHeroDraft] = useState(cms.hero);

  // New Testimonial State
  const [newTestiName, setNewTestiName] = useState("");
  const [newTestiBusiness, setNewTestiBusiness] = useState("");
  const [newTestiCity, setNewTestiCity] = useState("");
  const [newTestiQuote, setNewTestiQuote] = useState("");
  const [newTestiProduct, setNewTestiProduct] = useState(
    products[0]?.name ?? "Kodeva POS Retail"
  );

  // New FAQ State
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  // Blog Editor State
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(
    null
  );

  const showToast = async (msg: string) => {
    setToastMsg(msg);
    try {
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: ["/", "/blog", "/catalog"] }),
      });
    } catch {
      // Ignore offline revalidation errors
    }
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(email, password);
    if (!ok) {
      setLoginError(
        "Email atau password salah. Gunakan akun demo: admin@kodeva.id / promo2026"
      );
    } else {
      setLoginError(null);
      setHeroDraft(cms.hero);
    }
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroContent(heroDraft);
    void showToast(
      "Perubahan Hero Banner berhasil disimpan & langsung tampil di Landing Page tanpa deploy ulang!"
    );
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const sorted = [...cms.sections].sort((a, b) => a.order - b.order);
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIdx];
    sorted[targetIdx] = temp;

    const reordered = sorted.map((sec, idx) => ({
      ...sec,
      order: idx + 1,
    }));
    updateLandingSections(reordered);
    void showToast("Urutan section Landing Page berhasil diperbarui!");
  };

  const toggleSectionVisibility = (id: string) => {
    const updated = cms.sections.map((sec) =>
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    );
    updateLandingSections(updated);
    void showToast("Visibilitas section Landing Page diperbarui!");
  };

  const toggleFeaturedProduct = (productId: string) => {
    const exists = cms.featuredProductIds.includes(productId);
    const nextIds = exists
      ? cms.featuredProductIds.filter((id) => id !== productId)
      : [...cms.featuredProductIds, productId];
    updateFeaturedProducts(nextIds);
    void showToast("Daftar Produk Unggulan di Landing Page diperbarui!");
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestiName.trim() || !newTestiQuote.trim()) return;
    const item: TestimonialItem = {
      id: `testi-${Date.now()}`,
      authorName: newTestiName.trim(),
      authorRole: "Owner UMKM",
      businessName: newTestiBusiness.trim() || "Mitra UMKM Kodeva",
      city: newTestiCity.trim() || "Indonesia",
      quote: newTestiQuote.trim(),
      rating: 5,
      productUsed: newTestiProduct,
    };
    upsertTestimonial(item);
    setNewTestiName("");
    setNewTestiBusiness("");
    setNewTestiCity("");
    setNewTestiQuote("");
    void showToast("Testimoni pelanggan berhasil ditambahkan!");
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const item: FAQItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
      category: "Umum",
    };
    upsertFAQ(item);
    setNewFaqQuestion("");
    setNewFaqAnswer("");
    void showToast("Pertanyaan FAQ baru berhasil ditambahkan!");
  };

  const startNewArticle = () => {
    setEditingArticle({
      id: `art-${Date.now()}`,
      slug: "",
      title: "",
      excerpt: "",
      content:
        "Tulis isi panduan bisnis UMKM di sini...\n\n### Subjudul Bagian\nJelaskan solusi praktis untuk pemilik toko atau HR perusahaan.",
      coverImage:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80",
      coverAlt: "Ilustrasi Artikel Bisnis UMKM Kodeva",
      category: "Panduan POS & Retail",
      author: "Tim Marketing Kodeva",
      publishedAt: new Date().toISOString().slice(0, 10),
      readingTimeMinutes: 4,
      status: "published",
      linkedProductIds: ["prod-pos-retail"],
      seoKeywords: ["aplikasi kasir", "umkm"],
    });
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title.trim()) return;
    const finalSlug =
      editingArticle.slug.trim() || slugify(editingArticle.title);
    upsertArticle({
      ...editingArticle,
      slug: finalSlug,
    });
    setEditingArticle(null);
    void showToast(
      `Artikel "${editingArticle.title}" berhasil disimpan (${editingArticle.status.toUpperCase()})!`
    );
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            Login CMS Marketing Kodeva
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Panel khusus tim marketing non-teknis untuk mengubah banner promo,
            urutan section, FAQ, testimoni, artikel blog, dan memantau data
            leads.
          </p>

          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs text-indigo-950">
            <div className="font-bold">Akun Demo Reviewer:</div>
            <div className="mt-1 font-mono">
              Email: <strong>admin@kodeva.id</strong>
              <br />
              Password: <strong>promo2026</strong>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-slate-700"
              >
                Email Admin
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-pass"
                className="block text-xs font-bold text-slate-700"
              >
                Password
              </label>
              <input
                id="admin-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>

            {loginError && (
              <p className="rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              <span>Masuk ke Dashboard CMS</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sortedSections = [...cms.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            ● Live CMS Connected (Zero Manual Redeploy)
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
            Kodeva Marketing CMS & Attribution Center
          </h1>
          <p className="text-xs text-slate-500">
            Terakhir diperbarui:{" "}
            {new Date(cms.lastUpdatedAt).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Lihat Landing Page</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              resetAllDemoData();
              setHeroDraft(cms.hero);
              void showToast("Seluruh data demo berhasil di-reset ke awal!");
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Data Demo</span>
          </button>
          <button
            type="button"
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-900 shadow-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("landing")}
          className={`flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "landing"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <LayoutTemplate className="h-4 w-4" />
          <span>1. Landing Page, Layout & FAQ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("blog")}
          className={`flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "blog"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>2. Artikel Blog ({cms.articles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("leads")}
          className={`flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "leads"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>3. Data Leads & UTM ({cms.leads.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("quotas")}
          className={`flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "quotas"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>4. Kuota Promo & Order ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: LANDING PAGE EDITOR */}
      {activeTab === "landing" && (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Hero & Schedule Editor */}
          <div className="space-y-6 lg:col-span-7">
            <form
              onSubmit={handleSaveHero}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-base font-extrabold text-slate-900">
                Edit Section Hero & Penjadwalan Promo
              </h2>
              <p className="text-xs text-slate-500">
                Ubah teks utama, tombol CTA, dan jadwal periode campaign tanpa
                bantuan developer.
              </p>

              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Label Badge Campaign Atas
                  </label>
                  <input
                    type="text"
                    value={heroDraft.campaignBadge}
                    onChange={(e) =>
                      setHeroDraft({
                        ...heroDraft,
                        campaignBadge: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Judul Utama (Baris 1)
                    </label>
                    <input
                      type="text"
                      value={heroDraft.title}
                      onChange={(e) =>
                        setHeroDraft({ ...heroDraft, title: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Teks Highlight Gradient
                    </label>
                    <input
                      type="text"
                      value={heroDraft.highlightText}
                      onChange={(e) =>
                        setHeroDraft({
                          ...heroDraft,
                          highlightText: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Subjudul Penjelasan
                  </label>
                  <textarea
                    rows={3}
                    value={heroDraft.subtitle}
                    onChange={(e) =>
                      setHeroDraft({ ...heroDraft, subtitle: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Teks Tombol CTA Utama
                    </label>
                    <input
                      type="text"
                      value={heroDraft.primaryCtaText}
                      onChange={(e) =>
                        setHeroDraft({
                          ...heroDraft,
                          primaryCtaText: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Teks Tombol CTA Kedua
                    </label>
                    <input
                      type="text"
                      value={heroDraft.secondaryCtaText}
                      onChange={(e) =>
                        setHeroDraft({
                          ...heroDraft,
                          secondaryCtaText: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Tanggal Mulai Promo (Jadwal Otomatis)
                    </label>
                    <input
                      type="date"
                      value={heroDraft.promoStartDate}
                      onChange={(e) =>
                        setHeroDraft({
                          ...heroDraft,
                          promoStartDate: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Tanggal Berakhir Promo
                    </label>
                    <input
                      type="date"
                      value={heroDraft.promoEndDate}
                      onChange={(e) =>
                        setHeroDraft({
                          ...heroDraft,
                          promoEndDate: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan Hero</span>
                </button>
              </div>
            </form>

            {/* Testimonials CRUD */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900">
                Kelola Testimoni Pelanggan ({cms.testimonials.length})
              </h2>

              <form
                onSubmit={handleAddTestimonial}
                className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2"
              >
                <input
                  type="text"
                  placeholder="Nama Pelanggan *"
                  value={newTestiName}
                  onChange={(e) => setNewTestiName(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Nama Toko / Usaha *"
                  value={newTestiBusiness}
                  onChange={(e) => setNewTestiBusiness(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Kota (mis: Yogyakarta)"
                  value={newTestiCity}
                  onChange={(e) => setNewTestiCity(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                />
                <select
                  value={newTestiProduct}
                  onChange={(e) => setNewTestiProduct(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <textarea
                  rows={2}
                  placeholder="Kutipan testimoni pelanggan *"
                  value={newTestiQuote}
                  onChange={(e) => setNewTestiQuote(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:col-span-2"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 sm:col-span-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Testimoni</span>
                </button>
              </form>

              <div className="mt-4 space-y-2.5">
                {cms.testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {t.authorName} — {t.businessName} ({t.city})
                      </div>
                      <p className="mt-1 text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteTestimonial(t.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Section Order, Featured Products, FAQ CRUD */}
          <div className="space-y-6 lg:col-span-5">
            {/* Bonus Feature: Layout & Urutan Section */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900">
                Urutan & Visibilitas Section Landing Page
              </h2>
              <p className="text-xs text-slate-500">
                Atur urutan tampil atau sembunyikan section tertentu dari CMS.
              </p>

              <div className="mt-4 space-y-2">
                {sortedSections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                        {idx + 1}
                      </span>
                      <span
                        className={`font-bold ${
                          sec.visible
                            ? "text-slate-900"
                            : "text-slate-400 line-through"
                        }`}
                      >
                        {sec.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, -1)}
                        className="rounded-lg p-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                        title="Geser ke Atas"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sortedSections.length - 1}
                        onClick={() => moveSection(idx, 1)}
                        className="rounded-lg p-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                        title="Geser ke Bawah"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSectionVisibility(sec.id)}
                        className={`ml-1 rounded-lg px-2 py-1 font-semibold ${
                          sec.visible
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {sec.visible ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Products Picker */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900">
                Pilih Produk Unggulan di Landing Page
              </h2>
              <div className="mt-3 space-y-2">
                {products.map((prod) => {
                  const checked = cms.featuredProductIds.includes(prod.id);
                  return (
                    <label
                      key={prod.id}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFeaturedProduct(prod.id)}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                        />
                        <span className="font-bold text-slate-800">
                          {prod.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Kuota: {prod.promoQuota}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* FAQ Manager */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900">
                Kelola Pertanyaan FAQ ({cms.faqs.length})
              </h2>

              <form onSubmit={handleAddFaq} className="mt-3 space-y-2.5">
                <input
                  type="text"
                  placeholder="Pertanyaan baru *"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <textarea
                  rows={2}
                  placeholder="Jawaban lengkap *"
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah FAQ</span>
                </button>
              </form>

              <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
                {cms.faqs.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-start justify-between gap-2 rounded-xl border border-slate-200 p-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {f.question}
                      </div>
                      <div className="mt-1 text-slate-600">{f.answer}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteFAQ(f.id)}
                      className="rounded-lg p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BLOG ARTICLES MANAGER */}
      {activeTab === "blog" && (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900">
                  Daftar Artikel ({cms.articles.length})
                </h2>
                <button
                  type="button"
                  onClick={startNewArticle}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  <FilePlus className="h-3.5 w-3.5" />
                  <span>Tulis Artikel Baru</span>
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {cms.articles.map((art) => (
                  <div
                    key={art.id}
                    className="rounded-2xl border border-slate-200 p-4 text-xs transition hover:border-indigo-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          art.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {art.status}
                      </span>
                      <span className="text-slate-400">{art.publishedAt}</span>
                    </div>

                    <div className="mt-2 font-bold text-slate-900">
                      {art.title}
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-slate-500">
                      /blog/{art.slug}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingArticle(art)}
                          className="rounded-lg bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700 hover:bg-indigo-100"
                        >
                          Edit
                        </button>
                        <Link
                          href={`/blog/${art.slug}?preview=true`}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          Preview
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteArticle(art.id)}
                        className="text-rose-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {editingArticle ? (
              <form
                onSubmit={handleSaveArticle}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Editor Artikel Blog & Tautan Produk
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Batal
                  </button>
                </div>

                <div className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700">
                      Judul Artikel *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingArticle.title}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          title: e.target.value,
                          slug: slugify(e.target.value),
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-bold text-slate-700">
                        Slug URL (Ramah SEO)
                      </label>
                      <input
                        type="text"
                        value={editingArticle.slug}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            slug: slugify(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700">
                        Status Publikasi
                      </label>
                      <select
                        value={editingArticle.status}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            status: e.target.value as "published" | "draft",
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900"
                      >
                        <option value="published">
                          Published (Tampil di Publik)
                        </option>
                        <option value="draft">
                          Draft (Hanya di Mode Preview)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-bold text-slate-700">
                        Kategori Artikel
                      </label>
                      <input
                        type="text"
                        value={editingArticle.category}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            category: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700">
                        URL Gambar Cover
                      </label>
                      <input
                        type="url"
                        value={editingArticle.coverImage}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            coverImage: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700">
                      Ringkasan Singkat (Excerpt & Meta Description)
                    </label>
                    <textarea
                      rows={2}
                      value={editingArticle.excerpt}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          excerpt: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700">
                      Isi Artikel (Gunakan &quot;### Judul&quot; untuk Subheading)
                    </label>
                    <textarea
                      rows={7}
                      value={editingArticle.content}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          content: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Product Linking Selector */}
                  <div>
                    <label className="block font-bold text-slate-700">
                      Tautkan Produk dari Marketplace ke Artikel Ini:
                    </label>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {products.map((prod) => {
                        const isLinked =
                          editingArticle.linkedProductIds.includes(prod.id);
                        return (
                          <label
                            key={prod.id}
                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
                          >
                            <input
                              type="checkbox"
                              checked={isLinked}
                              onChange={() => {
                                const next = isLinked
                                  ? editingArticle.linkedProductIds.filter(
                                      (id) => id !== prod.id
                                    )
                                  : [
                                      ...editingArticle.linkedProductIds,
                                      prod.id,
                                    ];
                                setEditingArticle({
                                  ...editingArticle,
                                  linkedProductIds: next,
                                });
                              }}
                              className="h-4 w-4 rounded text-indigo-600"
                            />
                            <span className="font-semibold text-slate-800">
                              {prod.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white hover:bg-indigo-700"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan & Publikasikan Artikel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <BookOpen className="h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-sm font-bold text-slate-800">
                  Pilih Artikel untuk Diedit atau Tulis Artikel Baru
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Setiap artikel dapat menautkan produk dari katalog marketplace
                  serta diatur status Draft maupun Published.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: LEADS INBOX WITH UTM ATTRIBUTION */}
      {activeTab === "leads" && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">
            Data Lead Capture & Atribusi UTM Kampanye ({cms.leads.length})
          </h2>
          <p className="text-xs text-slate-500">
            Seluruh pengisian form di Landing Page otomatis menyimpan parameter
            UTM dari link iklan Instagram/TikTok meskipun user sempat berpindah
            halaman.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="px-4 py-3 font-bold">Waktu</th>
                  <th className="px-4 py-3 font-bold">Nama & Kontak</th>
                  <th className="px-4 py-3 font-bold">Bisnis UMKM</th>
                  <th className="px-4 py-3 font-bold">Minat Produk</th>
                  <th className="px-4 py-3 font-bold">Atribusi UTM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cms.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(lead.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">
                        {lead.fullName}
                      </div>
                      <div className="text-indigo-600">{lead.contact}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {lead.businessName}
                    </td>
                    <td className="px-4 py-3">{lead.interestedCategory}</td>
                    <td className="px-4 py-3">
                      {lead.utm.utm_source ? (
                        <div className="space-y-0.5">
                          <span className="inline-block rounded bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-700">
                            {lead.utm.utm_source} / {lead.utm.utm_medium || "-"}
                          </span>
                          <div className="text-[11px] text-slate-500">
                            Campaign: {lead.utm.utm_campaign || "-"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">Direct / Organic</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PROMO QUOTAS & SIMULATED ORDERS */}
      {activeTab === "quotas" && (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900">
                Kontrol Kuota Lisensi Promo Produk
              </h2>
              <p className="text-xs text-slate-500">
                Ubah sisa kuota promo untuk menguji validasi Shared Quota Guard
                di Marketplace.
              </p>

              <div className="mt-4 space-y-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 p-3.5 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {prod.name}
                      </div>
                      <div className="text-slate-500">
                        Satuan: {prod.unitLabel}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={prod.promoQuota}
                        onChange={(e) =>
                          updateProductQuota(
                            prod.id,
                            parseInt(e.target.value || "0", 10)
                          )
                        }
                        className="w-16 rounded-xl border border-slate-300 px-2.5 py-1.5 text-center font-bold text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900">
                Log Order Checkout Marketplace & Payload UTM ({orders.length})
              </h2>
              <p className="text-xs text-slate-500">
                Menampilkan simulasi transaksi (Sukses & Gagal) beserta atribusi
                UTM yang terkirim pada payload order.
              </p>

              {orders.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                  Belum ada order simulasi. Silakan lakukan checkout dari
                  halaman Katalog Marketplace.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="rounded-2xl border border-slate-200 p-4 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">
                          #{ord.orderId} — {ord.customer.fullName} (
                          {ord.customer.companyName})
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                            ord.status === "SUCCESS"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      <div className="mt-2 text-slate-600">
                        Total:{" "}
                        <strong>
                          {formatCurrency(ord.grandTotal, locale)}
                        </strong>{" "}
                        • Item:{" "}
                        {ord.items
                          .map(
                            (i) =>
                              `${i.productName} (${i.packageName}) x${i.quantity}`
                          )
                          .join(", ")}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[11px]">
                        <span>
                          UTM Payload:{" "}
                          <strong className="text-indigo-700">
                            {ord.utm.utm_source
                              ? `${ord.utm.utm_source} / ${ord.utm.utm_medium} (${ord.utm.utm_campaign})`
                              : "direct / none"}
                          </strong>
                        </span>
                        {ord.licenseKeys.length > 0 && (
                          <span className="font-mono text-emerald-700">
                            Lisensi: {ord.licenseKeys.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

