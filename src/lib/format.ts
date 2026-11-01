import { BillingCycle, LocaleCode, ProductPackage } from "@/types";

const CURRENCY_CONFIG: Record<
  LocaleCode,
  { currency: string; rateFromIdr: number; label: string }
> = {
  "id-ID": { currency: "IDR", rateFromIdr: 1, label: "Indonesia (IDR)" },
  "ms-MY": { currency: "MYR", rateFromIdr: 0.00028, label: "Malaysia (MYR)" },
  "en-SG": { currency: "SGD", rateFromIdr: 0.000085, label: "Singapore (SGD)" },
};

export function formatCurrency(
  amountInIdr: number,
  locale: LocaleCode = "id-ID"
): string {
  const cfg = CURRENCY_CONFIG[locale] ?? CURRENCY_CONFIG["id-ID"];
  const converted = amountInIdr * cfg.rateFromIdr;

  if (locale === "id-ID") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.round(converted));
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cfg.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}

/**
 * Calculates effective unit price based on billing cycle.
 * Yearly cycle charges 12 months with yearlyDiscountPercent applied (e.g. 20% off annual commitment).
 */
export function calculateCyclePrice(
  pkg: ProductPackage,
  cycle: BillingCycle
): {
  normalUnitPrice: number;
  promoUnitPrice: number;
  effectiveMonthlyPromo: number;
  periodLabel: string;
} {
  if (cycle === "monthly") {
    return {
      normalUnitPrice: pkg.normalPrice,
      promoUnitPrice: pkg.promoPrice,
      effectiveMonthlyPromo: pkg.promoPrice,
      periodLabel: "/ bulan",
    };
  }

  const discountFactor = 1 - pkg.yearlyDiscountPercent / 100;
  const normalYearly = pkg.normalPrice * 12;
  const promoYearly = Math.round(pkg.promoPrice * 12 * discountFactor);
  const effectiveMonthlyPromo = Math.round(promoYearly / 12);

  return {
    normalUnitPrice: normalYearly,
    promoUnitPrice: promoYearly,
    effectiveMonthlyPromo,
    periodLabel: "/ tahun (Hemat 20%)",
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
