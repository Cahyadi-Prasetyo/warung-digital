'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Upload, X, Video, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type UMKM = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    description: string;
    history: string;
    philosophy: string;
    umkm_id: number;
    status: string;
    unique_code: string;
    video_path: string | null;
};

type ProductImage = {
    id: number;
    image_path: string;
    is_featured: boolean;
};

type EditProductFormProps = {
    product: Product;
    umkmList: UMKM[];
    existingImages: ProductImage[];
};

export default function EditProductForm({ product, umkmList, existingImages }: EditProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        history: product.history,
        philosophy: product.philosophy,
        umkm_id: product.umkm_id.toString(),
        status: product.status as 'active' | 'inactive',
    });
    const [mediaType, setMediaType] = useState<'images' | 'video'>(
        product.video_path ? 'video' : 'images'
    );
    const [images, setImages] = useState<File[]>([]);
    const [video, setVideo] = useState<File | null>(null);
    const [currentImages, setCurrentImages] = useState<ProductImage[]>(existingImages);
    const [currentVideo, setCurrentVideo] = useState<string | null>(product.video_path);
    const [deleteImages, setDeleteImages] = useState<number[]>([]);
    const router = useRouter();
    const supabase = createClient();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setImages([...images, ...newImages]);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    };

    const removeNewImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeExistingImage = (id: number) => {
        setCurrentImages(currentImages.filter(img => img.id !== id));
        setDeleteImages([...deleteImages, id]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.name || !formData.description || !formData.umkm_id) {
                throw new Error('Please fill in all required fields');
            }

            // Update product basic info
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    name: formData.name,
                    description: formData.description,
                    history: formData.history || 'No history provided',
                    philosophy: formData.philosophy || 'No philosophy provided',
                    umkm_id: parseInt(formData.umkm_id),
                    status: formData.status,
                })
                .eq('id', product.id);

            if (updateError) throw updateError;

            // Handle media updates based on selected type
            if (mediaType === 'images') {
                // Delete video if switching from video to images
                if (currentVideo) {
                    await supabase.storage.from('products').remove([currentVideo]);
                    await supabase.from('products').update({ video_path: null }).eq('id', product.id);
                }

                // Delete marked images
                for (const imageId of deleteImages) {
                    const image = existingImages.find(img => img.id === imageId);
                    if (image) {
                        await supabase.storage.from('products').remove([image.image_path]);
                        await supabase.from('product_images').delete().eq('id', imageId);
                    }
                }

                // Upload new images
                if (images.length > 0) {
                    for (let i = 0; i < images.length; i++) {
                        const file = images[i];
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Date.now()}_${i}.${fileExt}`;
                        const filePath = `products/images/${fileName}`;

                        const { error: uploadError } = await supabase.storage
                            .from('products')
                            .upload(filePath, file);

                        if (uploadError) {
                            console.error('Error uploading image:', uploadError);
                            continue;
                        }

                        await supabase.from('product_images').insert({
                            product_id: product.id,
                            image_path: filePath,
                            sort_order: currentImages.length + i,
                            is_featured: currentImages.length === 0 && i === 0,
                        });
                    }
                }
            } else {
                // Delete all images if switching to video
                for (const img of currentImages) {
                    await supabase.storage.from('products').remove([img.image_path]);
                    await supabase.from('product_images').delete().eq('id', img.id);
                }

                // Upload new video if provided
                if (video) {
                    // Delete old video
                    if (currentVideo) {
                        await supabase.storage.from('products').remove([currentVideo]);
                    }

                    const fileExt = video.name.split('.').pop();
                    const fileName = `${Date.now()}_video.${fileExt}`;
                    const filePath = `products/videos/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(filePath, video);

                    if (uploadError) {
                        console.error('Error uploading video:', uploadError);
                    } else {
                        await supabase
                            .from('products')
                            .update({ video_path: filePath })
                            .eq('id', product.id);
                    }
                }
            }

            toast.success('Product updated successfully!');
            router.push('/admin/products');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/products">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                    </Link>
                </Button>
            </div>

            <Card className="max-w-4xl">
                <CardHeader>
                    <CardTitle className="text-gray-900">Edit Product</CardTitle>
                    <CardDescription>Update product information</CardDescription>
                    <p className="text-xs text-gray-500 mt-1">Code: {product.unique_code}</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-900">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="bg-white text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="umkm" className="text-sm font-medium text-gray-900">
                                    UMKM <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="umkm"
                                    value={formData.umkm_id}
                                    onChange={(e) => setFormData({ ...formData, umkm_id: e.target.value })}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-white text-gray-900 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">Select UMKM</option>
                                    {umkmList.map((umkm) => (
                                        <option key={umkm.id} value={umkm.id}>
                                            {umkm.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-gray-900">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                rows={4}
                                className="bg-white text-gray-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="history" className="text-sm font-medium text-gray-900">
                                Product History
                            </label>
                            <Textarea
                                id="history"
                                value={formData.history}
                                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                                rows={3}
                                className="bg-white text-gray-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="philosophy" className="text-sm font-medium text-gray-900">
                                Product Philosophy
                            </label>
                            <Textarea
                                id="philosophy"
                                value={formData.philosophy}
                                onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                                rows={3}
                                className="bg-white text-gray-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="status" className="text-sm font-medium text-gray-900">
                                Status
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                className="flex h-10 w-full rounded-md border border-input bg-white text-gray-900 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Media Type Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Media Type</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setMediaType('images')}
                                    className={`flex-1 p-4 border-2 rounded-lg transition-colors ${mediaType === 'images'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <ImageIcon className="mx-auto h-8 w-8 mb-2 text-gray-600" />
                                    <p className="text-sm font-medium text-gray-900">Images</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMediaType('video')}
                                    className={`flex-1 p-4 border-2 rounded-lg transition-colors ${mediaType === 'video'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <Video className="mx-auto h-8 w-8 mb-2 text-gray-600" />
                                    <p className="text-sm font-medium text-gray-900">Video</p>
                                </button>
                            </div>
                        </div>

                        {/* Images Upload */}
                        {mediaType === 'images' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Product Images</label>

                                {/* Existing Images */}
                                {currentImages.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2">Current Images</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {currentImages.map((img) => (
                                                <div key={img.id} className="relative group">
                                                    <div className="w-full h-32 bg-gray-200 rounded-lg border"></div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(img.id)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    {img.is_featured && (
                                                        <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Images Upload */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="images"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="images" className="cursor-pointer">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-600">Add more images</p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                    </label>
                                </div>

                                {images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {images.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`New ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Video Upload */}
                        {mediaType === 'video' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Product Video</label>

                                {currentVideo && !video && (
                                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                                        <p className="text-xs text-gray-500 mb-2">Current Video</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Video className="h-8 w-8 text-blue-600" />
                                                <p className="text-sm text-gray-900">Video uploaded</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentVideo(null)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="video"
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="video" className="cursor-pointer">
                                        <Video className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-600">
                                            {currentVideo ? 'Replace video' : 'Upload video'}
                                        </p>
                                        <p className="text-xs text-gray-500">MP4, MOV up to 50MB</p>
                                    </label>
                                </div>

                                {video && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Video className="h-8 w-8 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{video.name}</p>
                                                <p className="text-xs text-gray-500">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setVideo(null)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Product'
                                )}
                            </Button>
                            <Button type="button" variant="outline" asChild className="flex-1 sm:flex-none">
                                <Link href="/admin/products">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
