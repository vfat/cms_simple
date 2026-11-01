import { CMSStateData, Product, VoucherRule } from "@/types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-pos-retail",
    slug: "kodeva-pos-retail",
    name: "Kodeva POS Retail & Minimarket",
    tagline: "Kasir pintar anti-antre dengan manajemen stok barcode & multi-cabang real-time.",
    shortDescription:
      "Aplikasi kasir cloud untuk toko kelontong modern, minimarket, apotek, dan butik retail dengan fitur mode offline otomatis.",
    fullDescription:
      "Kodeva POS Retail dirancang khusus untuk pemilik UMKM retail di Indonesia yang membutuhkan kecepatan transaksi tinggi di meja kasir. Mendukung pemindaian barcode instan, harga grosir bertingkat, manajemen expired date barang, hingga sinkronisasi stok antar cabang secara otomatis.",
    category: "pos",
    categoryLabel: "Aplikasi Kasir (POS)",
    badge: "Best Seller UMKM",
    isFeatured: true,
    promoQuota: 5,
    totalQuota: 20,
    unitLabel: "Lisensi Outlet",
    rating: 4.9,
    reviewCount: 412,
    highlights: [
      "Tetap bisa transaksi walau internet mati (Offline-First Sync)",
      "Support struk WhatsApp, printer thermal Bluetooth & USB",
      "Peringatan stok menipis & barang mendekati kadaluarsa otomatis",
      "Integrasi QRIS Dinamis, EDC Bank, dan E-Wallet instan",
    ],
    screenshots: [
      {
        id: "sc-pos-1",
        title: "Layar Kasir Speed-Checkout",
        caption: "Scan ribuan SKU dalam 0.2 detik dengan shortcut keyboard & layar sentuh.",
        accentColor: "from-indigo-600 to-blue-600",
        metricsPreview: [
          { label: "Rata-rata Transaksi", value: "3.8 detik" },
          { label: "Transaksi Hari Ini", value: "Rp 18.450.000" },
          { label: "Akurasi Stok", value: "99.98%" },
        ],
      },
      {
        id: "sc-pos-2",
        title: "Kartu Stok & Harga Bertingkat",
        caption: "Atur harga eceran, grosir, dan member secara otomatis tanpa hitung manual.",
        accentColor: "from-emerald-600 to-teal-600",
        metricsPreview: [
          { label: "SKU Aktif", value: "4.280 Item" },
          { label: "Stok Kritis", value: "12 Item" },
          { label: "Margin Bersih", value: "+24.6%" },
        ],
      },
      {
        id: "sc-pos-3",
        title: "Laporan Laba Rugi Harian",
        caption: "Pantau omzet tiap shift kasir langsung dari HP pemilik bisnis.",
        accentColor: "from-violet-600 to-purple-600",
        metricsPreview: [
          { label: "Shift Kasir", value: "0 Selisih Kas" },
          { label: "Metode QRIS", value: "64% Transaksi" },
          { label: "Pertumbuhan Bulanan", value: "+31.2%" },
        ],
      },
    ],
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "Cocok untuk toko rintis 1 kasir dengan kebutuhan pencatatan kas & struk rapi.",
        normalPrice: 299000,
        promoPrice: 169000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Outlet • 2 Akun Kasir",
        features: [
          "Transaksi tanpa batas & cetak struk Bluetooth",
          "Manajemen hingga 1.500 SKU produk",
          "Laporan penjualan harian & bulanan",
          "Pembayaran Tunai & QRIS Statis",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        description: "Pilihan favorit minimarket & toko berkembang dengan manajemen stok lengkap.",
        normalPrice: 549000,
        promoPrice: 299000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Outlet • 5 Akun Kasir",
        isPopular: true,
        features: [
          "Semua fitur Basic + SKU Produk Unlimited",
          "Harga grosir bertingkat & program poin member CRM",
          "Stock opname via kamera HP & peringatan stok tipis",
          "Integrasi QRIS Dinamis otomatis & kirim struk WhatsApp",
        ],
      },
      {
        id: "business",
        name: "Business",
        description: "Solusi enterprise untuk jaringan retail multi-cabang & gudang terpusat.",
        normalPrice: 999000,
        promoPrice: 549000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Outlet • Unlimited User & API",
        features: [
          "Semua fitur Pro + Manajemen Multi-Gudang & Transfer Stok",
          "Laporan konsolidasi laba-rugi real-time",
          "Manajemen komisi sales & audit log aktivitas kasir",
          "Dedicated Account Manager & SLA dukungan prioritas 24/7",
        ],
      },
    ],
    comparisonTable: [
      { featureName: "Batas SKU Produk", basic: "1.500 SKU", pro: "Unlimited", business: "Unlimited" },
      { featureName: "Mode Offline Otomatis", basic: true, pro: true, business: true },
      { featureName: "Harga Grosir Bertingkat", basic: false, pro: true, business: true },
      { featureName: "Manajemen Poin Member (CRM)", basic: false, pro: true, business: true },
      { featureName: "Transfer Stok Antar Cabang", basic: false, pro: false, business: true },
      { featureName: "Akses Open API & Webhook", basic: false, pro: false, business: true },
    ],
  },
  {
    id: "prod-pos-resto",
    slug: "kodeva-pos-resto",
    name: "Kodeva POS FnB, Resto & Kafe",
    tagline: "Kelola meja, QR Menu Order, Kitchen Display, dan HPP resep bahan baku otomatis.",
    shortDescription:
      "Sistem kasir F&B lengkap untuk coffee shop, restoran, cloud kitchen, dan warung makan modern.",
    fullDescription:
      "Dirancang untuk operasional kuliner yang serba cepat. Pelanggan bisa pesan & bayar langsung dari meja lewat scan QR tanpa antre di kasir, pesanan langsung tampil di layar dapur (Kitchen Display System), dan stok bahan baku (gram, ml, pcs) terpotong otomatis sesuai takaran resep.",
    category: "pos",
    categoryLabel: "Aplikasi Kasir (POS)",
    badge: "Favorit Coffee Shop",
    isFeatured: true,
    promoQuota: 4,
    totalQuota: 15,
    unitLabel: "Lisensi Outlet",
    rating: 4.8,
    reviewCount: 329,
    highlights: [
      "QR Self-Order dari meja pelanggan terhubung ke QRIS",
      "Potong stok bahan baku otomatis berdasarkan komposisi resep (BOM)",
      "Pisah tagihan (Split Bill), gabung meja, dan atur modifier topping",
      "Sinkronisasi pesanan GoFood, GrabFood & ShopeeFood dalam satu layar",
    ],
    screenshots: [
      {
        id: "sc-resto-1",
        title: "Manajemen Denah Meja & Split Bill",
        caption: "Pantau status meja kosong, terisi, dan durasi makan pelanggan secara visual.",
        accentColor: "from-amber-600 to-orange-600",
        metricsPreview: [
          { label: "Meja Terisi", value: "18 / 22 Meja" },
          { label: "Waktu Saji Rata-rata", value: "7.5 Menit" },
          { label: "Food Cost Ratio", value: "31.4%" },
        ],
      },
      {
        id: "sc-resto-2",
        title: "Kitchen Display System (KDS)",
        caption: "Tiket pesanan otomatis terbagi ke layar Barista dan Dapur Utama tanpa kertas.",
        accentColor: "from-rose-600 to-pink-600",
        metricsPreview: [
          { label: "Antrean Dapur", value: "6 Pesanan Aktif" },
          { label: "Ketepatan Order", value: "99.7%" },
          { label: "Penghematan Kertas", value: "100%" },
        ],
      },
    ],
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "Untuk kedai kopi, booth minuman, atau food court skala ringkas.",
        normalPrice: 329000,
        promoPrice: 189000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Outlet • 2 Perangkat",
        features: [
          "Kasir F&B dengan varian rasa, ukuran & ekstra topping",
          "Cetak tiket pesanan ke printer dapur",
          "Manajemen kas masuk/keluar harian",
          "Laporan menu terlaris (Menu Engineering dasar)",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        description: "Solusi lengkap kafe & restoran dengan meja, resep bahan baku, dan QR Order.",
        normalPrice: 599000,
        promoPrice: 329000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Outlet • 6 Perangkat",
        isPopular: true,
        features: [
          "Semua fitur Basic + Denah Meja, Split Bill & Gabung Meja",
          "Perhitungan HPP Resep & potong bahan baku otomatis",
          "QR Table Self-Ordering untuk pelanggan",
          "Integrasi otomatis GoFood, GrabFood & ShopeeFood",
        ],
      },
      {
        id: "business",
        name: "Business",
        description: "Untuk jaringan restoran multi-outlet dengan Central Kitchen.",
        normalPrice: 1099000,
        promoPrice: 599000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Outlet • Unlimited Perangkat & KDS",
        features: [
          "Semua fitur Pro + Modul Layar Kitchen Display System (KDS)",
          "Manajemen produksi Central Kitchen & distribusi setengah jadi",
          "Analitik Food Cost vs Theoretical Cost anti-kebocoran",
          "Dukungan onboarding di lokasi & prioritas teknis 24/7",
        ],
      },
    ],
    comparisonTable: [
      { featureName: "Modifier & Ekstra Topping", basic: true, pro: true, business: true },
      { featureName: "Denah Meja & Split Bill", basic: false, pro: true, business: true },
      { featureName: "HPP Resep Bahan Baku (Gramasi)", basic: false, pro: true, business: true },
      { featureName: "QR Meja Self-Order", basic: false, pro: true, business: true },
      { featureName: "Central Kitchen Production", basic: false, pro: false, business: true },
    ],
  },
  {
    id: "prod-hr-payroll",
    slug: "kodeva-hr-payroll",
    name: "Kodeva HRIS & Auto-Payroll PPh 21",
    tagline: "Hitung gaji, lembur, BPJS, dan pajak TER PPh 21 ratusan karyawan dalam 3 menit.",
    shortDescription:
      "Software HR & Payroll otomatis sesuai regulasi Kemnaker & DJP terbaru untuk UMKM hingga perusahaan berkembang.",
    fullDescription:
      "Hilangkan drama hitung gaji pakai spreadsheet setiap akhir bulan. Kodeva HRIS menghitung gaji pokok, uang makan berbasis kehadiran, insentif shift, potongan keterlambatan, BPJS Kesehatan/Ketenagakerjaan, hingga tarif efektif rata-rata (TER) PPh 21 secara presisi dan langsung mengirim slip gaji digital ke HP karyawan.",
    category: "hr",
    categoryLabel: "Aplikasi HR & Payroll",
    badge: "Promo Akhir Tahun",
    isFeatured: true,
    promoQuota: 6,
    totalQuota: 25,
    unitLabel: "Paket Perusahaan",
    rating: 4.9,
    reviewCount: 278,
    highlights: [
      "Kalkulasi otomatis PPh 21 metode TER terbaru & BPJS",
      "Disbursement transfer gaji ke seluruh bank dalam 1 klik",
      "Portal ESS (Employee Self-Service) untuk pengajuan cuti, izin & klaim",
      "Pengiriman slip gaji PDF ber-password via Email & WhatsApp",
    ],
    screenshots: [
      {
        id: "sc-hr-1",
        title: "One-Click Payroll Run",
        caption: "Tarik data absensi, lembur, dan kasbon karyawan langsung menjadi tabel penggajian.",
        accentColor: "from-blue-600 to-cyan-600",
        metricsPreview: [
          { label: "Waktu Proses Gaji", value: "2 Menit 40 Detik" },
          { label: "Kepatuhan PPh 21 TER", value: "100% Akurat" },
          { label: "Slip Terkirim", value: "100% Otomatis" },
        ],
      },
      {
        id: "sc-hr-2",
        title: "Portal Karyawan Mandiri (ESS)",
        caption: "Karyawan ajukan cuti, tukar shift, dan klaim reimbursement dari HP masing-masing.",
        accentColor: "from-indigo-600 to-violet-600",
        metricsPreview: [
          { label: "Approval Cuti", value: "< 15 Menit" },
          { label: "Hemat Kertas HR", value: "95%" },
          { label: "Kepuasan Tim", value: "4.9 / 5.0" },
        ],
      },
    ],
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "Untuk tim kecil hingga 25 karyawan yang ingin rapikan slip gaji & cuti.",
        normalPrice: 399000,
        promoPrice: 219000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "Hingga 25 Karyawan Aktif",
        features: [
          "Database karyawan & pengingat kontrak habis (PKWT)",
          "Kalkulasi gaji pokok, tunjangan & potongan otomatis",
          "Manajemen pengajuan cuti & izin berjenjang",
          "Slip gaji digital via aplikasi & WhatsApp",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        description: "Untuk bisnis hingga 75 karyawan dengan kalkulasi lembur, BPJS & pajak PPh 21.",
        normalPrice: 749000,
        promoPrice: 399000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "Hingga 75 Karyawan Aktif",
        isPopular: true,
        features: [
          "Semua fitur Basic + Kalkulasi PPh 21 TER & BPJS Otomatis",
          "Rumus lembur Kemnaker & insentif performa kustom",
          "Manajemen kasbon/pinjaman karyawan dengan potong gaji otomatis",
          "Ekspor file CSV batch payroll untuk BCA, Mandiri, BRI, BNI",
        ],
      },
      {
        id: "business",
        name: "Business",
        description: "Untuk perusahaan hingga 200 karyawan dengan KPI, multi-cabang & integrasi akuntansi.",
        normalPrice: 1399000,
        promoPrice: 749000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "Hingga 200 Karyawan Aktif",
        features: [
          "Semua fitur Pro + Modul Penilaian KPI & OKR Karyawan",
          "Multi-NPWP pemotong pajak untuk bisnis multi-entitas",
          "Jurnal gaji otomatis ke software akuntansi",
          "Konsultasi setup struktur komponen gaji bersama spesialis HR",
        ],
      },
    ],
    comparisonTable: [
      { featureName: "Kapasitas Karyawan", basic: "Maks 25", pro: "Maks 75", business: "Maks 200" },
      { featureName: "Slip Gaji WhatsApp & PDF", basic: true, pro: true, business: true },
      { featureName: "Hitung Otomatis PPh 21 TER & BPJS", basic: false, pro: true, business: true },
      { featureName: "Manajemen Kasbon & Cicilan", basic: false, pro: true, business: true },
      { featureName: "Modul Evaluasi KPI & OKR", basic: false, pro: false, business: true },
    ],
  },
  {
    id: "prod-hr-attendance",
    slug: "kodeva-hr-absensi-gps",
    name: "Kodeva Smart Attendance Face & GPS",
    tagline: "Absensi selfie AI anti-fake GPS & penjadwalan shift otomatis untuk staf lapangan.",
    shortDescription:
      "Aplikasi absensi mobile dengan pengenalan wajah (Liveness Detection) dan pembatasan radius lokasi kantor/outlet.",
    fullDescription:
      "Solusi praktis pengganti mesin fingerprint fisik yang sering rusak. Staf cukup absen lewat smartphone di titik koordinat outlet atau lokasi kunjungan klien, dilengkapi deteksi kedipan mata (Anti-Foto) dan blokir aplikasi Fake GPS secara real-time.",
    category: "hr",
    categoryLabel: "Aplikasi HR & Payroll",
    isFeatured: false,
    promoQuota: 8,
    totalQuota: 30,
    unitLabel: "Paket Lokasi",
    rating: 4.8,
    reviewCount: 194,
    highlights: [
      "Biometrik wajah AI dengan Liveness Detection (anti titip absen)",
      "Geofencing radius GPS per cabang & tracking kunjungan sales",
      "Susun jadwal shift berputar (roaster) dengan drag-and-drop",
      "Tersambung langsung ke perhitungan uang kehadiran Kodeva HRIS",
    ],
    screenshots: [
      {
        id: "sc-att-1",
        title: "Peta Kehadiran Real-Time",
        caption: "Pantau siapa yang sudah hadir, terlambat, atau sedang dinas luar di seluruh cabang.",
        accentColor: "from-teal-600 to-emerald-600",
        metricsPreview: [
          { label: "Hadir Tepat Waktu", value: "96.4%" },
          { label: "Deteksi Fake GPS", value: "Diblokir 100%" },
          { label: "Verifikasi Wajah", value: "0.4 Detik" },
        ],
      },
    ],
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "Absensi GPS & selfie untuk 1 lokasi outlet/kantor.",
        normalPrice: 199000,
        promoPrice: 119000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Titik Lokasi • 25 Staf",
        features: [
          "Absensi Selfie + Geotagging GPS",
          "Pengaturan jam kerja tetap (Reguler)",
          "Rekap keterlambatan & jam kerja otomatis",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        description: "Untuk bisnis multi-shift dengan proteksi Anti-Fake GPS & Face Recognition.",
        normalPrice: 399000,
        promoPrice: 229000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "5 Titik Lokasi • 75 Staf",
        isPopular: true,
        features: [
          "Semua fitur Basic + AI Liveness Face Recognition",
          "Proteksi blokir Fake GPS & Mock Location",
          "Manajemen jadwal multi-shift & tukar shift karyawan",
          "Live tracking kunjungan tim sales lapangan",
        ],
      },
      {
        id: "business",
        name: "Business",
        description: "Untuk operasional nasional dengan lokasi tak terbatas.",
        normalPrice: 749000,
        promoPrice: 419000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "Unlimited Lokasi • 200 Staf",
        features: [
          "Semua fitur Pro + Titik Geofencing Tak Terbatas",
          "Mode Kiosk Tablet di pintu masuk outlet",
          "Integrasi Webhook & sinkronisasi otomatis ke Payroll",
        ],
      },
    ],
    comparisonTable: [
      { featureName: "Titik Geofencing Lokasi", basic: "1 Lokasi", pro: "5 Lokasi", business: "Unlimited" },
      { featureName: "AI Liveness Detection", basic: false, pro: true, business: true },
      { featureName: "Anti-Fake GPS Guard", basic: false, pro: true, business: true },
      { featureName: "Mode Kiosk Tablet Bersama", basic: false, pro: false, business: true },
    ],
  },
  {
    id: "prod-addon-inventory",
    slug: "kodeva-addon-inventory",
    name: "Kodeva Multi-Warehouse & Omnichannel Sync",
    tagline: "Sinkronkan stok toko fisik dengan Tokopedia, Shopee, dan TikTok Shop secara instan.",
    shortDescription:
      "Add-on manajemen gudang & sinkronisasi stok marketplace agar terhindar dari penalti pesanan batal akibat stok kosong.",
    fullDescription:
      "Ketika barang terjual di kasir toko fisik Kodeva POS, stok di Tokopedia, Shopee, dan TikTok Shop otomatis berkurang dalam hitungan detik. Dilengkapi manajemen Purchase Order (PO) ke supplier, nomor batch/lot, dan analisis perputaran barang (fast vs slow moving).",
    category: "addon",
    categoryLabel: "Add-on Pendukung",
    badge: "Sisa Kuota Terbatas",
    isFeatured: false,
    promoQuota: 3,
    totalQuota: 10,
    unitLabel: "Lisensi Gudang",
    rating: 4.9,
    reviewCount: 156,
    highlights: [
      "Real-time stock sync ke Shopee, Tokopedia, TikTok Shop & Lazada",
      "Otomatis buat Purchase Order (PO) saat stok mencapai batas minimum",
      "Pelacakan nomor Batch, Serial Number, dan tanggal kadaluarsa (FEFO)",
      "Analitik barang mati (Dead Stock) dan rekomendasi restock AI",
    ],
    screenshots: [
      {
        id: "sc-inv-1",
        title: "Omnichannel Inventory Hub",
        caption: "Satu stok pusat untuk melayani toko offline dan seluruh marketplace sekaligus.",
        accentColor: "from-purple-600 to-indigo-600",
        metricsPreview: [
          { label: "Kecepatan Sync", value: "1.2 Detik" },
          { label: "Insiden Overselling", value: "0 Kasus" },
          { label: "Efisiensi Gudang", value: "+42%" },
        ],
      },
    ],
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "Sinkronisasi stok POS dengan 2 toko marketplace.",
        normalPrice: 249000,
        promoPrice: 149000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Gudang • 2 Toko Marketplace",
        features: [
          "Sinkronisasi stok dua arah dengan Kodeva POS",
          "Integrasi hingga 2 akun marketplace",
          "Manajemen Purchase Order (PO) supplier",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        description: "Untuk seller aktif dengan multi-marketplace & pelacakan batch.",
        normalPrice: 449000,
        promoPrice: 249000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "3 Gudang • 6 Toko Marketplace",
        isPopular: true,
        features: [
          "Semua fitur Basic + Integrasi 6 akun marketplace",
          "Manajemen Batch / Expired Date (FEFO/FIFO)",
          "Cetak label pengiriman resi massal",
          "Rekomendasi jumlah restock mingguan otomatis",
        ],
      },
      {
        id: "business",
        name: "Business",
        description: "Manajemen rantai pasok penuh untuk distributor & grosir besar.",
        normalPrice: 849000,
        promoPrice: 469000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "Unlimited Gudang & Marketplace",
        features: [
          "Semua fitur Pro + Gudang & Toko Marketplace Unlimited",
          "Manajemen rak gudang (Bin Location) & Barcode Scanner PDA",
          "Portal penagihan hutang dagang supplier (Accounts Payable)",
        ],
      },
    ],
    comparisonTable: [
      { featureName: "Koneksi Toko Marketplace", basic: "2 Toko", pro: "6 Toko", business: "Unlimited" },
      { featureName: "Manajemen Expired Date (FEFO)", basic: false, pro: true, business: true },
      { featureName: "Rekomendasi Restock Otomatis", basic: false, pro: true, business: true },
      { featureName: "Manajemen Rak (Bin Location)", basic: false, pro: false, business: true },
    ],
  },
  {
    id: "prod-addon-accounting",
    slug: "kodeva-addon-accounting",
    name: "Kodeva Instant Accounting & Tax Bridge",
    tagline: "Ubah transaksi kasir & penggajian menjadi jurnal akuntansi, neraca, dan laporan pajak instan.",
    shortDescription:
      "Add-on pembukuan otomatis tanpa perlu mengerti debit-kredit, siap untuk pelaporan pajak UMKM dan pengajuan kredit bank.",
    fullDescription:
      "Tidak perlu lagi input ulang struk penjualan atau beban gaji di akhir bulan. Setiap transaksi di Kodeva POS dan Kodeva HRIS langsung tercatat sebagai jurnal buku besar, laporan arus kas, neraca keuangan, serta perhitungan PPh Final UMKM 0,5% maupun PPN.",
    category: "addon",
    categoryLabel: "Add-on Pendukung",
    isFeatured: false,
    promoQuota: 7,
    totalQuota: 20,
    unitLabel: "Lisensi Bisnis",
    rating: 4.9,
    reviewCount: 211,
    highlights: [
      "Auto-jurnal dari transaksi POS, HPP persediaan, dan beban Payroll",
      "Laporan Laba Rugi, Neraca, dan Arus Kas standar SAK EMKM",
      "Rekonsiliasi mutasi rekening bank BCA, Mandiri, BRI otomatis",
      "Ekspor e-Faktur Pajak & rekap PPh Final UMKM 0,5% siap lapor",
    ],
    screenshots: [
      {
        id: "sc-acc-1",
        title: "Neraca & Laba Rugi Real-Time",
        caption: "Laporan keuangan selalu siap kapan saja dibutuhkan untuk evaluasi atau pinjaman modal.",
        accentColor: "from-emerald-600 to-cyan-600",
        metricsPreview: [
          { label: "Jurnal Otomatis", value: "100% Tanpa Input" },
          { label: "Tutup Buku Bulanan", value: "< 5 Menit" },
          { label: "Standar Laporan", value: "SAK EMKM" },
        ],
      },
    ],
    packages: [
      {
        id: "basic",
        name: "Basic",
        description: "Pembukuan otomatis laba-rugi & arus kas untuk UMKM mandiri.",
        normalPrice: 229000,
        promoPrice: 129000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Entitas Bisnis • 2 User",
        features: [
          "Jurnal otomatis dari penjualan Kodeva POS",
          "Laporan Laba Rugi & Arus Kas instan",
          "Perhitungan pajak UMKM PPh Final 0,5%",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        description: "Akuntansi lengkap dengan neraca, aset tetap, dan rekonsiliasi bank.",
        normalPrice: 429000,
        promoPrice: 239000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "1 Entitas Bisnis • 5 User",
        isPopular: true,
        features: [
          "Semua fitur Basic + Laporan Neraca & Buku Besar",
          "Penyusutan aset tetap (mesin, kendaraan, inventaris) otomatis",
          "Rekonsiliasi pintar mutasi rekening bank",
          "Integrasi beban gaji dari Kodeva HRIS",
        ],
      },
      {
        id: "business",
        name: "Business",
        description: "Untuk bisnis PKP dengan multi-cabang cost center & ekspor e-Faktur.",
        normalPrice: 799000,
        promoPrice: 449000,
        yearlyDiscountPercent: 20,
        maxUsersOrOutlets: "Multi-Cabang Cost Center • Unlimited User",
        features: [
          "Semua fitur Pro + Laporan Laba Rugi per Cabang / Proyek",
          "Manajemen PPN & ekspor CSV e-Faktur DJP",
          "Akses khusus untuk Akuntan Eksternal / Konsultan Pajak",
        ],
      },
    ],
    comparisonTable: [
      { featureName: "Jurnal Penjualan POS Otomatis", basic: true, pro: true, business: true },
      { featureName: "Laporan Neraca & Penyusutan Aset", basic: false, pro: true, business: true },
      { featureName: "Rekonsiliasi Mutasi Bank", basic: false, pro: true, business: true },
      { featureName: "Ekspor CSV e-Faktur PKP", basic: false, pro: false, business: true },
    ],
  },
];

