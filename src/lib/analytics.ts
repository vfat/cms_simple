import {
  CartItem,
  GA4DataLayerEvent,
  GA4EcommerceItem,
  Product,
  ProductPackage,
  UTMParams,
} from "@/types";

const UTM_STORAGE_KEY = "kodeva_utm_attribution_v1";
const DATALAYER_LOG_KEY = "kodeva_datalayer_history_v1";

/**
 * Set in-memory untuk mencegah event `view_item` terkirim ganda
 * akibat React 18 StrictMode double-mount atau component re-render.
 */
const viewedItemDedupeSet = new Set<string>();

export function captureUTMFromSearchParams(
  searchParamsString: string,
  pathname: string
): UTMParams | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(searchParamsString);
  const utm_source = params.get("utm_source") ?? undefined;
  const utm_medium = params.get("utm_medium") ?? undefined;
  const utm_campaign = params.get("utm_campaign") ?? undefined;
  const utm_content = params.get("utm_content") ?? undefined;
  const utm_term = params.get("utm_term") ?? undefined;

  const hasAnyUtm = Boolean(
    utm_source || utm_medium || utm_campaign || utm_content || utm_term
  );

  if (hasAnyUtm) {
    const newUtm: UTMParams = {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      landing_path: `${pathname}${searchParamsString ? `?${searchParamsString}` : ""}`,
      captured_at: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(newUtm));
      window.dispatchEvent(new CustomEvent("kodeva:utm-updated", { detail: newUtm }));
    } catch {
      // Ignore storage quota errors
    }
    return newUtm;
  }

  return getStoredUTMParams();
}

export function getStoredUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UTMParams;
  } catch {
    return {};
  }
}

export function setSimulatedUTMParams(utm: UTMParams): void {
  if (typeof window === "undefined") return;
  const enriched: UTMParams = {
    ...utm,
    captured_at: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(enriched));
    window.dispatchEvent(new CustomEvent("kodeva:utm-updated", { detail: enriched }));
  } catch {
    // Ignore
  }
}

export function clearStoredUTMParams(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(UTM_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("kodeva:utm-updated", { detail: {} }));
  } catch {
    // Ignore
  }
}

export function pushGA4Event(payload: Omit<GA4DataLayerEvent, "timestamp">): GA4DataLayerEvent {
  const utm = getStoredUTMParams();
  const fullEvent: GA4DataLayerEvent = {
    ...payload,
    timestamp: new Date().toISOString(),
    utm_source: payload.utm_source ?? utm.utm_source ?? "direct",
    utm_medium: payload.utm_medium ?? utm.utm_medium ?? "none",
    utm_campaign:
      payload.utm_campaign ?? utm.utm_campaign ?? "promo_akhir_tahun_2026",
  };

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    // Standar GA4: bersihkan objek ecommerce sebelumnya sebelum push event baru
    if (fullEvent.ecommerce) {
      window.dataLayer.push({ ecommerce: null });
    }
    window.dataLayer.push(fullEvent as unknown as Record<string, unknown>);

    try {
      const existingRaw = window.sessionStorage.getItem(DATALAYER_LOG_KEY);
      const existing: GA4DataLayerEvent[] = existingRaw
        ? (JSON.parse(existingRaw) as GA4DataLayerEvent[])
        : [];
      const updated = [fullEvent, ...existing].slice(0, 30);
      window.sessionStorage.setItem(DATALAYER_LOG_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }

    window.dispatchEvent(
      new CustomEvent("kodeva:datalayer-push", { detail: fullEvent })
    );
  }

  return fullEvent;
}

export function getDataLayerHistory(): GA4DataLayerEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(DATALAYER_LOG_KEY);
    return raw ? (JSON.parse(raw) as GA4DataLayerEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearDataLayerHistory(): void {
  if (typeof window === "undefined") return;
  viewedItemDedupeSet.clear();
  try {
    window.sessionStorage.removeItem(DATALAYER_LOG_KEY);
    window.dispatchEvent(new CustomEvent("kodeva:datalayer-clear"));
  } catch {
    // Ignore
  }
}

/**
 * Mengirim event GA4 `view_item` dengan proteksi anti-duplikasi re-render.
 * Hanya akan menembak 1 kali per kombinasi productId + packageId dalam sesi halaman yang sama.
 */
export function trackViewItemOnce(
  product: Product,
  selectedPackage: ProductPackage,
  effectivePromoPrice: number
): boolean {
  const dedupeKey = `${product.id}__${selectedPackage.id}`;
  if (viewedItemDedupeSet.has(dedupeKey)) {
    return false;
  }
  viewedItemDedupeSet.add(dedupeKey);

  pushGA4Event({
    event: "view_item",
    campaign_name: "Promo Akhir Tahun 2026",
    ecommerce: {
      currency: "IDR",
      value: effectivePromoPrice,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.categoryLabel,
          item_variant: selectedPackage.name,
          price: effectivePromoPrice,
          quantity: 1,
        },
      ],
    },
  });
  return true;
}

export function trackAddToCart(item: CartItem): void {
  pushGA4Event({
    event: "add_to_cart",
    campaign_name: "Promo Akhir Tahun 2026",
    ecommerce: {
      currency: "IDR",
      value: item.promoUnitPrice * item.quantity,
      items: [
        {
          item_id: item.productId,
          item_name: item.productName,
          item_category: item.category,
          item_variant: `${item.packageName} (${item.billingCycle})`,
          price: item.promoUnitPrice,
          quantity: item.quantity,
        },
      ],
    },
  });
}

export function trackBeginCheckout(
  items: CartItem[],
  grandTotal: number,
  voucherCode?: string | null
): void {
  const gaItems: GA4EcommerceItem[] = items.map((item) => ({
    item_id: item.productId,
    item_name: item.productName,
    item_category: item.category,
    item_variant: `${item.packageName} (${item.billingCycle})`,
    price: item.promoUnitPrice,
    quantity: item.quantity,
    coupon: voucherCode ?? undefined,
  }));

  pushGA4Event({
    event: "begin_checkout",
    campaign_name: "Promo Akhir Tahun 2026",
    ecommerce: {
      currency: "IDR",
      value: grandTotal,
      coupon: voucherCode ?? undefined,
      items: gaItems,
    },
  });
}

export function trackLandingCtaClick(label: string, destination: string): void {
  pushGA4Event({
    event: "landing_cta_click",
    campaign_name: "Promo Akhir Tahun 2026",
    cta_label: label,
    cta_destination: destination,
  });
}
