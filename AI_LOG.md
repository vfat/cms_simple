# AI Usage & Engineering Verification Log (`AI_LOG.md`)

Dokumen ini mencatat secara transparan bagaimana AI tools digunakan sebagai asisten *pair-programming* selama pengerjaan **Technical Skill Test — Fullstack Developer (PT Digital Solusi Grup)**, termasuk bagaimana kesalahan/ketidaktepatan output AI dideteksi, dikoreksi, dan diverifikasi melalui pengujian.

---

## 🛠️ 1. Daftar AI Tools yang Dipakai & Peruntukannya

| AI Tool / Model | Bagian yang Dibantu | Peran Spesifik |
| :--- | :--- | :--- |
| **Antigravity / Claude (LLM Coding Assistant)** | • Scaffolding UI komponen Tailwind CSS<br>• Penyusunan dataset dummy UMKM (6 produk POS/HR/Add-on & 5 artikel blog SEO)<br>• Boilerplate form CRUD pada halaman CMS Admin (`/admin`) | Mempercepat penulisan markup JSX repetitif, tabel perbandingan fitur, serta pembuatan konten kopi marketing Bahasa Indonesia yang natural untuk UMKM. |
| **TypeScript Compiler (`tsc --noEmit`) & Vitest** | • Verifikasi kebenaran tipe (`strict: true`)<br>• Pengujian deterministik logika kuota & harga | Bertindak sebagai *quality gate* objektif untuk menolak halusinasi tipe atau bug logika aritmatika dari kode yang dihasilkan AI. |

---

## 💬 2. Tiga Contoh Prompt yang Paling Membantu

### Prompt 1 — Pembuatan Dataset Dummy Kontekstual UMKM Indonesia
> *"Buatkan dataset TypeScript ketat (`Product[]` dan `BlogArticle[]`) untuk brand SaaS UMKM bernama 'Kodeva'. Wajib terdiri dari 6 produk (2 kategori `pos` untuk retail & resto, 2 kategori `hr` untuk payroll PPh 21 TER & absensi GPS, 2 kategori `addon` untuk gudang omnichannel & akuntansi). Setiap produk harus punya `promoQuota` (antara 3 sampai 8), 3 tier paket (`basic`, `pro`, `business`) dengan `normalPrice` dan `promoPrice`, serta `comparisonTable`. Hindari penggunaan gambar eksternal berat pada komponen screenshot produk agar LCP mobile cepat."*

- **Mengapa sangat membantu**: Menghemat waktu sekitar 45 menit dalam menyusun data bisnis yang realistis dan relevan dengan skenario Head of Marketing tanpa mengorbankan performa *Largest Contentful Paint (LCP)* di perangkat mobile.

### Prompt 2 — Komponen Inspector Real-Time untuk Pembuktian GA4 & UTM
> *"Buatkan komponen floating panel `AnalyticsAndUTMProvider.tsx` di pojok kiri bawah layar yang mendengarkan custom event `kodeva:datalayer-push` dan `kodeva:utm-updated`. Panel ini harus menampilkan riwayat event yang masuk ke `window.dataLayer` beserta tombol simulasi 1-klik untuk menguji skenario pengunjung masuk dari link iklan Instagram (`?utm_source=instagram&utm_medium=paid_social`) dan TikTok (`?utm_source=tiktok&utm_medium=cpc_video`)."*

- **Mengapa sangat membantu**: Brief menyebutkan *"Tidak perlu akun GA sungguhan; cukup buktikan event terkirim"*. Dengan membuat panel *inspector* langsung di UI, tim penilai (reviewer) dapat langsung melihat bukti pengiriman event `view_item`, `add_to_cart`, `begin_checkout`, dan `landing_cta_click` tanpa harus membuka konsol DevTools manual.

### Prompt 3 — Skenario Unit Test Vitest untuk Shared Promo Quota
> *"Tuliskan rangkaian unit test Vitest (`src/lib/__tests__/quota-guard.test.ts`) untuk menguji fungsi `validateSharedProductQuota` dan `calculateCartTotals`. Pastikan ada test case eksplisit ketika user memasukkan Paket Basic (2 lisensi) dan Paket Pro (2 lisensi) dari produk yang sama yang memiliki `promoQuota = 5`, lalu mencoba menambah Paket Business sebanyak 2 lisensi (total 6 > 5) dan sistem wajib menolaknya."*

