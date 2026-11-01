"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Layers,
  Menu,
  Settings,
  ShoppingBag,
  X,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { LocaleCode } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, setIsCartOpen, locale, setLocale } = useAppStore();

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Promo Akhir Tahun" },
    { href: "/catalog", label: "Katalog Produk" },
    { href: "/blog", label: "Blog UMKM" },
    { href: "/admin", label: "CMS Admin", isBadge: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-slate-900 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Kodeva
            </span>
            <span className="ml-1.5 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              UMKM Cloud
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.isBadge && <Settings className="h-3.5 w-3.5" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Regional Currency Switcher & Cart Button */}
        <div className="flex items-center gap-2">
          {/* Regional Expansion Switcher (ID / MY / SG) */}
          <div className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
            <Globe className="h-3.5 w-3.5 text-indigo-600" />
            <label htmlFor="region-select" className="sr-only">
              Pilih Negara & Mata Uang Campaign
            </label>
            <select
              id="region-select"
              value={locale}
              onChange={(e) => setLocale(e.target.value as LocaleCode)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="id-ID">🇮🇩 ID (IDR)</option>
              <option value="ms-MY">🇲🇾 MY (MYR)</option>
              <option value="en-SG">🇸🇬 SG (SGD)</option>
            </select>
          </div>

          {/* Cart Button (Min 44x44px touch target for mobile usability) */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/40"
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="h-4 w-4 text-indigo-600" />
            <span className="hidden sm:inline">Keranjang</span>
            <span
              className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-extrabold ${
                totalCount > 0
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Buka Menu Navigasi"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.isBadge && <Settings className="h-4 w-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs font-medium text-slate-500">
              Mata Uang Regional (SEA Expansion):
            </span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as LocaleCode)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="id-ID">🇮🇩 Indonesia (IDR)</option>
              <option value="ms-MY">🇲🇾 Malaysia (MYR)</option>
              <option value="en-SG">🇸🇬 Singapore (SGD)</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
