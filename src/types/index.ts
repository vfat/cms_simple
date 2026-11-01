export type ProductCategory = "pos" | "hr" | "addon";

export type PackageTierId = "basic" | "pro" | "business";

export type BillingCycle = "monthly" | "yearly";

export type LocaleCode = "id-ID" | "ms-MY" | "en-SG";

export interface ProductPackage {
  id: PackageTierId;
  name: string;
  description: string;
  normalPrice: number;
  promoPrice: number;
  yearlyDiscountPercent: number;
  maxUsersOrOutlets: string;
  features: string[];
  isPopular?: boolean;
}

export interface FeatureComparisonRow {
  featureName: string;
  basic: string | boolean;
  pro: string | boolean;
  business: string | boolean;
}

export interface ProductScreenshot {
  id: string;
  title: string;
  caption: string;
  accentColor: string;
  metricsPreview: {
    label: string;
    value: string;
  }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  category: ProductCategory;
  categoryLabel: string;
  badge?: string;
  isFeatured: boolean;
  promoQuota: number;
  totalQuota: number;
  unitLabel: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
  screenshots: ProductScreenshot[];
  packages: ProductPackage[];
  comparisonTable: FeatureComparisonRow[];
}

export interface CartItem {
  key: string;
  productId: string;
  productSlug: string;
  productName: string;
  category: ProductCategory;
  unitLabel: string;
  packageId: PackageTierId;
  packageName: string;
  billingCycle: BillingCycle;
  normalUnitPrice: number;
  promoUnitPrice: number;
  quantity: number;
}

export interface VoucherRule {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  remainingUses: number;
}

export interface QuotaValidationResult {
  allowed: boolean;
  productId: string;
  maxPromoQuota: number;
  currentInCartForProduct: number;
  requestedTotalForProduct: number;
  remainingAvailableToAdd: number;
  reason?: string;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_path?: string;
  captured_at?: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  whatsapp: string;
  companyName: string;
  notes?: string;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  status: "SUCCESS" | "FAILED";
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotalNormal: number;
  promoSavings: number;
  subtotalPromo: number;
  voucherCode?: string;
  voucherDiscount: number;
  grandTotal: number;
  utm: UTMParams;
  licenseKeys: string[];
}

export interface HeroContent {
  campaignBadge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  promoStartDate: string;
  promoEndDate: string;
  heroImageAlt: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  businessName: string;
  city: string;
  quote: string;
  rating: number;
  productUsed: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type LandingSectionId =
  | "hero"
  | "featured_products"
  | "testimonials"
  | "faq"
  | "lead_capture";

export interface LandingSectionConfig {
  id: LandingSectionId;
  label: string;
  visible: boolean;
  order: number;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTimeMinutes: number;
  status: "published" | "draft";
  linkedProductIds: string[];
  seoKeywords: string[];
}

export interface LeadSubmission {
  id: string;
  fullName: string;
  contact: string;
  businessName: string;
  interestedCategory: string;
  createdAt: string;
  utm: UTMParams;
}

export interface CMSStateData {
  hero: HeroContent;
  sections: LandingSectionConfig[];
  featuredProductIds: string[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  articles: BlogArticle[];
  leads: LeadSubmission[];
  lastUpdatedAt: string;
}

export type GA4EventName =
  | "view_item"
  | "add_to_cart"
  | "begin_checkout"
  | "landing_cta_click"
  | "generate_lead"
  | "purchase";

export interface GA4EcommerceItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_variant: string;
  price: number;
  quantity: number;
  coupon?: string;
}

export interface GA4DataLayerEvent {
  event: GA4EventName;
  timestamp: string;
  campaign_name: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  cta_label?: string;
  cta_destination?: string;
  ecommerce?: {
    currency: "IDR";
    value: number;
    coupon?: string;
    items: GA4EcommerceItem[];
  };
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
