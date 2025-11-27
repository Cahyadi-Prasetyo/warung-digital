'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Review {
    id: number;
    customer_name: string;
    rating: number;
    comment: string;
    review_images?: any; // JSON
    created_at?: string;
}

interface Product {
    id: number;
    name: string;
    unique_code: string;
    approvedReviews: Review[];
}

interface Props {
    product: any; // Using any for simplicity
}

export default function ProductReviews({ product }: Props) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        customer_name: '',
        rating: 5,
        comment: '',
        review_images: [] as File[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // --- Media URL resolver ---
    const resolveMediaUrl = (path?: string | null) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/wardig-assets/${path}`;
    };

    const onSelectImages = (files: FileList | null) => {
        if (!files) return;
        setFormData({ ...formData, review_images: Array.from(files) });
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            // Upload images first if any
            let uploadedImagePaths: string[] = [];
            if (formData.review_images.length > 0) {
                for (const file of formData.review_images) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `reviews/${fileName}`;

                    const supabase = createClient();
                    const { error: uploadError } = await supabase.storage
                        .from('wardig-assets')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;
                    uploadedImagePaths.push(filePath);
                }
            }

            // Insert review
            const supabase = createClient();
            const { error } = await supabase
                .from('reviews')
                .insert({
                    product_id: product.id,
                    customer_name: formData.customer_name,
                    rating: formData.rating,
                    comment: formData.comment,
                    review_images: uploadedImagePaths, // Store as JSON array
                    status: 'pending'
                });

            if (error) throw error;

            alert('Review berhasil dikirim dan menunggu persetujuan.');
            setFormData({
                customer_name: '',
                rating: 5,
                comment: '',
                review_images: [],
            });
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setErrors({ form: err.message || 'Terjadi kesalahan saat mengirim review.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Star className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900">Ulasan Pelanggan</h1>
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

                {/* Daftar ulasan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Customer Reviews</CardTitle>
                        <CardDescription>Ulasan yang disetujui</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {product.approvedReviews && product.approvedReviews.length > 0 ? (
                            <div className="space-y-4">
                                {product.approvedReviews.map((r: any) => (
                                    <div key={r.id} className="p-4 border rounded-lg bg-white">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-gray-900">{r.customer_name}</p>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-amber-500' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mt-2 whitespace-pre-line">{r.comment}</p>
                                        {r.review_images && r.review_images.length > 0 && (
                                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {r.review_images.map((img: string, idx: number) => (
                                                    <img
                                                        key={idx}
                                                        src={resolveMediaUrl(img)}
                                                        alt="Review"
                                                        className="w-full h-24 sm:h-28 rounded-lg object-cover border"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {r.created_at && (
                                            <p className="text-xs text-gray-500 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Belum ada ulasan.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Form kirim ulasan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Tulis Ulasan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nama</label>
                                <Input
                                    value={formData.customer_name}
                                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                    placeholder="Nama Anda"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Rating</label>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <button
                                            type="button"
                                            key={i}
                                            className={`p-2 rounded ${formData.rating > i ? 'text-amber-500' : 'text-gray-300'}`}
                                            onClick={() => setFormData({ ...formData, rating: i + 1 })}
                                            aria-label={`Set rating ${i + 1}`}
                                        >
                                            <Star className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Komentar</label>
                                <Textarea
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder="Tulis pengalaman Anda tentang produk ini"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Gambar Ulasan (opsional)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => onSelectImages(e.target.files)}
                                    className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                            </div>

                            {errors.form && (
                                <p className="text-sm text-red-600">{errors.form}</p>
                            )}

                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    <MessageSquare className="w-4 h-4 mr-2" /> {isSubmitting ? 'Mengirim...' : 'Kirim'}
                                </Button>
                            </div>
                        </form>
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