export const INITIAL_VOUCHERS: VoucherRule[] = [
  {
    code: "AKHIRTAHUN10",
    description: "Diskon ekstra 10% (Maks. Rp 250.000) spesial Promo Akhir Tahun",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 300000,
    maxDiscount: 250000,
    remainingUses: 15,
  },
  {
    code: "UMKMMAJU",
    description: "Potongan langsung Rp 100.000 untuk pembelanjaan minimal Rp 500.000",
    discountType: "fixed",
    discountValue: 100000,
    minPurchase: 500000,
    remainingUses: 8,
  },
  {
    code: "KUOTAHABIS",
    description: "Voucher uji coba dengan kuota terpakai habis (0 sisa kuota)",
    discountType: "fixed",
    discountValue: 50000,
    minPurchase: 100000,
    remainingUses: 0,
  },
];

export const INITIAL_CMS_DATA: CMSStateData = {
  hero: {
    campaignBadge: "🔥 PROMO AKHIR TAHUN KODEVA • HEMAT HINGGA 45%",
    title: "Satu Ekosistem Software untuk",
    highlightText: "Bikin Bisnis UMKM Naik Kelas",
    subtitle:
      "Kelola kasir POS, stok multi-cabang, hingga penggajian & absensi karyawan tanpa ribet. Spesial akhir tahun: kunci harga promo berlangganan sebelum kuota lisensi habis!",
    primaryCtaText: "Lihat Katalog & Klaim Promo",
    primaryCtaHref: "/catalog",
    secondaryCtaText: "Konsultasi Gratis Tim Kami",
    promoStartDate: "2026-10-01",
    promoEndDate: "2026-12-31",
    heroImageAlt: "Dashboard Ekosistem Aplikasi Kasir POS dan HRIS Kodeva untuk UMKM",
    stats: [
      { label: "UMKM Terbantu di Asia Tenggara", value: "14.500+" },
      { label: "Uptime Server Transaksi", value: "99.98%" },
      { label: "Penghematan Waktu Operasional", value: "18 Jam/Minggu" },
    ],
  },
  sections: [
    { id: "hero", label: "Hero Banner Campaign", visible: true, order: 1 },
    { id: "featured_products", label: "Produk Unggulan Promo", visible: true, order: 2 },
    { id: "testimonials", label: "Testimoni Pelanggan UMKM", visible: true, order: 3 },
    { id: "faq", label: "Pertanyaan Umum (FAQ)", visible: true, order: 4 },
    { id: "lead_capture", label: "Form Konsultasi & Lead Capture", visible: true, order: 5 },
  ],
  featuredProductIds: ["prod-pos-retail", "prod-pos-resto", "prod-hr-payroll"],
  testimonials: [
    {
      id: "testi-1",
      authorName: "Hendra Wijaya",
      authorRole: "Founder & Owner",
      businessName: "Kopi Senja Nusantara (8 Cabang)",
      city: "Bandung",
      quote:
        "Sejak pindah ke Kodeva POS Resto, selisih stok biji kopi dan susu di 8 cabang kami turun jadi nol. Fitur QR Order di meja juga memangkas antrean kasir saat jam makan siang.",
      rating: 5,
      productUsed: "Kodeva POS FnB, Resto & Kafe",
    },
    {
      id: "testi-2",
      authorName: "Siti Rahmawati",
      authorRole: "HR & Finance Manager",
      businessName: "Berkah Mart Retailindo",
      city: "Surabaya",
      quote:
        "Dulu hitung gaji, lembur shift, dan PPh 21 untuk 65 staf butuh 4 hari penuh. Pakai Kodeva HRIS sekarang cukup klik sekali, slip gaji langsung terkirim ke WhatsApp masing-masing karyawan.",
      rating: 5,
      productUsed: "Kodeva HRIS & Auto-Payroll PPh 21",
    },
    {
      id: "testi-3",
      authorName: "Kevin Tanoto",
      authorRole: "Managing Director",
      businessName: " Nusantara Gadget Store",
      city: "Jakarta",
      quote:
        "Add-on Omnichannel Kodeva menyelamatkan toko kami saat kembar 11.11. Begitu barang laku di toko fisik, stok di Shopee dan TikTok Shop otomatis terpotong dalam 1 detik.",
      rating: 5,
      productUsed: "Kodeva Multi-Warehouse & Omnichannel Sync",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "Apakah harga Promo Akhir Tahun berlaku untuk perpanjangan tahun berikutnya?",
      answer:
        "Ya! Selama lisensi berlangganan Anda tetap aktif dan tidak terputus, Anda berhak menikmati perlindungan harga promo yang dikunci saat pendaftaran campaign Promo Akhir Tahun ini.",
      category: "Promo & Biaya",
    },
    {
      id: "faq-2",
      question: "Bagaimana aturan batas kuota lisensi promo pada keranjang belanja?",
      answer:
        "Setiap produk memiliki kuota lisensi promo terbatas untuk menjaga kualitas onboarding tim kami. Kuota promo dihitung berdasarkan total lisensi produk tersebut di dalam keranjang Anda (gabungan seluruh pilihan paket Basic, Pro, maupun Business pada produk yang sama).",
      category: "Kuota Lisensi",
    },
    {
      id: "faq-3",
      question: "Apakah aplikasi kasir Kodeva tetap berjalan jika internet toko sedang mati?",
      answer:
        "Tentu saja. Kodeva POS dilengkapi teknologi Offline-First. Kasir tetap dapat memproses transaksi dan mencetak struk seperti biasa, lalu data akan otomatis tersinkronisasi ke cloud begitu koneksi internet kembali stabil.",
      category: "Teknis & Operasional",
    },
    {
      id: "faq-4",
      question: "Apakah tim kami perlu keahlian IT khusus untuk mulai memakai Kodeva?",
      answer:
        "Tidak perlu sama sekali. Antarmuka Kodeva dirancang ramah pengguna awam. Kami juga menyediakan sesi panduan onboarding gratis via Zoom serta migrasi database produk dan karyawan Anda tanpa biaya tambahan.",
      category: "Implementasi",
    },
    {
      id: "faq-5",
      question: "Apakah Kodeva mendukung cabang usaha di Malaysia dan Singapura?",
      answer:
        "Ya, arsitektur Kodeva telah disiapkan untuk ekspansi regional Asia Tenggara (Indonesia, Malaysia, dan Singapura) dengan dukungan multi-mata uang (IDR, MYR, SGD) serta kepatuhan standar pajak lokal mulai awal tahun depan.",
      category: "Ekspansi Regional",
    },
  ],
  articles: [
    {
      id: "art-1",
      slug: "cara-memilih-aplikasi-kasir-pos-terbaik-untuk-umkm-2026",
      title: "7 Cara Memilih Aplikasi Kasir (POS) Terbaik untuk UMKM agar Tidak Boncos di 2026",
      excerpt:
        "Banyak pemilik toko dan kafe salah pilih aplikasi kasir yang akhirnya bikin antrean panjang dan stok berantakan. Simak checklist lengkap sebelum berlangganan.",
      content: `Memilih **aplikasi kasir (Point of Sale / POS)** bukan sekadar mencari alat pencetak struk. Bagi pemilik UMKM retail maupun F&B, meja kasir adalah jantung perputaran uang tunai dan stok barang.

### 1. Pastikan Mendukung Mode Offline (Offline-First)
Koneksi internet di ruko atau pusat perbelanjaan tidak selalu stabil. Jangan sampai kasir Anda berhenti melayani pembeli hanya karena Wi-Fi gangguan selama 15 menit. Pilih aplikasi kasir yang menyimpan transaksi secara lokal dan melakukan sinkronisasi otomatis saat kembali online.

### 2. Perhatikan Kemampuan Manajemen Stok & HPP
Untuk bisnis retail, pastikan ada fitur **peringatan stok tipis** dan harga grosir bertingkat. Sedangkan untuk bisnis kuliner atau coffee shop, wajib memilih aplikasi kasir yang bisa **memotong bahan baku sesuai gramasi resep (Bill of Materials)** setiap kali satu gelas kopi terjual.

### 3. Integrasi Pembayaran QRIS Dinamis
Pelanggan masa kini menginginkan pembayaran serba cepat. Dengan QRIS dinamis yang langsung menampilkan nominal di layar, kasir tidak perlu mengetik ulang nominal sehingga menghindari salah input angka nol.

### 4. Laporan Real-Time yang Bisa Diakses dari HP
Pemilik bisnis tidak harus nongkrong di toko seharian. Dengan laporan cloud real-time, Anda bisa memantau omzet per jam, performa shift kasir, hingga margin laba bersih langsung dari smartphone saat sedang bersama keluarga.`,
      coverImage:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80",
      coverAlt: "Kasir UMKM menggunakan aplikasi POS modern untuk melayani pelanggan",
      category: "Panduan POS & Retail",
      author: "Rizky Pratama — Product Specialist Kodeva",
      publishedAt: "2026-10-25",
      readingTimeMinutes: 5,
      status: "published",
      linkedProductIds: ["prod-pos-retail", "prod-pos-resto"],
      seoKeywords: ["aplikasi kasir", "pos umkm", "aplikasi kasir toko", "software kasir kafe"],
    },
    {
      id: "art-2",
      slug: "panduan-hitung-pph-21-ter-dan-otomasi-payroll-hr-umkm",
      title: "Panduan Praktis Hitung PPh 21 TER & Mengapa UMKM Wajib Beralih ke Aplikasi HR Otomatis",
      excerpt:
        "Masih hitung gaji, lembur, dan potongan BPJS karyawan pakai rumus Excel manual? Pelajari cara memangkas waktu proses payroll dari 4 hari menjadi 3 menit.",
      content: `Sejak diberlakukannya skema **Tarif Efektif Rata-rata (TER) PPh 21**, banyak tim keuangan dan pemilik bisnis UMKM pusing mencocokkan kategori PTKP dan tarif pajak bulanan karyawan.

### Risiko Hitung Gaji Manual dengan Spreadsheet
1. **Rawan Salah Rumus (Human Error)**: Satu sel terhapus bisa menyebabkan kelebihan atau kekurangan bayar gaji yang menurunkan kepercayaan karyawan.
2. **Rekap Absensi & Lembur yang Melelahkan**: Menarik data dari mesin fingerprint lama lalu mencocokkan surat izin dan jam lembur memakan waktu berhari-hari.
3. **Keterlambatan Distribusi Slip Gaji**: Memotong dan mengirim slip gaji satu per satu sangat menyita waktu HR.

### Solusi Otomasi HRIS & Payroll Modern
Dengan menggunakan aplikasi HR terintegrasi seperti **Kodeva HRIS**, data kehadiran dari absensi GPS langsung terhubung ke modul penggajian. Uang makan harian, upah lembur sesuai rumus Kemnaker, iuran BPJS, dan pajak PPh 21 TER terhitung otomatis secara instan.`,
      coverImage:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      coverAlt: "Tim HR menghitung payroll dan pajak PPh 21 menggunakan software HRIS",
      category: "HR & Payroll",
      author: "Nadia Kusuma — Senior HR Consultant",
      publishedAt: "2026-10-28",
      readingTimeMinutes: 6,
      status: "published",
      linkedProductIds: ["prod-hr-payroll", "prod-hr-attendance"],
      seoKeywords: ["aplikasi hr", "software payroll indonesia", "hitung pph 21 ter", "aplikasi absensi gps"],
    },
    {
      id: "art-3",
      slug: "strategi-sinkronisasi-stok-toko-offline-dan-marketplace",
      title: "Rahasia Toko Retail Sukses Jualan di Toko Fisik Sekaligus TikTok Shop Tanpa Stok Selisih",
      excerpt:
        "Pernah kena penalti toko online gara-gara barang sudah laku di toko offline tapi stok di marketplace belum dikurangi? Ini solusi omnichannel untuk UMKM.",
      content: `Menjalankan toko fisik sekaligus berjualan online di **Shopee, Tokopedia, dan TikTok Shop** adalah strategi terbaik meningkatkan omzet. Namun, tantangan terbesarnya adalah menjaga akurasi stok di semua kanal penjualan.

### Mengapa Stok Sering Selisih (Overselling)?
Saat promo kembar atau akhir tahun, barang di etalase toko fisik bisa habis diborong pembeli, sementara admin online belum sempat mengubah angka stok di lima akun marketplace berbeda. Akibatnya, pesanan online terpaksa dibatalkan dan skor performa toko menurun drastis.

### Integrasi POS + Omnichannel Warehouse
Melalui ekosistem **Kodeva POS Retail** dan **Add-on Multi-Warehouse Sync**, seluruh saluran penjualan membaca satu kolam stok pusat secara real-time. Setiap kali kasir memindai barcode barang, stok di seluruh marketplace otomatis terpotong dalam waktu kurang dari 2 detik.`,
      coverImage:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      coverAlt: "Gudang omnichannel UMKM dengan sistem manajemen stok barcode",
      category: "Manajemen Operasional",
      author: "Budi Santoso — Supply Chain Advisor",
      publishedAt: "2026-10-30",
      readingTimeMinutes: 4,
      status: "published",
      linkedProductIds: ["prod-pos-retail", "prod-addon-inventory"],
      seoKeywords: ["aplikasi stok gudang", "sinkronisasi marketplace", "omnichannel umkm"],
    },
    {
      id: "art-4",
      slug: "cara-merapikan-laporan-keuangan-umkm-untuk-ekspansi-cabang",
      title: "Cara Merapikan Laporan Laba Rugi & Neraca UMKM agar Mudah Dapat Modal Ekspansi Cabang",
      excerpt:
        "Omzet besar belum tentu untung besar jika pencatatan kas masih bercampur dengan rekening pribadi. Mulai pembukuan otomatis tanpa perlu jago akuntansi.",
      content: `Banyak bisnis kuliner dan retail yang ramai pembeli namun kesulitan saat ingin membuka cabang kedua atau mengajukan pembiayaan perbankan karena tidak memiliki laporan keuangan berstandar **SAK EMKM**.

### Tiga Kesalahan Keuangan UMKM yang Paling Umum
- Mencampur uang operasional toko dengan uang belanja pribadi pemilik.
- Tidak menghitung penyusutan peralatan (mesin kopi, chiller, komputer kasir) dan HPP secara akurat.
- Baru merekap nota pengeluaran di akhir tahun saat hendak lapor pajak.

### Pembukuan Instan dari Meja Kasir
Dengan menghubungkan aplikasi kasir dan penggajian ke **Kodeva Instant Accounting**, setiap transaksi otomatis berubah menjadi jurnal akuntansi, neraca, dan laporan arus kas tanpa perlu mengetik jurnal debit-kredit manual.`,
      coverImage:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80",
      coverAlt: "Laporan keuangan digital neraca dan laba rugi UMKM",
      category: "Keuangan & Pajak",
      author: "Dewi Lestari, CPA — Financial Analyst",
      publishedAt: "2026-10-31",
      readingTimeMinutes: 5,
      status: "published",
      linkedProductIds: ["prod-addon-accounting", "prod-pos-resto"],
      seoKeywords: ["aplikasi akuntansi umkm", "laporan laba rugi otomatis", "pajak umkm"],
    },
    {
      id: "art-5",
      slug: "persiapan-ekspansi-bisnis-umkm-ke-malaysia-dan-singapura-2027",
      title: "[DRAFT] Roadmap Ekspansi UMKM Indonesia ke Pasar Malaysia & Singapura di Awal Tahun Depan",
      excerpt:
        "Artikel draf internal tim marketing Kodeva mengenai kesiapan fitur multi-negara dan multi-currency untuk kampanye regional.",
      content: `Artikel ini masih berstatus **Draft** di CMS dan hanya tampil di mode Preview Admin sampai tim marketing mengubah statusnya menjadi **Published**.

Mulai kuartal pertama tahun depan, Kodeva siap mendampingi brand UMKM Indonesia yang membuka cabang di Kuala Lumpur dan Singapura dengan dukungan multi-currency (IDR, MYR, SGD) dan pelaporan pajak SST/GST.`,
      coverImage:
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=80",
      coverAlt: "Ekspansi bisnis regional Asia Tenggara",
      category: "Berita Kodeva",
      author: "Tim Marketing Kodeva",
      publishedAt: "2026-11-01",
      readingTimeMinutes: 3,
      status: "draft",
      linkedProductIds: ["prod-pos-retail", "prod-hr-payroll"],
      seoKeywords: ["ekspansi bisnis", "pos malaysia singapura"],
    },
  ],
  leads: [
    {
      id: "lead-sample-1",
      fullName: "Andi Saputra",
      contact: "081234567890",
      businessName: "Ayam Geprek Juara (3 Outlet)",
      interestedCategory: "Aplikasi Kasir (POS)",
      createdAt: "2026-10-31T09:30:00.000Z",
      utm: {
        utm_source: "instagram",
        utm_medium: "paid_social",
        utm_campaign: "promo_akhir_tahun_2026",
        utm_content: "reels_kasir_fnb",
        landing_path: "/?utm_source=instagram&utm_medium=paid_social&utm_campaign=promo_akhir_tahun_2026",
      },
    },
    {
      id: "lead-sample-2",
      fullName: "Maya Indriani",
      contact: "maya@hijabmodis.co.id",
      businessName: "Hijab Modis Official",
      interestedCategory: "Aplikasi HR & Payroll",
      createdAt: "2026-10-31T14:15:00.000Z",
      utm: {
        utm_source: "tiktok",
        utm_medium: "cpc",
        utm_campaign: "promo_akhir_tahun_2026",
        utm_content: "video_hris_ter",
        landing_path: "/blog?utm_source=tiktok&utm_medium=cpc&utm_campaign=promo_akhir_tahun_2026",
      },
    },
  ],
  lastUpdatedAt: "2026-11-01T00:00:00.000Z",
};

