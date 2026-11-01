# Constitution for `cms_simple` (Technical Skill Test — PT Digital Solusi Grup)

## Purpose

Konstitusi ini mendefinisikan aturan kerja, standar dokumentasi, dan perencanaan berbasis bukti (*evidence-based documentation & planning*) untuk proyek **cms_simple**.

Proyek ini dibangun untuk memenuhi spesifikasi **Technical Skill Test — Fullstack Developer (PT Digital Solusi Grup)** dengan studi kasus brand fiktif **"Kodeva"** (software bisnis UMKM berbasis lisensi berlangganan). Sistem mencakup:
1. **Website Landing Campaign + Blog (CMS)**: Konten dinamis yang dapat diedit oleh tim non-teknis.
2. **Mini Marketplace (Frontend)**: Katalog produk, detail produk, keranjang belanja dengan *shared promo quota guard*, dan alur checkout/simulasi pembayaran.
3. **Kebutuhan Marketing & Analytics**: GA4 e-commerce dataLayer tracking, retensi parameter UTM lintas-halaman, serta optimasi mobile performance (Lighthouse ≥ 80).
4. **Mandatory Documentation**: `README.md` dan `AI_LOG.md` sesuai instruksi test brief.

Baseline mengadopsi standar `ai-documentor` (AD-GF — Greenfield Flow).

---

## 1. Workspace Rules

- Ruang kerja dokumentasi dan perancangan berada di `.ai-doc/`.
- File control plane:
  - `.ai-doc/3p.md` (Progress, Plan, Pending tracker)
  - `.ai-doc/constitution.md` (Aturan dan pedoman lokal proyek)
  - `.ai-doc/project-overview.md` (Spesifikasi arsitektur & perancangan sistem greenfield)
- File deliverables wajib repository:
  - `README.md` (Setup, arsitektur, asumsi, rencana backend/payment/kuota, skor Lighthouse)
  - `AI_LOG.md` (Log penggunaan AI, 2-3 prompt efektif, minimal 2 koreksi kesalahan AI, edge case testing, kode manual)
- Artefak turunan lanjutan (`Dokumentasi-Fitur.md`, `C4-Component-Diagrams.md`, `desain-component-document/`, `desain-database-document/`, `rest-api-doc/`) **hanya dibuat bila diminta secara eksplisit oleh user** (*Only-On-Request Rule*).

---

## 2. Progress Tracking (3P)

- File `3p.md` harus selalu diperbarui setelah menyelesaikan langkah bermakna.
- Struktur standar `3p.md`:
  - `Progress`: Milestone yang telah selesai beserta bukti traceability.
  - `Plan`: Tahapan pengerjaan berikutnya yang terstruktur dan terukur.
  - `Pending`: Hal-hal yang membutuhkan konfirmasi user, keputusan arsitektur, atau unblocking.

---

## 3. Evidence Rules

- Tidak boleh mendokumentasikan klaim atau asumsi tanpa bukti.
- Pada fase Greenfield Planning:
  - Asumsi dan kebutuhan yang ambigu harus ditandai jelas (`Draft`, `Placeholder`, `Asumsi`, atau `Perlu Dikonfirmasi`) agar dapat dituangkan secara transparan di `README.md`.
- Pada fase Implementasi & Testing:
  - Setiap fungsionalitas harus dapat diverifikasi melalui file kode nyata, UI preview, dataLayer event console, atau automated test.

---

## 4. Klasifikasi Komponen & Objek

- **Boundary**:
  - Halaman & Routing (Landing Page, Blog List & Detail `/blog/[slug]`, Marketplace `/catalog`, Product Detail `/catalog/[slug]`, Cart & Checkout Modal/Page).
  - CMS Dashboard / Admin UI (untuk editing landing sections, articles, lead review).
  - API Routes / Mock API Handlers (MSW / Next API handlers untuk produk, lead capture, simulasi checkout).
  - DataLayer & Analytics Event Emitter (`window.dataLayer.push`).
- **Control**:
  - Cart State Manager & Storage Synchronizer (Zustand / React Context + `localStorage`).
  - Shared Promo Quota Validator (memastikan kuota produk promo konsisten lintas-paket dalam cart).
  - UTM Attribution Tracker (menangkap dan menyimpan query parameter UTM lintas-navigasi).
  - CMS Revalidation / Caching Controller (ISR / SWR / Client Fetch).
- **Entity**:
  - DTO & Types: `Product`, `ProductPackage`, `CartItem`, `Article`, `LeadCapture`, `OrderPayload`, `GA4EventPayload`.
