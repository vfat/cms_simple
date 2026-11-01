"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  BillingCycle,
  BlogArticle,
  CartItem,
  CMSStateData,
  FAQItem,
  HeroContent,
  LandingSectionConfig,
  LeadSubmission,
  LocaleCode,
  OrderCustomerInfo,
  OrderRecord,
  PackageTierId,
  Product,
  QuotaValidationResult,
  TestimonialItem,
  VoucherRule,
} from "@/types";
import {
  INITIAL_CMS_DATA,
  INITIAL_PRODUCTS,
  INITIAL_VOUCHERS,
} from "@/data/initial-data";
import { calculateCyclePrice } from "@/lib/format";
import {
  calculateCartTotals,
  getProductTotalInCart,
  validateAndCalculateVoucher,
  validateSharedProductQuota,
} from "@/lib/quota-guard";
import {
  getStoredUTMParams,
  pushGA4Event,
  trackAddToCart,
} from "@/lib/analytics";

interface AppStoreState {
  // Hydration flag
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;

  // Regional Locale (ID, MY, SG readiness)
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;

  // Marketplace Data
  products: Product[];
  vouchers: VoucherRule[];
  orders: OrderRecord[];

  // Cart UI & Items
  items: CartItem[];
  appliedVoucherCode: string | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Cart Actions with Shared Quota Guard
  addToCart: (params: {
    productId: string;
    packageId: PackageTierId;
    billingCycle: BillingCycle;
    quantity: number;
  }) => QuotaValidationResult;
  updateCartItemQuantity: (
    itemKey: string,
    newQuantity: number
  ) => QuotaValidationResult;
  removeCartItem: (itemKey: string) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => { valid: boolean; message: string };
  removeVoucher: () => void;

  // Checkout Simulation
  simulateCheckoutOrder: (params: {
    customer: OrderCustomerInfo;
    simulateMode: "SUCCESS" | "FAILED";
  }) => {
    success: boolean;
    order?: OrderRecord;
    errorMessage?: string;
  };

