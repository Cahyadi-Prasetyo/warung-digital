'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';

interface ProductImage {
    id: number;
    image_path: string;
    is_featured: boolean;
}

interface Product {
    name: string;
    unique_code: string;
    history?: string;
    philosophy?: string;
    images: ProductImage[];
    video_path?: string | null;
}

interface Props {
    product: any; // Using any for now to simplify
}

export default function ProductStory({ product }: Props) {
    const primaryImage = product.images?.find((img: any) => img.is_featured);
    const processImages = product.images || [];

    // --- Media URL resolver ---
    const resolveMediaUrl = (path?: string | null) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/wardig-assets/${path}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Store className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900">Kisah Produk</h1>
                            <p className="text-sm text-gray-600">{product.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Navigasi */}
                <div className="flex justify-between items-center">
                    <Link href={`/product/${product.unique_code}`}>
                        <Button variant="outline">Kembali ke Product Landing</Button>
                    </Link>
                </div>

                {/* Deskripsi */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Sejarah</CardTitle>
                        <CardDescription>Perjalanan dan latar belakang produk</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-line">
                            {product.history || 'Sejarah produk belum tersedia.'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Filosofi</CardTitle>
                        <CardDescription>Nilai dan tujuan produk</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-line">
                            {product.philosophy || 'Filosofi produk belum tersedia.'}
                        </p>
                    </CardContent>
                </Card>

                {/* Media Produk: Video + Foto */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Media Produk</CardTitle>
                        <CardDescription>Video dan foto proses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {product.video_path ? (
                            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                <video
                                    className="w-full h-full"
                                    controls
                                    poster={primaryImage ? resolveMediaUrl(primaryImage.image_path) : undefined}
                                >
                                    <source src={resolveMediaUrl(product.video_path)} type="video/mp4" />
                                    Browser Anda tidak mendukung video.
                                </video>
                            </div>
                        ) : (
                            <p className="text-gray-600 mb-4">Belum ada video produk.</p>
                        )}

                        {processImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {processImages.map((img: any) => (
                                    <img
                                        key={img.id}
                                        src={resolveMediaUrl(img.image_path)}
                                        alt="Proses"
                                        className="w-full h-32 sm:h-40 rounded-lg object-cover"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Belum ada foto proses.</p>
                        )}
                    </CardContent>
                </Card>

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