- **Infrastructure**:
  - Web Framework: Next.js (App Router / TypeScript / Tailwind CSS).
  - CMS Engine: Embedded / Local Decoupled Headless CMS (misal Contentlayer / Decap / Strapi / Local JSON CMS Engine).
  - Storage: Browser LocalStorage (untuk cart & UTM session) dan Mock DB / Local File.
  - Deployment: Vercel / Netlify live demo.

---

## 5. TDD & Quality Gate

- Logika krusial (seperti validasi kuota promo bersama per produk, perhitungan subtotal/diskon, dan deduplikasi event tracking) dianjurkan memiliki unit/automated test untuk memenuhi kriteria evaluasi teknis.
- Performa Mobile wajib diaudit dengan Google Lighthouse Mobile dengan target skor Performance ≥ 80.

---

## 6. Rubrik Penilaian Wajib (5 Pilar Evaluasi PT DSG)

Seluruh anggota tim dan agen AI wajib mengawal kelima pilar penilaian ini tanpa kompromi:

### Pilar 1: Fungsionalitas & Kualitas Kode
- Seluruh fitur berjalan sesuai requirement tanpa broken link atau unhandled error.
- **Proper Strict Typing**: TypeScript strict mode, zero `any` pada props, store state, API DTO, dan analytics payload.
- **Struktur Project Rapi**: Pemisahan tegas antara presentational components, hooks, business logic, dan domain types.
- **Git Commit History**: Wajib bermakna (*semantic commits*), bertahap per fitur, dan **dilarang melakukan squash commit**.

### Pilar 2: Validasi, Error Handling & Testing
- **Form Validation**: Validasi email dan nomor WhatsApp/telepon dengan pesan error kontekstual. Proteksi spam dasar (honeypot).
- **Shared Promo Quota Guard**: Batas kuota promo wajib berlaku terhadap **total gabungan seluruh lisensi produk tersebut di keranjang**, bukan hanya per varian paket (Basic/Pro/Business).
- **Graceful States**: Wajib menangani keadaan Loading (*skeletons/spinners*), Error (*fallback / toast notifications* saat API gagal), dan Kosong (*empty cart, no product found*).
- **Automated Testing**: Menulis unit test untuk validasi kalkulasi kuota promo bersama dan subtotal harga.

### Pilar 3: Kebutuhan Marketing & Analytics
- **CMS Non-Teknis**: CMS mudah dipakai oleh tim marketing non-teknis, mendukung perubahan konten landing section dan artikel blog.
- **Revalidation Tanpa Rebuild**: Konten CMS yang dipublish langsung tampil di website tanpa deploy ulang manual (strategi caching/ISR).
- **Performa Mobile Prima**: Skor **Lighthouse Mobile Performance ≥ 80** pada landing page (optimasi gambar WebP, zero layout shift / CLS = 0).
- **Presisi Tracking GA4**: Event `view_item`, `add_to_cart`, `begin_checkout`, dan `landing_cta_click` dikirim ke `window.dataLayer` dengan format GA4 e-commerce standar, serta **wajib dilindungi dari duplikasi trigger akibat re-render komponen**.
- **Preservasi Parameter UTM**: Parameter UTM dari link masuk (Instagram/TikTok) wajib tetap tersimpan saat berpindah halaman dan otomatis diinjeksi ke payload Form Lead serta Order Checkout.

### Pilar 4: Keputusan Teknis & Rasionalitas Arsitektur
- Pemilihan stack disesuaikan dengan skala kebutuhan (*appropriate sizing*): tidak *under-engineered* (rapuh) dan tidak *over-engineered* (bikin lambat/rentan deployment crash).
- Menggunakan arsitektur yang menjamin live demo dapat diakses dan diuji oleh reviewer 24/7 tanpa risiko server microservice gratisan mengalami *sleep/cold-start*.

### Pilar 5: Dokumentasi & Integritas AI Log
- **`README.md`**: Wajib mencantumkan waktu pengerjaan aktual, cara menjalankan lokal, arsitektur & alasan stack, asumsi terhadap instruksi ambigu, evaluasi sisa pekerjaan 1 minggu ke depan, screenshot Lighthouse Mobile, serta **Rencana Arsitektur Backend** (endpoint API, webhook payment gateway ber-signature & idempotent, mitigasi race condition kuota promo dengan concurrency locking, dan alur pengiriman lisensi otomatis).
- **`AI_LOG.md`**: Wajib mendokumentasikan tools AI, 2–3 prompt paling bermanfaat, **minimal 2 contoh investigasi koreksi kesalahan/halusinasi AI**, 1 bagian kode dibantu AI beserta edge case testing-nya, dan bagian kode yang sengaja ditulis manual tanpa AI beserta alasannya.
