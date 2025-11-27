'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Star,
    MapPin,
    Phone,
    Mail,
    Store,
    Package,
    User,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    description: string;
    // price?: number; // Not in schema yet
    unique_code: string;
    status: string;
    video_path: string | null;
    umkmProfile: {
        id: number;
        name: string;
        description: string; // Not in schema? Check schema.sql. It IS in schema.sql.
        address: string;
        phone: string;
        email: string | null;
        logo_path: string | null;
    };
    images: Array<{
        id: number;
        image_path: string;
        is_featured: boolean;
    }>;
    approvedReviews: Array<{
        id: number;
        rating: number;
        comment: string;
        customer_name: string;
        created_at: string;
        review_images?: any; // Json
    }>;
}

interface Props {
    product: any; // Use any to avoid strict type mismatch for now
}

export default function ProductShow({ product }: Props) {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        customer_name: '',
        rating: 5,
        comment: '',
        review_images: [] as File[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const images = product.images || [];
    const approvedReviews = product.approvedReviews || [];

    // --- Media URL resolver ---
    const resolveMediaUrl = (path?: string | null) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        // Use 'products' bucket for all product media
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${path}`;
        console.log('📸 Resolving media URL:', { path, url });
        return url;
    };

    const averageRating = approvedReviews.length > 0
        ? approvedReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / approvedReviews.length
        : 0;

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
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
                        .from('products')
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

            toast.success('Review berhasil dikirim dan menunggu persetujuan! 🎉');
            setFormData({
                customer_name: '',
                rating: 5,
                comment: '',
                review_images: [],
            });
            router.refresh(); // Refresh to see changes if any (though pending won't show)

        } catch (err: any) {
            console.error(err);
            const errorMessage = err.message || 'Terjadi kesalahan saat mengirim review.';
            setErrors({ form: errorMessage });
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const shareProduct = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} from ${product.umkmProfile?.name ?? 'UMKM'}`,
                    url: window.location.href,
                });
                toast.success('Berhasil dibagikan!');
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard! 📋');
        }
    };

    const displayedReviews = showAllReviews
        ? approvedReviews
        : approvedReviews.slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {product.umkmProfile?.logo_path ? (
                                <img
                                    src={resolveMediaUrl(product.umkmProfile?.logo_path)}
                                    alt={product.umkmProfile?.name ?? 'UMKM'}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Store className="w-5 h-5 text-blue-600" />
                                </div>
                            )}
                            <div>
                                <h1 className="font-semibold text-gray-900">{product.umkmProfile?.name ?? 'UMKM'}</h1>
                                <p className="text-sm text-gray-600">UMKM Profile</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => router.back()}>
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Button>
                            <Button variant="outline" size="sm" onClick={shareProduct}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Product Images/Video */}
                <Card>
                    <CardContent className="p-0">
                        <div className="relative">
                            {images.length > 0 ? (
                                <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                                    <img
                                        src={resolveMediaUrl(images[currentImageIndex].image_path)}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {images.length > 1 && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                                onClick={prevImage}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                                onClick={nextImage}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>

                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                {images.map((_: any, index: number) => (
                                                    <button
                                                        key={index}
                                                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                            }`}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : product.video_path ? (
                                <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
                                    <video
                                        src={resolveMediaUrl(product.video_path)}
                                        controls
                                        className="w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                                    <Package className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Product Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl">{product.name}</CardTitle>
                                <div className="flex items-center space-x-4 mt-2">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                                        <span className="text-gray-600">({approvedReviews.length} reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Heart className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                            {product.description}
                        </CardDescription>
                    </CardContent>
                </Card>

                {/* UMKM Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Store className="w-5 h-5 mr-2 text-blue-600" />
                            About {product.umkmProfile?.name ?? 'UMKM'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-700">{product.umkmProfile?.story ?? 'Belum ada cerita untuk UMKM ini.'}</p>

                        <Separator />

                        <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-3" />
                                <span className="text-sm">{product.umkmProfile?.address ?? 'Alamat tidak tersedia'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Phone className="w-4 h-4 mr-3" />
                                <a href={product.umkmProfile?.phone ? `tel:${product.umkmProfile.phone}` : undefined} className="text-sm hover:text-blue-600">
                                    {product.umkmProfile?.phone ?? 'Telepon tidak tersedia'}
                                </a>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Mail className="w-4 h-4 mr-3" />
                                <a href={product.umkmProfile?.email ? `mailto:${product.umkmProfile.email}` : undefined} className="text-sm hover:text-blue-600">
                                    {product.umkmProfile?.email ?? 'Email tidak tersedia'}
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews */}
                {approvedReviews.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Customer Reviews</span>
                                <Badge variant="outline">{approvedReviews.length} reviews</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {displayedReviews.map((review: any) => (
                                <div key={review.id} className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{review.customer_name}</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center">
                                                        {Array.from({ length: 5 }, (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < review.rating
                                                                    ? 'text-yellow-500 fill-current'
                                                                    : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-600" suppressHydrationWarning>
                                                        {new Date(review.created_at).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 ml-13">{review.comment}</p>

                                    {Array.isArray(review.review_images) && review.review_images.length > 0 && (
                                        <div className="flex space-x-2 ml-13">
                                            {review.review_images.map((imagePath: string, idx: number) => (
                                                <img
                                                    key={idx}
                                                    src={resolveMediaUrl(imagePath)}
                                                    alt="Review"
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <Separator />
                                </div>
                            ))}

                            {approvedReviews.length > 3 && !showAllReviews && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setShowAllReviews(true)}
                                >
                                    Show All Reviews ({approvedReviews.length})
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Add Review Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Tambah Review</CardTitle>
                        <CardDescription>Nama, rating, komentar, dan foto (opsional)</CardDescription>
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
                                            onClick={() => setFormData({ ...formData, rating: i + 1 })}
                                            className="p-1"
                                            aria-label={`Pilih rating ${i + 1}`}
                                        >
                                            <Star className={`w-5 h-5 ${i < formData.rating ? 'text-amber-500' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Komentar</label>
                                <Textarea
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder="Tulis komentar Anda"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Foto (opsional)</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => onSelectImages(e.target.files)}
                                    className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                            </div>

                            {errors.form && (
                                <p className="text-sm text-red-600">{errors.form}</p>
                            )}

                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
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
                    <p className="text-xs mt-1">
                        Scan QR codes to discover amazing local products
                    </p>
                </div>
            </div>
        </div>
    );
}
