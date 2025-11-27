# WARDIG - Warisan Digital

![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green?logo=supabase)

**Platform Digital untuk Produk Lokal UMKM Sungai Enam**

Platform yang menghubungkan produk lokal UMKM dengan cerita di baliknya melalui QR Code, menciptakan emotional connection dan mendukung ekonomi lokal.

---

## 📖 Tentang Projek

WARDIG (Warisan Digital) adalah platform digital yang dikembangkan untuk membantu UMKM di Sungai Enam menceritakan kisah di balik produk mereka. Melalui QR Code, pelanggan dapat mengakses informasi lengkap tentang:

- ✨ Sejarah dan filosofi produk
- 👨‍🎨 Profile pembuat/UMKM
- 🖼️ Galeri foto produk dan proses pembuatan
- 📹 Video dokumenter produk
- ⭐ Ulasan dan rating dari pelanggan
- 📊 Analytics dan tracking untuk admin

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Server Components + Client Components

### Backend & Database
- **BaaS**: [Supabase](https://supabase.com)
  - PostgreSQL Database
  - Authentication
  - Storage untuk media files
  - Row Level Security (RLS)

### Additional Libraries
- **QR Generation**: qrcode
- **Notifications**: sonner (toast notifications)
- **Forms**: React Hook Form (if applicable)
- **Utilities**: clsx, tailwind-merge, class-variance-authority

---

## 📁 Struktur Projek

```
wardig-app/
├── app/                      # Next.js App Router
│   ├── admin/                # Admin panel
│   │   ├── dashboard/        # Dashboard analytics
│   │   ├── products/         # Product management
│   │   ├── umkm/            # UMKM management
│   │   └── reviews/         # Review moderation
│   ├── auth/                # Authentication pages
│   ├── login/               # Login page
│   ├── register/            # Register page
│   ├── product/             # Public product pages
│   │   └── [unique_code]/   # Dynamic product routes
│   │       ├── gallery/     # Product gallery
│   │       ├── maker/       # Maker profile
│   │       ├── reviews/     # Product reviews
│   │       └── story/       # Product story
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   └── ...                  # Custom components
├── lib/                     # Utility libraries
│   └── supabase/           # Supabase client configuration
├── types/                   # TypeScript type definitions
├── utils/                   # Helper functions
├── public/                  # Static assets
├── supabase/               # Supabase configurations
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Seed data
└── next.config.ts          # Next.js configuration
```

---

## 🎯 Fitur Utama

### 🔐 Admin Panel
- **Dashboard Analytics**: Total produk, scan QR, produk populer, grafik aktivitas
- **Manajemen Produk**: CRUD produk dengan upload video & foto galeri
- **QR Code Generator**: Generate & download QR code untuk setiap produk
- **Manajemen UMKM**: Database penjual/pembuat dengan profil lengkap
- **Review Management**: Moderasi review pelanggan (approve/reject/response)

### 🌐 Public Pages (via QR Scan)
- **Product Landing**: Hero section, video dokumenter, quick info
- **Product Story**: Sejarah, proses pembuatan, filosofi & nilai budaya
- **Maker Profile**: Profil UMKM/pembuat, lokasi & kontak, produk lainnya
- **Gallery**: Galeri foto produk dengan lightbox functionality
- **Reviews**: Customer reviews & ratings, form tambah review

### 📊 Analytics & Tracking
- Real-time QR scan tracking
- Product popularity statistics
- Geographic data (jika tersedia)
- Review analytics

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 20+ dan npm
- Akun Supabase ([Sign up gratis](https://supabase.com))

### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd Wardig
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Buat file `.env.local` di root projek:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Dapatkan credentials dari:
1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Settings → API
4. Copy `Project URL` dan `anon/public` key

### 4️⃣ Setup Database
1. Jalankan schema SQL di Supabase SQL Editor:
   ```bash
   # Copy isi file supabase/schema.sql ke Supabase SQL Editor
   ```
2. (Optional) Jalankan seed data:
   ```bash
   # Copy isi file supabase/seed.sql ke Supabase SQL Editor
   ```

### 5️⃣ Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📝 Database Schema

### Tables
- **users**: Admin authentication
- **umkm_profiles**: Profil UMKM/pembuat produk
- **products**: Data produk dengan QR code & unique_code
- **product_images**: Galeri foto produk
- **qr_scans**: Tracking aktivitas scan QR code
- **reviews**: Review & rating dari pelanggan

### Relationships
- 1 UMKM → Many Products
- 1 Product → Many Images
- 1 Product → Many QR Scans
- 1 Product → Many Reviews

Lihat detail schema di [PROJECT_BRIEF.txt](./PROJECT_BRIEF.txt)

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563EB, #1E40AF, #60A5FA)
- **Accent**: Orange (#F59E0B), Green (#10B981)
- **Neutral**: Gray scale (#F8FAFC - #1E293B)
- **Status**: Success (#10B981), Warning (#F59E0B), Error (#EF4444)

### Typography
- **Heading**: Inter (Bold/Semibold)
- **Body**: Inter (Regular/Medium)
- **Accent**: Poppins (logo/brand)

### Design Approach
- Creative & modern design
- Blue-based color scheme
- Rounded corners, subtle shadows
- Gradient buttons dengan hover effects
- Mobile-first responsive design

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan environment variables
4. Deploy!

### Manual Build
```bash
npm run build
npm run start
```

---

## 📚 Scripts

```bash
npm run dev      # Jalankan development server
npm run build    # Build production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🗺️ User Journey

### Admin
1. Login ke admin panel
2. Tambah/edit UMKM profile
3. Tambah produk baru (nama, deskripsi, sejarah, video, foto)
4. Generate QR code
5. Download QR code
6. Monitor analytics dashboard
7. Moderasi reviews

### Customer
1. Scan QR code pada produk
2. Landing di halaman produk
3. Watch video dokumenter
4. Explore story dan filosofi
5. View maker profile
6. Browse gallery
7. Read/write reviews

---

## 🎯 Target Audience

- **Primary**: Masyarakat awam yang ingin mengetahui info produk, cerita pembuatan, sejarah, dan nilai budaya
- **Secondary**: Wisatawan dan pecinta produk lokal
- **Admin**: Petugas kelurahan Sungai Enam yang mengurus UMKM

---

## 🔮 Future Enhancements

- [ ] Multi-language support (English)
- [ ] Social media integration & sharing
- [ ] Advanced analytics & reporting
- [ ] Mobile app version (React Native)
- [ ] E-commerce integration
- [ ] Augmented Reality features
- [ ] Bulk QR code generation & export

---

## 📄 License

Private project untuk UMKM Sungai Enam.

---

## 👥 Contributors

Developed with ❤️ for UMKM Sungai Enam

---

## 📞 Support

Untuk pertanyaan atau bantuan, silakan hubungi admin UMKM Sungai Enam.

---

**WARDIG** - Menghubungkan Produk Lokal dengan Cerita yang Bermakna 🇮🇩
