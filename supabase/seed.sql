-- Seed data for Supabase
-- Adapted from wardig.sql

-- 1. Users
INSERT INTO public.users (id, name, email, email_verified_at, is_admin, password, created_at, updated_at) VALUES
(2, 'Admin WARDIG', 'admin@wardig.com', '2025-10-15 11:26:46', true, '$2y$12$Lr4BI3k8MwB9.EhFV01LeufvC1/Q94OL96LX80JVWYJLYgpwv.0fq', '2025-10-15 11:26:46', '2025-10-15 11:26:46'),
(3, 'John Doe', 'john@example.com', '2025-10-15 11:59:06', false, '$2y$12$j4cJkwdnI6X6W7ShZP4Dg.hd1IEeHLpl27WTJpfk2Nm8vCiE2N.Xu', '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(4, 'Jane Smith', 'jane@example.com', '2025-10-15 11:59:06', false, '$2y$12$uSi3t/7IJXpQHcCcOeTqxumw/kCjpWXJKZPC5x4z4MDzDWlIwxxK.', '2025-10-15 11:59:06', '2025-10-15 11:59:06');

-- 2. UMKM Profiles
INSERT INTO public.umkm_profiles (id, name, owner_name, address, phone, email, story, established_year, created_at, updated_at) VALUES
(1, 'Warung Nasi Gudeg Bu Sari', 'Bu Sari', 'Jl. Malioboro No. 123, Yogyakarta', '081234567890', 'gudegbusari@gmail.com', 'Warung tradisional yang menyajikan gudeg khas Yogyakarta dengan cita rasa autentik turun temurun. Menggunakan bahan-bahan pilihan dan bumbu rahasia keluarga.', 2010, '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(2, 'Kerajinan Batik Indah', 'Pak Bambang', 'Jl. Tirtodipuran No. 45, Yogyakarta', '081987654321', 'batikindah@gmail.com', 'Usaha kerajinan batik tulis dan cap dengan motif tradisional dan modern. Melayani pesanan seragam, kain, dan souvenir batik berkualitas tinggi.', 2015, '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(3, 'Toko Oleh-oleh Jogja', 'Ibu Ratna', 'Jl. Prawirotaman No. 67, Yogyakarta', '081122334455', 'oleholejogja@gmail.com', 'Pusat oleh-oleh khas Yogyakarta dengan berbagai pilihan makanan ringan, kerajinan, dan souvenir. Harga terjangkau dengan kualitas terbaik.', 2018, '2025-10-15 11:59:06', '2025-10-15 11:59:06');

-- 3. Products
INSERT INTO public.products (id, umkm_id, name, description, history, philosophy, video_path, qr_code_path, unique_code, status, created_at, updated_at) VALUES
(1, 1, 'Paket Gudeg Komplit', 'Paket gudeg lengkap dengan nasi, ayam, telur, tahu, tempe, dan sambal krecek. Porsi untuk 1 orang dengan cita rasa autentik.', 'Resep turun temurun dari nenek moyang yang telah diwariskan selama puluhan tahun.', 'Menyajikan makanan dengan cinta dan kehangatan keluarga.', NULL, 'qr_codes/product_1_1760555908.png', 'kXTjGm7Op5', 'active', '2025-10-15 11:59:06', '2025-10-15 13:44:57'),
(2, 1, 'Gudeg Kaleng Bu Sari', 'Gudeg dalam kemasan kaleng praktis, tahan lama, cocok untuk oleh-oleh. Rasa sama enaknya dengan gudeg segar.', 'Inovasi kemasan untuk memudahkan pelanggan membawa oleh-oleh khas Yogyakarta.', 'Mempertahankan cita rasa tradisional dalam kemasan modern.', NULL, NULL, 'wI7gtvG6Sg', 'active', '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(3, 2, 'Kain Batik Tulis Motif Parang', 'Kain batik tulis premium dengan motif parang klasik. Ukuran 2.5 meter, cocok untuk bahan kemeja atau dress.', 'Motif parang merupakan salah satu motif tertua dalam budaya Jawa yang melambangkan kekuatan.', 'Melestarikan warisan budaya melalui karya seni batik berkualitas tinggi.', NULL, NULL, 'T1gfTq2Fy5', 'active', '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(4, 2, 'Kemeja Batik Pria Motif Kawung', 'Kemeja batik pria dengan motif kawung, bahan katun halus, tersedia ukuran M, L, XL. Cocok untuk acara formal maupun casual.', 'Motif kawung terinspirasi dari buah aren yang melambangkan kesucian dan kebijaksanaan.', 'Menghadirkan busana tradisional yang tetap relevan di era modern.', NULL, NULL, 'ZQoNy7rsPf', 'active', '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(5, 3, 'Bakpia Pathok 25', 'Bakpia khas Yogyakarta dengan isian kacang hijau, coklat, dan keju. Kemasan isi 20 buah, cocok untuk oleh-oleh.', 'Bakpia Pathok telah menjadi ikon kuliner Yogyakarta sejak tahun 1948.', 'Mempertahankan resep asli dengan sentuhan inovasi rasa modern.', NULL, NULL, 'SSUSp4lXBZ', 'active', '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(6, 3, 'Geplak Bantul', 'Geplak tradisional dari Bantul dengan rasa kelapa murni. Kemasan kotak isi 15 potong, manis dan legit.', 'Geplak merupakan makanan tradisional Bantul yang terbuat dari kelapa dan gula aren.', 'Melestarikan cita rasa tradisional dengan bahan-bahan alami pilihan.', NULL, NULL, 'gWnHu08yKh', 'inactive', '2025-10-15 11:59:06', '2025-10-15 11:59:06');

-- 4. Product Images
INSERT INTO public.product_images (id, product_id, image_path, alt_text, sort_order, is_featured, created_at, updated_at) VALUES
(2, 1, 'products/images/01K88GGJ79G5AX3TDWJETF4T2Q.jpg', NULL, 0, true, '2025-10-23 05:25:47', '2025-10-23 05:25:47');

-- 5. Reviews
INSERT INTO public.reviews (id, product_id, customer_name, rating, comment, review_images, status, created_at, updated_at) VALUES
(1, 1, 'Budi Santoso', 5, 'Gudegnya enak banget! Rasanya autentik dan porsinya pas. Pasti akan pesan lagi.', NULL, 'approved', '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(2, 1, 'Siti Nurhaliza', 4, 'Rasa gudegnya mantap, cuma agak kemanisan sedikit. Overall recommended!', NULL, 'approved', '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(3, 3, 'Ahmad Wijaya', 5, 'Kualitas batiknya sangat bagus, motifnya halus dan warnanya tidak luntur. Puas dengan pembelian ini.', NULL, 'approved', '2025-10-15 11:59:06', '2025-10-15 11:59:06'),
(4, 4, 'Rina Kusuma', 4, 'Kemeja batiknya bagus dan nyaman dipakai. Ukurannya pas dan bahannya adem.', '[]', 'approved', '2025-10-15 11:59:06', '2025-10-15 12:08:40'),
(5, 5, 'Dedi Kurniawan', 3, 'Bakpianya lumayan enak, tapi agak kering. Mungkin bisa diperbaiki lagi.', '[]', 'approved', '2025-10-15 11:59:06', '2025-10-15 12:09:02'),
(6, 2, 'Maya Sari', 2, 'Gudeg kalengnya kurang enak, rasanya beda dengan yang segar. Tidak recommended.', NULL, 'rejected', '2025-10-15 11:59:06', '2025-10-15 11:59:06');

-- 6. QR Scans (Sample)
INSERT INTO public.qr_scans (id, product_id, scanned_at, ip_address, user_agent, created_at, updated_at) VALUES
(1, 1, '2025-10-15 12:37:49', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-15 12:37:49', '2025-10-15 12:37:49');

-- Reset sequences to avoid collision on next insert
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('umkm_profiles_id_seq', (SELECT MAX(id) FROM umkm_profiles));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_images_id_seq', (SELECT MAX(id) FROM product_images));
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));
SELECT setval('qr_scans_id_seq', (SELECT MAX(id) FROM qr_scans));
