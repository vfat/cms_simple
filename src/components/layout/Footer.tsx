import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                Kodeva UMKM Cloud
              </span>
            </div>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-400">
              Ekosistem software bisnis berlangganan untuk UMKM di Indonesia,
              Malaysia, dan Singapura. Aplikasi Kasir (POS), HRIS & Payroll
              PPh 21 TER, serta Add-on Gudang & Akuntansi dalam satu platform.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-emerald-400 ring-1 ring-slate-800">
              <ShieldCheck className="h-4 w-4" />
              <span>ISO 27001 Certified Cloud & 99.98% Uptime SLA</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Solusi Produk
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link
                  href="/catalog?category=pos"
                  className="hover:text-white transition"
                >
                  Aplikasi Kasir POS Retail & Resto
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=hr"
                  className="hover:text-white transition"
                >
                  Aplikasi HRIS, Payroll & Absensi GPS
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=addon"
                  className="hover:text-white transition"
                >
                  Add-on Omnichannel & Akuntansi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Menu & CMS Demo
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog Edukasi Bisnis UMKM
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Dashboard Admin CMS (Demo)
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition">
                  Halaman Checkout & Simulator Bayar
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 PT Kodeva Digital Nusantara. Hak Cipta Dilindungi.</p>
          <p className="mt-2 sm:mt-0">
            Technical Skill Test — Fullstack Developer (PT Digital Solusi Grup)
          </p>
        </div>
      </div>
    </footer>
  );
}
