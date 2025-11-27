'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { useState } from 'react';

interface ProductImage {
    id: number;
    image_path: string;
    is_featured: boolean;
}

interface Product {
    name: string;
    unique_code: string;
    images: ProductImage[];
}

interface Props {
    product: any; // Using any for simplicity
}

export default function ProductGallery({ product }: Props) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const galleryImages = product.images || [];

    // --- Media URL resolver ---
    const resolveMediaUrl = (path?: string | null) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/wardig-assets/${path}`;
    };

    const showPrev = () => {
        if (lightboxIndex === null) return;
        setLightboxIndex((idx) => {
            if (idx === null) return null;
            return (idx - 1 + galleryImages.length) % galleryImages.length;
        });
    };

    const showNext = () => {
        if (lightboxIndex === null) return;
        setLightboxIndex((idx) => {
            if (idx === null) return null;
            return (idx + 1) % galleryImages.length;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Images className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900">Galeri Produk</h1>
                            <p className="text-sm text-gray-600">{product.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Navigasi kembali */}
                <div className="flex justify-between items-center">
                    <Link href={`/product/${product.unique_code}`}>
                        <Button variant="outline">Kembali ke Product Landing</Button>
                    </Link>
                </div>

                {/* Grid gambar */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Gallery</CardTitle>
                        <CardDescription>Foto produk & behind the scenes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {galleryImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {galleryImages.map((img: any, idx: number) => (
                                    <button
                                        key={img.id}
                                        className="group relative"
                                        onClick={() => setLightboxIndex(idx)}
                                    >
                                        <img
                                            src={resolveMediaUrl(img.image_path)}
                                            alt="Gallery"
                                            className="w-full h-32 sm:h-40 rounded-lg object-cover border"
                                        />
                                        <span className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Belum ada foto untuk galeri.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Lightbox overlay */}
                {lightboxIndex !== null && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="absolute top-4 right-4">
                            <Button variant="secondary" onClick={() => setLightboxIndex(null)}>
                                <X className="w-4 h-4 mr-2" /> Tutup
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" onClick={showPrev}>
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <img
                                src={resolveMediaUrl(galleryImages[lightboxIndex].image_path)}
                                alt="Preview"
                                className="max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-2xl bg-white"
                            />
                            <Button variant="secondary" onClick={showNext}>
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">
                        Powered by <span className="font-semibold text-blue-600">Wardig</span>
                    </p>
                    <p className="text-xs mt-1">Scan QR codes to discover amazing local products</p>
                </div>
            </div>
        </div>
    );
}
