import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnalyticsAndUTMProvider } from "@/components/analytics/AnalyticsAndUTMProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export const metadata: Metadata = {
  title: {
    default:
      "Kodeva — Aplikasi Kasir POS, HRIS & Payroll UMKM | Promo Akhir Tahun 2026",
    template: "%s | Kodeva UMKM Cloud",
  },
  description:
    "Software bisnis berlangganan untuk UMKM: Aplikasi Kasir (POS) Retail & Resto, Aplikasi HR & Payroll PPh 21 TER, serta Add-on Gudang Omnichannel. Hemat hingga 45% di Promo Akhir Tahun!",
  keywords: [
    "aplikasi kasir",
    "aplikasi pos umkm",
    "aplikasi hr",
    "software payroll pph 21",
    "aplikasi absensi gps",
    "software bisnis umkm",
    "kodeva",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Kodeva UMKM Cloud",
    title:
      "Promo Akhir Tahun Kodeva — Diskon 45% Aplikasi Kasir POS & HRIS Payroll UMKM",
    description:
      "Kelola kasir, stok multi-cabang, hingga gaji & PPh 21 karyawan dalam satu platform. Kuota lisensi promo terbatas, klaim sekarang!",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Kodeva Promo Akhir Tahun — Aplikasi Kasir POS & HRIS UMKM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Promo Akhir Tahun Kodeva — Aplikasi Kasir POS & HRIS UMKM",
    description:
      "Diskon lisensi berlangganan hingga 45% untuk pemilik toko, restoran, dan bisnis UMKM.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kodeva UMKM Cloud",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android, iOS",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: "119000",
      highPrice: "749000",
      offerCount: "6",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1580",
    },
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <AnalyticsAndUTMProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </AnalyticsAndUTMProvider>
      </body>
    </html>
  );
}

