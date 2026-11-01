import {
  CartItem,
  Product,
  QuotaValidationResult,
  VoucherRule,
} from "@/types";

/**
 * Menghitung total seluruh lisensi untuk `productId` yang sama di dalam keranjang,
 * lintas varian paket (Basic / Pro / Business) maupun siklus langganan (Bulanan / Tahunan).
 *
 * @param items Daftar seluruh item di dalam keranjang
 * @param productId ID produk induk yang memiliki kuota promo bersama
 * @param excludeItemKey Opsional: key baris item yang dikecualikan (saat meng-update kuantitas baris tertentu)
 */
export function getProductTotalInCart(
  items: CartItem[],
  productId: string,
  excludeItemKey?: string
): number {
  return items.reduce((sum, item) => {
    if (item.productId !== productId) return sum;
    if (excludeItemKey && item.key === excludeItemKey) return sum;
    return sum + Math.max(0, item.quantity);
  }, 0);
}

/**
 * Memvalidasi apakah penambahan atau perubahan kuantitas lisensi masih berada
 * dalam batas sisa kuota promo produk induk (`product.promoQuota`).
 *
 * Aturan Bisnis Kritis (Bagian B Brief):
 * "Jika beberapa pilihan paket dari produk yang sama menggunakan kuota promo yang sama,
 * batas kuota berlaku terhadap total lisensi produk tersebut di dalam keranjang,
 * bukan hanya terhadap masing-masing item/baris."
 */
export function validateSharedProductQuota(params: {
  items: CartItem[];
  product: Pick<Product, "id" | "name" | "promoQuota" | "unitLabel">;
  targetQuantityToAdd: number;
  excludeItemKey?: string;
}): QuotaValidationResult {
  const { items, product, targetQuantityToAdd, excludeItemKey } = params;
  const maxPromoQuota = Math.max(0, product.promoQuota);
  const currentInCartForProduct = getProductTotalInCart(
    items,
    product.id,
    excludeItemKey
  );

  if (targetQuantityToAdd <= 0) {
    return {
      allowed: false,
      productId: product.id,
      maxPromoQuota,
      currentInCartForProduct,
      requestedTotalForProduct: currentInCartForProduct,
      remainingAvailableToAdd: Math.max(
        0,
        maxPromoQuota - currentInCartForProduct
      ),
      reason: "Jumlah lisensi harus minimal 1.",
    };
  }

  if (maxPromoQuota === 0) {
    return {
      allowed: false,
      productId: product.id,
      maxPromoQuota: 0,
      currentInCartForProduct,
      requestedTotalForProduct: currentInCartForProduct + targetQuantityToAdd,
      remainingAvailableToAdd: 0,
      reason: `Kuota promo untuk ${product.name} sudah habis.`,
    };
  }

  const requestedTotalForProduct =
    currentInCartForProduct + targetQuantityToAdd;
  const remainingAvailableToAdd = Math.max(
    0,
    maxPromoQuota - currentInCartForProduct
  );

  if (requestedTotalForProduct > maxPromoQuota) {
    return {
      allowed: false,
      productId: product.id,
      maxPromoQuota,
      currentInCartForProduct,
      requestedTotalForProduct,
      remainingAvailableToAdd,
      reason: `Batas kuota promo ${product.name} adalah ${maxPromoQuota} ${product.unitLabel} (gabungan semua paket). Saat ini sudah ada ${currentInCartForProduct} di keranjang, sisa yang bisa ditambah: ${remainingAvailableToAdd}.`,
    };
  }

  return {
    allowed: true,
    productId: product.id,
    maxPromoQuota,
    currentInCartForProduct,
    requestedTotalForProduct,
    remainingAvailableToAdd: maxPromoQuota - requestedTotalForProduct,
  };
}

export interface VoucherValidationResult {
  valid: boolean;
  voucher?: VoucherRule;
  discountAmount: number;
  errorMessage?: string;
}

/**
 * Memvalidasi kode voucher terhadap minimal belanja dan sisa kuota pemakaian.
 */
export function validateAndCalculateVoucher(
  code: string,
  subtotalPromo: number,
  vouchers: VoucherRule[]
): VoucherValidationResult {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) {
    return {
      valid: false,
      discountAmount: 0,
      errorMessage: "Masukkan kode voucher terlebih dahulu.",
    };
  }

  const found = vouchers.find(
    (v) => v.code.toUpperCase() === normalizedCode
  );

  if (!found) {
    return {
      valid: false,
      discountAmount: 0,
      errorMessage: `Kode voucher "${normalizedCode}" tidak ditemukan.`,
    };
  }

  if (found.remainingUses <= 0) {
    return {
      valid: false,
      voucher: found,
      discountAmount: 0,
      errorMessage: `Kuota pemakaian voucher "${found.code}" sudah habis.`,
    };
  }

  if (subtotalPromo < found.minPurchase) {
    return {
      valid: false,
      voucher: found,
      discountAmount: 0,
      errorMessage: `Minimal belanja untuk voucher "${found.code}" adalah Rp ${found.minPurchase.toLocaleString("id-ID")}.`,
    };
  }

  let rawDiscount = 0;
  if (found.discountType === "percentage") {
    rawDiscount = Math.round((subtotalPromo * found.discountValue) / 100);
    if (found.maxDiscount && rawDiscount > found.maxDiscount) {
      rawDiscount = found.maxDiscount;
    }
  } else {
    rawDiscount = found.discountValue;
  }

  const finalDiscount = Math.min(rawDiscount, subtotalPromo);

  return {
    valid: true,
    voucher: found,
    discountAmount: finalDiscount,
  };
}

export interface CartTotalsSummary {
  totalLicenseCount: number;
  subtotalNormal: number;
  subtotalPromo: number;
  promoSavings: number;
  voucherDiscount: number;
  grandTotal: number;
}

/**
 * Menghitung ringkasan biaya keranjang belanja secara deterministik.
 */
export function calculateCartTotals(
  items: CartItem[],
  appliedVoucherCode?: string | null,
  availableVouchers: VoucherRule[] = []
): CartTotalsSummary {
  const totalLicenseCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotalNormal = items.reduce(
    (acc, i) => acc + i.normalUnitPrice * i.quantity,
    0
  );
  const subtotalPromo = items.reduce(
    (acc, i) => acc + i.promoUnitPrice * i.quantity,
    0
  );
  const promoSavings = Math.max(0, subtotalNormal - subtotalPromo);

  let voucherDiscount = 0;
  if (appliedVoucherCode && subtotalPromo > 0) {
    const voucherRes = validateAndCalculateVoucher(
      appliedVoucherCode,
      subtotalPromo,
      availableVouchers
    );
    if (voucherRes.valid) {
      voucherDiscount = voucherRes.discountAmount;
    }
  }

  const grandTotal = Math.max(0, subtotalPromo - voucherDiscount);

  return {
    totalLicenseCount,
    subtotalNormal,
    subtotalPromo,
    promoSavings,
    voucherDiscount,
    grandTotal,
  };
}