  // CMS State & Actions
  cms: CMSStateData;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  updateHeroContent: (hero: HeroContent) => void;
  updateLandingSections: (sections: LandingSectionConfig[]) => void;
  updateFeaturedProducts: (productIds: string[]) => void;
  upsertTestimonial: (item: TestimonialItem) => void;
  deleteTestimonial: (id: string) => void;
  upsertFAQ: (item: FAQItem) => void;
  deleteFAQ: (id: string) => void;
  upsertArticle: (article: BlogArticle) => void;
  deleteArticle: (id: string) => void;
  submitLeadCapture: (lead: {
    fullName: string;
    contact: string;
    businessName: string;
    interestedCategory: string;
  }) => LeadSubmission;
  updateProductQuota: (productId: string, newPromoQuota: number) => void;
  resetAllDemoData: () => void;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),

      locale: "id-ID",
      setLocale: (locale) => set({ locale }),

      products: INITIAL_PRODUCTS,
      vouchers: INITIAL_VOUCHERS,
      orders: [],

      items: [],
      appliedVoucherCode: null,
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),

      addToCart: ({ productId, packageId, billingCycle, quantity }) => {
        const state = get();
        const product = state.products.find((p) => p.id === productId);
        if (!product) {
          return {
            allowed: false,
            productId,
            maxPromoQuota: 0,
            currentInCartForProduct: 0,
            requestedTotalForProduct: quantity,
            remainingAvailableToAdd: 0,
            reason: "Produk tidak ditemukan.",
          };
        }

        const pkg = product.packages.find((pk) => pk.id === packageId);
        if (!pkg) {
          return {
            allowed: false,
            productId,
            maxPromoQuota: product.promoQuota,
            currentInCartForProduct: 0,
            requestedTotalForProduct: quantity,
            remainingAvailableToAdd: 0,
            reason: "Paket produk tidak valid.",
          };
        }

        const validation = validateSharedProductQuota({
          items: state.items,
          product,
          targetQuantityToAdd: quantity,
        });

        if (!validation.allowed) {
          return validation;
        }

        const itemKey = `${productId}__${packageId}__${billingCycle}`;
        const { normalUnitPrice, promoUnitPrice } = calculateCyclePrice(
          pkg,
          billingCycle
        );

        const existingIndex = state.items.findIndex((i) => i.key === itemKey);
        let updatedItems: CartItem[];
        let trackedItem: CartItem;

        if (existingIndex >= 0) {
          const existing = state.items[existingIndex];
          const updatedItem: CartItem = {
            ...existing,
            quantity: existing.quantity + quantity,
            normalUnitPrice,
            promoUnitPrice,
          };
          updatedItems = [...state.items];
          updatedItems[existingIndex] = updatedItem;
          trackedItem = { ...updatedItem, quantity };
        } else {
          const newItem: CartItem = {
            key: itemKey,
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            category: product.category,
            unitLabel: product.unitLabel,
            packageId: pkg.id,
            packageName: pkg.name,
            billingCycle,
            normalUnitPrice,
            promoUnitPrice,
            quantity,
          };
          updatedItems = [...state.items, newItem];
          trackedItem = newItem;
        }

        set({ items: updatedItems });
        trackAddToCart(trackedItem);
        return validation;
      },

      updateCartItemQuantity: (itemKey, newQuantity) => {
        const state = get();
        const targetItem = state.items.find((i) => i.key === itemKey);
        if (!targetItem) {
          return {
            allowed: false,
            productId: "",
            maxPromoQuota: 0,
            currentInCartForProduct: 0,
            requestedTotalForProduct: 0,
            remainingAvailableToAdd: 0,
            reason: "Item tidak ditemukan di keranjang.",
          };
        }

        if (newQuantity <= 0) {
          set({
            items: state.items.filter((i) => i.key !== itemKey),
          });
          return {
            allowed: true,
            productId: targetItem.productId,
            maxPromoQuota: 0,
            currentInCartForProduct: 0,
            requestedTotalForProduct: 0,
            remainingAvailableToAdd: 0,
          };
        }

        const product = state.products.find(
          (p) => p.id === targetItem.productId
        );
        if (!product) {
          return {
            allowed: false,
            productId: targetItem.productId,
            maxPromoQuota: 0,
            currentInCartForProduct: 0,
            requestedTotalForProduct: newQuantity,
            remainingAvailableToAdd: 0,
            reason: "Produk tidak ditemukan.",
          };
        }

        const validation = validateSharedProductQuota({
          items: state.items,
          product,
          targetQuantityToAdd: newQuantity,
          excludeItemKey: itemKey,
        });

        if (!validation.allowed) {
          return validation;
        }

        set({
          items: state.items.map((item) =>
            item.key === itemKey ? { ...item, quantity: newQuantity } : item
          ),
        });

        return validation;
      },

      removeCartItem: (itemKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.key !== itemKey),
        })),

      clearCart: () => set({ items: [], appliedVoucherCode: null }),

      applyVoucher: (code) => {
        const state = get();
        const subtotalPromo = state.items.reduce(
          (sum, i) => sum + i.promoUnitPrice * i.quantity,
          0
        );
        const result = validateAndCalculateVoucher(
          code,
          subtotalPromo,
          state.vouchers
        );
        if (!result.valid || !result.voucher) {
          return {
            valid: false,
            message: result.errorMessage ?? "Voucher tidak valid.",
          };
        }
        set({ appliedVoucherCode: result.voucher.code });
        return {
          valid: true,
          message: `Voucher ${result.voucher.code} berhasil diterapkan! Hemat Rp ${result.discountAmount.toLocaleString("id-ID")}.`,
        };
      },

      removeVoucher: () => set({ appliedVoucherCode: null }),

      simulateCheckoutOrder: ({ customer, simulateMode }) => {
        const state = get();
        if (state.items.length === 0) {
          return {
            success: false,
            errorMessage: "Keranjang belanja Anda masih kosong.",
          };
        }

        // Validasi ulang seluruh kuota promo bersama sebelum finalisasi order
        for (const product of state.products) {
          const totalInCart = getProductTotalInCart(state.items, product.id);
          if (totalInCart > product.promoQuota) {
            return {
              success: false,
              errorMessage: `Kuota promo untuk ${product.name} tidak mencukupi (Tersisa: ${product.promoQuota}, di keranjang: ${totalInCart}).`,
            };
          }
        }

        const totals = calculateCartTotals(
          state.items,
          state.appliedVoucherCode,
          state.vouchers
        );
        const utm = getStoredUTMParams();
        const orderId = `KDV-${Date.now().toString().slice(-6)}`;

        if (simulateMode === "FAILED") {
          const failedOrder: OrderRecord = {
            orderId,
            createdAt: new Date().toISOString(),
            status: "FAILED",
            customer,
            items: [...state.items],
            subtotalNormal: totals.subtotalNormal,
            promoSavings: totals.promoSavings,
            subtotalPromo: totals.subtotalPromo,
            voucherCode: state.appliedVoucherCode ?? undefined,
            voucherDiscount: totals.voucherDiscount,
            grandTotal: totals.grandTotal,
            utm,
            licenseKeys: [],
          };

          set({ orders: [failedOrder, ...state.orders] });
          return {
            success: false,
            order: failedOrder,
            errorMessage:
              "Simulasi Pembayaran Gagal: Transaksi ditolak oleh bank penerbit / batas waktu pembayaran habis. Kuota lisensi Anda belum dipotong, silakan coba lagi.",
          };
        }

        // Generate serial key lisensi untuk setiap item
        const generatedLicenses: string[] = [];
        state.items.forEach((item) => {
          for (let idx = 1; idx <= item.quantity; idx++) {
            const randomSegment = Math.random()
              .toString(36)
              .substring(2, 6)
              .toUpperCase();
            generatedLicenses.push(
              `LIC-${item.packageId.toUpperCase()}-${orderId}-${idx}${randomSegment}`
            );
          }
        });

        const successOrder: OrderRecord = {
          orderId,
          createdAt: new Date().toISOString(),
          status: "SUCCESS",
          customer,
          items: [...state.items],
          subtotalNormal: totals.subtotalNormal,
          promoSavings: totals.promoSavings,
          subtotalPromo: totals.subtotalPromo,
          voucherCode: state.appliedVoucherCode ?? undefined,
          voucherDiscount: totals.voucherDiscount,
          grandTotal: totals.grandTotal,
          utm,
          licenseKeys: generatedLicenses,
        };

        // Potong kuota promo produk secara akurat
        const updatedProducts = state.products.map((prod) => {
          const boughtQty = getProductTotalInCart(state.items, prod.id);
          if (boughtQty <= 0) return prod;
          return {
            ...prod,
            promoQuota: Math.max(0, prod.promoQuota - boughtQty),
          };
        });

        // Potong kuota voucher jika ada
        const updatedVouchers = state.vouchers.map((v) => {
          if (
            state.appliedVoucherCode &&
            v.code.toUpperCase() === state.appliedVoucherCode.toUpperCase()
          ) {
            return { ...v, remainingUses: Math.max(0, v.remainingUses - 1) };
          }
          return v;
        });

        pushGA4Event({
          event: "purchase",
          campaign_name: "Promo Akhir Tahun 2026",
          ecommerce: {
            currency: "IDR",
            value: totals.grandTotal,
            coupon: state.appliedVoucherCode ?? undefined,
            items: state.items.map((item) => ({
              item_id: item.productId,
              item_name: item.productName,
              item_category: item.category,
              item_variant: `${item.packageName} (${item.billingCycle})`,
              price: item.promoUnitPrice,
              quantity: item.quantity,
            })),
          },
        });

        set({
          products: updatedProducts,
          vouchers: updatedVouchers,
          orders: [successOrder, ...state.orders],
          items: [],
          appliedVoucherCode: null,
        });

        return {
          success: true,
          order: successOrder,
        };
      },

      cms: INITIAL_CMS_DATA,
      isAdminAuthenticated: false,

      loginAdmin: (email, password) => {
        if (
          email.trim().toLowerCase() === "admin@kodeva.id" &&
          password === "promo2026"
        ) {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },

      logoutAdmin: () => set({ isAdminAuthenticated: false }),

      updateHeroContent: (hero) =>
        set((state) => ({
          cms: {
            ...state.cms,
            hero,
            lastUpdatedAt: new Date().toISOString(),
          },
        })),

      updateLandingSections: (sections) =>
        set((state) => ({
          cms: {
            ...state.cms,
            sections,
            lastUpdatedAt: new Date().toISOString(),
          },
        })),

      updateFeaturedProducts: (productIds) =>
        set((state) => ({
          cms: {
            ...state.cms,
            featuredProductIds: productIds,
            lastUpdatedAt: new Date().toISOString(),
          },
        })),

      upsertTestimonial: (item) =>
        set((state) => {
          const exists = state.cms.testimonials.some((t) => t.id === item.id);
          const testimonials = exists
            ? state.cms.testimonials.map((t) => (t.id === item.id ? item : t))
            : [item, ...state.cms.testimonials];
          return {
            cms: {
              ...state.cms,
              testimonials,
              lastUpdatedAt: new Date().toISOString(),
            },
          };
        }),

      deleteTestimonial: (id) =>
        set((state) => ({
          cms: {
            ...state.cms,
            testimonials: state.cms.testimonials.filter((t) => t.id !== id),
            lastUpdatedAt: new Date().toISOString(),
          },
        })),

      upsertFAQ: (item) =>
        set((state) => {
          const exists = state.cms.faqs.some((f) => f.id === item.id);
          const faqs = exists
            ? state.cms.faqs.map((f) => (f.id === item.id ? item : f))
            : [...state.cms.faqs, item];
          return {
            cms: {
              ...state.cms,
              faqs,
              lastUpdatedAt: new Date().toISOString(),
            },
          };
        }),

      deleteFAQ: (id) =>
        set((state) => ({
          cms: {
            ...state.cms,
            faqs: state.cms.faqs.filter((f) => f.id !== id),
            lastUpdatedAt: new Date().toISOString(),
          },
        })),

      upsertArticle: (article) =>
        set((state) => {
          const exists = state.cms.articles.some((a) => a.id === article.id);
          const articles = exists
            ? state.cms.articles.map((a) => (a.id === article.id ? article : a))
            : [article, ...state.cms.articles];
          return {
            cms: {
              ...state.cms,
              articles,
              lastUpdatedAt: new Date().toISOString(),
            },
          };
        }),

      deleteArticle: (id) =>
        set((state) => ({
          cms: {
            ...state.cms,
            articles: state.cms.articles.filter((a) => a.id !== id),
            lastUpdatedAt: new Date().toISOString(),
          },
        })),

      submitLeadCapture: ({
        fullName,
        contact,
        businessName,
        interestedCategory,
      }) => {
        const utm = getStoredUTMParams();
        const newLead: LeadSubmission = {
          id: `lead-${Date.now()}`,
          fullName: fullName.trim(),
          contact: contact.trim(),
          businessName: businessName.trim(),
          interestedCategory,
          createdAt: new Date().toISOString(),
          utm,
        };

        pushGA4Event({
          event: "generate_lead",
          campaign_name: "Promo Akhir Tahun 2026",
          cta_label: `Lead Form - ${interestedCategory}`,
        });

        set((state) => ({
          cms: {
            ...state.cms,
            leads: [newLead, ...state.cms.leads],
            lastUpdatedAt: new Date().toISOString(),
          },
        }));

        return newLead;
      },

      updateProductQuota: (productId, newPromoQuota) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? { ...p, promoQuota: Math.max(0, newPromoQuota) }
              : p
          ),
        })),

      resetAllDemoData: () =>
        set({
          products: INITIAL_PRODUCTS,
          vouchers: INITIAL_VOUCHERS,
          cms: INITIAL_CMS_DATA,
          items: [],
          appliedVoucherCode: null,
          orders: [],
        }),
    }),
    {
      name: "kodeva-app-storage-v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
