"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Link2,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  captureUTMFromSearchParams,
  clearDataLayerHistory,
  clearStoredUTMParams,
  getDataLayerHistory,
  getStoredUTMParams,
  setSimulatedUTMParams,
} from "@/lib/analytics";
import { GA4DataLayerEvent, UTMParams } from "@/types";

export function AnalyticsAndUTMProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<GA4DataLayerEvent[]>([]);
  const [utm, setUtm] = useState<UTMParams>({});

  useEffect(() => {
    const searchStr =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : "";
    const captured = captureUTMFromSearchParams(searchStr, pathname);
    setUtm(captured ?? getStoredUTMParams());
    setEvents(getDataLayerHistory());
  }, [pathname]);

  useEffect(() => {
    const handlePush = () => {
      setEvents(getDataLayerHistory());
    };
    const handleClear = () => {
      setEvents([]);
    };
    const handleUtm = () => {
      setUtm(getStoredUTMParams());
    };

    window.addEventListener("kodeva:datalayer-push", handlePush);
    window.addEventListener("kodeva:datalayer-clear", handleClear);
    window.addEventListener("kodeva:utm-updated", handleUtm);

    return () => {
      window.removeEventListener("kodeva:datalayer-push", handlePush);
      window.removeEventListener("kodeva:datalayer-clear", handleClear);
      window.removeEventListener("kodeva:utm-updated", handleUtm);
    };
  }, []);

  const simulateIG = () => {
    setSimulatedUTMParams({
      utm_source: "instagram",
      utm_medium: "paid_social",
      utm_campaign: "promo_akhir_tahun_2026",
      utm_content: "stories_pos_umkm",
      landing_path: `${pathname}?utm_source=instagram&utm_medium=paid_social&utm_campaign=promo_akhir_tahun_2026`,
    });
  };

  const simulateTikTok = () => {
    setSimulatedUTMParams({
      utm_source: "tiktok",
      utm_medium: "cpc_video",
      utm_campaign: "promo_akhir_tahun_2026",
      utm_content: "fyp_payroll_ter",
      landing_path: `${pathname}?utm_source=tiktok&utm_medium=cpc_video&utm_campaign=promo_akhir_tahun_2026`,
    });
  };

  return (
    <>
      {children}

      {/* Floating GA4 & UTM Attribution Debug Pill for Evaluator */}
      <div className="fixed bottom-4 left-4 z-40 max-w-sm">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-full bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-white shadow-lg ring-1 ring-slate-700 backdrop-blur transition hover:bg-slate-800"
            aria-label="Buka Inspector GA4 dataLayer dan Atribusi UTM"
          >
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>GA4 & UTM Inspector</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300">
              {events.length} event
            </span>
            {utm.utm_source && (
              <span className="rounded-full bg-indigo-500/30 px-2 py-0.5 text-[11px] text-indigo-200">
                UTM: {utm.utm_source}
              </span>
            )}
            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
          </button>
        ) : (
          <div className="w-[340px] sm:w-[380px] rounded-2xl border border-slate-700 bg-slate-950/95 p-4 text-xs text-slate-200 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-white">
                  GA4 dataLayer & UTM Monitor
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Tutup Inspector"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* UTM Attribution Section */}
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
                  <Link2 className="h-3.5 w-3.5" />
                  Atribusi UTM Aktif (Persistent)
                </span>
                {utm.utm_source && (
                  <button
                    type="button"
                    onClick={clearStoredUTMParams}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Reset UTM
                  </button>
                )}
              </div>

              {utm.utm_source ? (
                <div className="mt-1.5 grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-400">source:</span>{" "}
                    <strong className="text-white">{utm.utm_source}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">medium:</span>{" "}
                    <strong className="text-white">{utm.utm_medium || "-"}</strong>
                  </div>
                  <div className="col-span-2 truncate">
                    <span className="text-slate-400">campaign:</span>{" "}
                    <strong className="text-emerald-300">
                      {utm.utm_campaign || "-"}
                    </strong>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">
                  Belum ada parameter UTM di sesi ini. Klik tombol di bawah untuk
                  simulasi masuk dari iklan medsos:
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={simulateIG}
                  className="inline-flex items-center gap-1 rounded-lg bg-pink-600/20 px-2.5 py-1 text-[11px] font-medium text-pink-300 ring-1 ring-pink-500/30 hover:bg-pink-600/30"
                >
                  <Sparkles className="h-3 w-3" /> Simulasi Link IG Ads
                </button>
                <button
                  type="button"
                  onClick={simulateTikTok}
                  className="inline-flex items-center gap-1 rounded-lg bg-cyan-600/20 px-2.5 py-1 text-[11px] font-medium text-cyan-300 ring-1 ring-cyan-500/30 hover:bg-cyan-600/30"
                >
                  <Sparkles className="h-3 w-3" /> Simulasi Link TikTok
                </button>
              </div>
            </div>

            {/* DataLayer Events Log */}
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">
                  window.dataLayer ({events.length})
                </span>
                {events.length > 0 && (
                  <button
                    type="button"
                    onClick={clearDataLayerHistory}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="h-3 w-3" /> Bersihkan
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-1">
                {events.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-800 p-3 text-center text-[11px] text-slate-400">
                    Belum ada event. Coba klik CTA, buka produk, atau tambah ke
                    keranjang.
                  </p>
                ) : (
                  events.map((ev, idx) => (
                    <div
                      key={`${ev.event}-${ev.timestamp}-${idx}`}
                      className="rounded-lg border border-slate-800 bg-slate-900 p-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                          {ev.event}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(ev.timestamp).toLocaleTimeString("id-ID")}
                        </span>
                      </div>
                      {ev.ecommerce && (
                        <div className="mt-1 text-[11px] text-slate-300">
                          Value: Rp {ev.ecommerce.value.toLocaleString("id-ID")} •{" "}
                          {ev.ecommerce.items.map((i) => `${i.item_name} (${i.item_variant}) x${i.quantity}`).join(", ")}
                        </div>
                      )}
                      {ev.cta_label && (
                        <div className="mt-1 text-[11px] text-slate-300">
                          CTA: {ev.cta_label}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