- **Mengapa sangat membantu**: Menghasilkan kerangka pengujian otomatis yang menjaga agar aturan bisnis paling krusial di Bagian B tidak rusak saat dilakukan *refactoring* UI.

---

## 🔍 3. Contoh Ketika AI Menghasilkan Implementasi yang Salah / Kurang Tepat & Cara Perbaikannya

Berikut adalah **3 kasus nyata** di mana implementasi awal yang disarankan AI tidak memenuhi spesifikasi atau mengandung bug tersembunyi, beserta proses investigasi, perbaikan, dan verifikasinya:

---

### ❌ Kasus 1: Validasi Kuota Promo Hanya Mengecek Per Baris Paket (*Line-Item*), Bukan Gabungan Produk Induk

- **Masalah pada Output Awal AI**:
  Saat diminta membuat fungsi tambah ke keranjang (`addToCart`), draf awal yang dihasilkan AI melakukan pengecekan kuota seperti ini:
  ```ts
  // KODE AWAL YANG SALAH (Hanya mengecek kuantitas pada baris paket yang sama)
  const existingItem = state.items.find(
    (i) => i.productId === productId && i.packageId === packageId
  );
  const currentQty = existingItem ? existingItem.quantity : 0;
  if (currentQty + quantity > product.promoQuota) {
    return { allowed: false, reason: "Melebihi kuota promo" };
  }
  ```
- **Bagaimana Masalah Ditemukan**:
  Saat kami melakukan tinjauan silang terhadap klausul Bagian B brief:
  > *"Jika beberapa pilihan paket dari produk yang sama menggunakan kuota promo yang sama, batas kuota berlaku terhadap total lisensi produk tersebut di dalam keranjang, bukan hanya terhadap masing-masing item/baris."*
  Dengan kode awal di atas, jika **Kodeva POS Retail** memiliki `promoQuota = 5`, pengguna bisa memasukkan **Paket Basic (4 lisensi)** lalu memilih **Paket Pro (4 lisensi)**. Karena `packageId`-nya berbeda (`basic` vs `pro`), keduanya lolos sehingga total lisensi produk tersebut menjadi **8 dari kuota 5** (*overselling bug*).
