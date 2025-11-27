'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';

interface Product {
    name: string;
    unique_code: string;
    umkmProfile?: {
        id: number;
        name: string;
        description?: string;
        address?: string;
        phone?: string;
        email?: string;
        logo_path: string | null;
    };
}

interface Props {
    product: any; // Using any for simplicity
}

export default function ProductMaker({ product }: Props) {
    const maker = product.umkmProfile;

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
                        {maker?.logo_path ? (
                            <img
                                src={resolveMediaUrl(maker.logo_path)}
                                alt={maker.name}
                                className="w-10 h-10 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Store className="w-5 h-5 text-blue-600" />
                            </div>
                        )}
                        <div>
                            <h1 className="font-semibold text-gray-900">Maker Profile</h1>
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

                {/* Profil UMKM */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Profil UMKM</CardTitle>
                        <CardDescription>Informasi singkat pembuat produk</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-gray-700">
                            <p><span className="font-medium">Nama:</span> {maker?.name || '-'}</p>
                            {maker?.address && <p><span className="font-medium">Alamat:</span> {maker.address}</p>}
                            {maker?.phone && <p><span className="font-medium">Telepon:</span> {maker.phone}</p>}
                            {maker?.email && <p><span className="font-medium">Email:</span> {maker.email}</p>}
                            {maker?.description && (
                                <p className="whitespace-pre-line"><span className="font-medium">Deskripsi:</span> {maker.description}</p>
                            )}
                        </div>
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
