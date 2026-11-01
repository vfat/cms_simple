import { describe, expect, it } from "vitest";
import {
  calculateCartTotals,
  getProductTotalInCart,
  validateAndCalculateVoucher,
  validateSharedProductQuota,
} from "@/lib/quota-guard";
import { CartItem, VoucherRule } from "@/types";

const mockProduct = {
  id: "prod-pos-retail",
  name: "Kodeva POS Retail",
  promoQuota: 5,
  unitLabel: "Lisensi Outlet",
};

const createCartItem = (
  overrides: Partial<CartItem> & { packageId: "basic" | "pro" | "business"; quantity: number }
): CartItem => ({
  key: `${overrides.productId ?? "prod-pos-retail"}__${overrides.packageId}__${overrides.billingCycle ?? "monthly"}`,
  productId: overrides.productId ?? "prod-pos-retail",
  productSlug: "kodeva-pos-retail",
  productName: "Kodeva POS Retail",
  category: "pos",
  unitLabel: "Lisensi Outlet",
  packageId: overrides.packageId,
  packageName: overrides.packageId.toUpperCase(),
  billingCycle: overrides.billingCycle ?? "monthly",
  normalUnitPrice: overrides.normalUnitPrice ?? 300000,
  promoUnitPrice: overrides.promoUnitPrice ?? 200000,
  quantity: overrides.quantity,
});

describe("Shared Promo Quota Guard (validateSharedProductQuota)", () => {
  it("mengizinkan penambahan lisensi selama total produk di bawah atau sama dengan kuota promo", () => {
    const items: CartItem[] = [createCartItem({ packageId: "basic", quantity: 3 })];

    const result = validateSharedProductQuota({
      items,
      product: mockProduct,
      targetQuantityToAdd: 2,
    });

    expect(result.allowed).toBe(true);
    expect(result.currentInCartForProduct).toBe(3);
    expect(result.requestedTotalForProduct).toBe(5);
    expect(result.remainingAvailableToAdd).toBe(0);
  });

  it("MENOLAK penambahan paket berbeda (Basic + Pro + Business) dari produk yang sama jika melebihi kuota bersama", () => {
    const items: CartItem[] = [
      createCartItem({ packageId: "basic", quantity: 2 }),
      createCartItem({ packageId: "pro", quantity: 2 }),
    ];

    // Total di keranjang untuk prod-pos-retail = 4 dari kuota 5.
    // Mencoba menambah 2 lisensi paket Business (4 + 2 = 6 > 5) harus ditolak!
    const result = validateSharedProductQuota({
      items,
      product: mockProduct,
      targetQuantityToAdd: 2,
    });

    expect(result.allowed).toBe(false);
    expect(result.currentInCartForProduct).toBe(4);
    expect(result.requestedTotalForProduct).toBe(6);
    expect(result.remainingAvailableToAdd).toBe(1);
    expect(result.reason).toContain("gabungan semua paket");
  });

  it("menghitung kuota secara terpisah untuk produk yang berbeda di dalam keranjang", () => {
    const items: CartItem[] = [
      createCartItem({ productId: "prod-pos-retail", packageId: "pro", quantity: 5 }),
      createCartItem({ productId: "prod-hr-payroll", packageId: "basic", quantity: 2 }),
    ];

    expect(getProductTotalInCart(items, "prod-pos-retail")).toBe(5);
    expect(getProductTotalInCart(items, "prod-hr-payroll")).toBe(2);

    const hrResult = validateSharedProductQuota({
      items,
      product: {
        id: "prod-hr-payroll",
        name: "Kodeva HRIS",
        promoQuota: 6,
        unitLabel: "Paket Perusahaan",
      },
      targetQuantityToAdd: 4,
    });

    expect(hrResult.allowed).toBe(true);
    expect(hrResult.requestedTotalForProduct).toBe(6);
  });

  it("mendukung update kuantitas baris eksisting menggunakan excludeItemKey dengan tetap memperhitungkan paket lain", () => {
    const basicItem = createCartItem({ packageId: "basic", quantity: 2 });
    const proItem = createCartItem({ packageId: "pro", quantity: 2 });
    const items = [basicItem, proItem];

    // Mengubah proItem dari 2 menjadi 3 -> Basic (2) + Pro (3) = 5 <= 5 (Allowed)
    const validUpdate = validateSharedProductQuota({
      items,
      product: mockProduct,
      targetQuantityToAdd: 3,
      excludeItemKey: proItem.key,
    });
    expect(validUpdate.allowed).toBe(true);

    // Mengubah proItem dari 2 menjadi 4 -> Basic (2) + Pro (4) = 6 > 5 (Blocked)
    const invalidUpdate = validateSharedProductQuota({
      items,
      product: mockProduct,
      targetQuantityToAdd: 4,
      excludeItemKey: proItem.key,
    });
    expect(invalidUpdate.allowed).toBe(false);
  });

  it("menolak penambahan ketika kuota promo produk bernilai 0 (habis)", () => {
    const result = validateSharedProductQuota({
      items: [],
      product: { ...mockProduct, promoQuota: 0 },
      targetQuantityToAdd: 1,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("sudah habis");
  });
});

describe("Voucher Validation & Cart Totals Calculation", () => {
  const vouchers: VoucherRule[] = [
    {
      code: "AKHIRTAHUN10",
      description: "Diskon 10% maks 250rb",
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 300000,
      maxDiscount: 250000,
      remainingUses: 5,
    },
    {
      code: "HABIS",
      description: "Kuota habis",
      discountType: "fixed",
      discountValue: 50000,
      minPurchase: 100000,
      remainingUses: 0,
    },
  ];

  it("menghitung diskon persentase dan menghormati batas maxDiscount", () => {
    const res = validateAndCalculateVoucher("akhirtahun10", 3000000, vouchers);
    expect(res.valid).toBe(true);
    // 10% dari 3.000.000 = 300.000, tapi terbatasi maxDiscount 250.000
    expect(res.discountAmount).toBe(250000);
  });

  it("menolak voucher jika subtotal di bawah minimal belanja atau kuota habis", () => {
    const belowMin = validateAndCalculateVoucher("AKHIRTAHUN10", 200000, vouchers);
    expect(belowMin.valid).toBe(false);
    expect(belowMin.errorMessage).toContain("Minimal belanja");

    const exhausted = validateAndCalculateVoucher("HABIS", 500000, vouchers);
    expect(exhausted.valid).toBe(false);
    expect(exhausted.errorMessage).toContain("sudah habis");
  });

  it("menghitung subtotal normal, penghematan promo, diskon voucher, dan grand total dengan tepat", () => {
    const items: CartItem[] = [
      createCartItem({
        packageId: "basic",
        quantity: 2,
        normalUnitPrice: 300000,
        promoUnitPrice: 200000,
      }),
      createCartItem({
        packageId: "pro",
        quantity: 1,
        normalUnitPrice: 600000,
        promoUnitPrice: 400000,
      }),
    ];

    const summary = calculateCartTotals(items, "AKHIRTAHUN10", vouchers);
    expect(summary.totalLicenseCount).toBe(3);
    expect(summary.subtotalNormal).toBe(1200000);
    expect(summary.subtotalPromo).toBe(800000);
    expect(summary.promoSavings).toBe(400000);
    expect(summary.voucherDiscount).toBe(80000); // 10% dari 800.000
    expect(summary.grandTotal).toBe(720000);
  });
});