- **Bagaimana Diperbaiki**:
  Kami menulis ulang logika validasi di [`src/lib/quota-guard.ts`](file:///Users/vickyfatrian/Documents/codingan/belajar/private/cms_simple/src/lib/quota-guard.ts) dengan memisahkan fungsi agregator `getProductTotalInCart(items, productId, excludeItemKey)` yang menjumlahkan **seluruh baris item yang memiliki `productId` yang sama** tanpa memandang `packageId` maupun `billingCycle`:
  ```ts
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
  ```
- **Bagaimana Hasil Akhirnya Diverifikasi**:
  1. Diverifikasi melalui unit test Vitest pada [`src/lib/__tests__/quota-guard.test.ts`](file:///Users/vickyfatrian/Documents/codingan/belajar/private/cms_simple/src/lib/__tests__/quota-guard.test.ts) (`MENOLAK penambahan paket berbeda (Basic + Pro + Business) dari produk yang sama jika melebihi kuota bersama`).
  2. Diverifikasi di UI halaman Detail Produk & Cart Drawer: ketika 3 lisensi Basic + 2 lisensi Pro sudah masuk keranjang (total 5/5), tombol tambah untuk paket Business pada produk yang sama otomatis terkunci dan menampilkan peringatan kuota gabungan.

---

### ❌ Kasus 2: Event GA4 `view_item` Terkirim Berulang Kali Saat Komponen Re-Render & React StrictMode

- **Masalah pada Output Awal AI**:
  Pada halaman Detail Produk (`/catalog/[slug]`), AI menyarankan pemanggilan tracking `view_item` di dalam `useEffect` yang memiliki dependency terhadap state lokal halaman:
  ```ts
  // KODE AWAL YANG KURANG TEPAT (Menembak ulang view_item setiap kali user klik tombol +/- quantity!)
  useEffect(() => {
    pushGA4Event({ event: "view_item", ... });
  }, [product, selectedTier, quantity]);
  ```
- **Bagaimana Masalah Ditemukan**:
  Saat diuji di browser menggunakan panel **GA4 & UTM Inspector**, kami melihat bahwa:
  1. Ketika halaman pertama kali dibuka di mode development (React 18 `reactStrictMode: true`), `useEffect` dieksekusi 2 kali berturut-turut sehingga tercatat **2 event `view_item` identik**.
  2. Setiap kali pengguna menekan tombol `+` untuk mengubah angka jumlah lisensi sebelum klik "Tambah ke Keranjang", `view_item` kembali terkirim berulang-ulang. Hal ini melanggar instruksi Bagian C: *"Event harus merepresentasikan aksi user yang sesuai dan tidak terkirim berulang hanya karena component re-render."*
- **Bagaimana Diperbaiki**:
  1. Menghapus `quantity` dari pemicu `view_item`.
  2. Membangun mekanisme *idempotent session deduplication guard* menggunakan `viewedItemDedupeSet` di [`src/lib/analytics.ts`](file:///Users/vickyfatrian/Documents/codingan/belajar/private/cms_simple/src/lib/analytics.ts) melalui fungsi `trackViewItemOnce(product, selectedPackage, effectivePromoPrice)`.
  3. Menambahkan pembersihan standar GA4 `window.dataLayer.push({ ecommerce: null })` sebelum mendorong objek e-commerce baru agar variabel dari event sebelumnya tidak bocor (*data bleed*).
- **Bagaimana Hasil Akhirnya Diverifikasi**:
  Membuka halaman detail produk, menekan tombol `+` / `-` kuantitas berkali-kali, dan membuka/menutup Cart Drawer. Pada **GA4 & UTM Inspector**, terbukti event `view_item` hanya tercatat **tepat 1 kali** per varian produk yang dilihat.

---

### ❌ Kasus 3: Hilangnya Parameter UTM Ketika Pengunjung Berpindah Halaman Sebelum Checkout

- **Masalah pada Output Awal AI**:
  Implementasi awal membaca parameter UTM langsung menggunakan `useSearchParams()` hanya di dalam komponen `LeadForm` dan `CheckoutPage`.
- **Bagaimana Masalah Ditemukan**:
  Kami menguji skenario perjalanan user (*user journey*) sesuai brief:
  1. User masuk dari link iklan TikTok ke Landing Page: `/?utm_source=tiktok&utm_medium=cpc&utm_campaign=promo_akhir_tahun_2026`.
  2. User mengklik menu **Blog (`/blog`)** untuk membaca artikel aplikasi kasir, lalu mengklik produk ke **Katalog (`/catalog/kodeva-pos-retail`)**, dan akhirnya masuk ke **Checkout (`/checkout`)**.
  3. Pada saat tiba di `/checkout`, URL di bilah alamat browser sudah menjadi `/checkout` (tanpa query string `?utm_source=...`). Akibatnya, `useSearchParams().get('utm_source')` mengembalikan `null` dan atribusi kampanye iklan hilang!
- **Bagaimana Diperbaiki**:
  Kami memindahkan penangkapan UTM ke level layout akar (`AnalyticsAndUTMProvider.tsx`) yang memanggil `captureUTMFromSearchParams` di setiap kunjungan awal, lalu **mengunci parameter UTM tersebut ke `localStorage` (`kodeva_utm_attribution_v1`)**. Saat user mengirim form Lead atau menyelesaikan Order Checkout, sistem mengambil atribusi yang telah dikunci dari `getStoredUTMParams()`.
- **Bagaimana Hasil Akhirnya Diverifikasi**:
  Mengklik tombol **"Simulasi Link TikTok"** di panel Inspector saat berada di Beranda (`/`), berpindah ke `/blog`, lalu ke `/catalog`, memilih produk, dan menyelesaikan pembayaran di `/checkout`. Pada JSON Payload Order maupun di tabel **CMS Admin > Data Leads & UTM**, parameter `utm_source: "tiktok"` tetap terlampir secara utuh.

---

## 🧪 4. Bagian Implementasi yang Dibantu AI & Edge-Cases yang Diuji

Bagian **Kalkulasi Keranjang, Siklus Langganan (Bulanan vs Tahunan), dan Validasi Kode Voucher** (`validateAndCalculateVoucher` & `calculateCartTotals` di `src/lib/quota-guard.ts` beserta integrasinya di `CartDrawer.tsx`) dikembangkan bersama asisten AI, lalu diuji terhadap **8 skenario edge-case** berikut:

1. **Input Kode Voucher Huruf Kecil & Spasi Ekstra**: Pengguna mengetik `"  akhirtahun10 "` $\rightarrow$ dinormalisasi dengan `.trim().toUpperCase()` sehingga tetap valid.
2. **Plafon Diskon Persentase (`maxDiscount`)**: Voucher `AKHIRTAHUN10` memberikan diskon 10% dengan batas maksimum Rp 250.000. Saat total belanja Rp 3.000.000 (10% = Rp 300.000), diskon dipastikan tertahan tepat di angka **Rp 250.000**.
3. **Belanja di Bawah Minimum (`minPurchase`)**: Menggunakan `UMKMMAJU` (min. belanja Rp 500.000) saat keranjang baru berisi Rp 299.000 $\rightarrow$ ditolak dengan pesan informatif nominal minimal belanja.
4. **Penghapusan Item yang Membuat Subtotal Turun di Bawah `minPurchase`**: Ketika voucher sudah aktif lalu user mengurangi kuantitas item sehingga subtotal turun di bawah batas minimum voucher, `calculateCartTotals` otomatis mengevaluasi ulang dan mengenolkan diskon voucher agar tidak terjadi diskon ilegal.
5. **Voucher dengan Kuota Habis (`remainingUses: 0`)**: Diuji menggunakan kode `KUOTAHABIS` $\rightarrow$ sistem menolak dengan pesan bahwa kuota voucher telah habis.
6. **Diskon Tidak Pernah Membuat `grandTotal` Negatif**: Menggunakan `Math.max(0, subtotalPromo - voucherDiscount)`.
7. **Kuantitas Item Dikurangi Menjadi `0`**: Saat kuantitas baris dikurangi dari `1` menjadi `0` di Cart Drawer, item otomatis dihapus bersih dari array keranjang.
8. **Checkout Gagal Tidak Memotong Kuota Promo atau Voucher**: Saat memilih tombol **"Simulasi Bayar GAGAL"**, pesanan dicatat dengan status `FAILED`, namun `promoQuota` produk, `remainingUses` voucher, dan isi keranjang pembeli tetap utuh agar pembeli dapat mencoba bayar ulang.

---

## ✍️ 5. Bagian yang Sengaja Ditulis & Dirancang Sendiri Tanpa AI (Beserta Alasannya)

1. **Algoritma Inti `validateSharedProductQuota` dengan Parameter `excludeItemKey` (`src/lib/quota-guard.ts`)**:
   - *Alasan*: Ketika pengguna mengubah kuantitas langsung dari stepper di dalam Cart Drawer (`updateCartItemQuantity`), perhitungan sisa kuota harus mengecualikan kuantitas lama dari baris yang sedang diedit (`excludeItemKey`), tetapi **tetap menjumlahkan kuantitas dari baris paket lain pada produk yang sama**. Logika invarians ini sangat spesifik dan rawan menimbulkan *off-by-one bug* jika diserahkan bulat-bulat ke AI.
2. **Kontrak Tipe Domain (`src/types/index.ts`)**:
   - *Alasan*: Menulis definisi interface utama secara terstruktur terlebih dahulu sebelum meminta AI membuat komponen UI memastikan tidak ada penggunaan tipe `any` dan menjamin keselarasan struktur data antara CMS, Katalog, Cart, dan GA4 dataLayer.
3. **Arsitektur Integrasi Backend, Payment Webhook Security & Concurrency Quota Reservation (`README.md` Bab 6)**:
   - *Alasan*: Merancang mekanisme *Two-Phase Quota Reservation* (soft-lock TTL 15 menit saat `PENDING_PAYMENT` dan pelepasan otomatis saat `EXPIRED`), verifikasi HMAC signature, serta *idempotency lock* di database merupakan keputusan arsitektur sistem terdistribusi yang harus disesuaikan langsung dengan karakteristik bisnis lisensi promo Kodeva.
