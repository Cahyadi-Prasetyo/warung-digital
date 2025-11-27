'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Upload, X, Video } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type UMKM = {
    id: number;
    name: string;
};

type CreateProductFormProps = {
    umkmList: UMKM[];
};

export default function CreateProductForm({ umkmList }: CreateProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        history: '',
        philosophy: '',
        umkm_id: '',
        status: 'active' as 'active' | 'inactive',
    });
    const [images, setImages] = useState<File[]>([]);
    const [video, setVideo] = useState<File | null>(null);
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

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const generateUniqueCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate form data
            if (!formData.name || !formData.description || !formData.umkm_id) {
                throw new Error('Please fill in all required fields');
            }

            const uniqueCode = generateUniqueCode();

            // Insert product
            const { data: product, error: productError } = await supabase
                .from('products')
                .insert({
                    name: formData.name,
                    description: formData.description,
                    history: formData.history || 'No history provided',
                    philosophy: formData.philosophy || 'No philosophy provided',
                    umkm_id: parseInt(formData.umkm_id),
                    unique_code: uniqueCode,
                    status: formData.status,
                })
                .select()
                .single();

            if (productError) throw productError;

            // Upload images
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

                    // Insert product image record
                    await supabase.from('product_images').insert({
                        product_id: product.id,
                        image_path: filePath,
                        sort_order: i,
                        is_featured: i === 0,
                    });
                }
            }

            // Upload video if provided
            let videoPath = null;
            if (video) {
                const fileExt = video.name.split('.').pop();
                const fileName = `${Date.now()}_video.${fileExt}`;
                const filePath = `products/videos/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, video);

                if (uploadError) {
                    console.error('Error uploading video:', uploadError);
                } else {
                    videoPath = filePath;
                    // Update product with video path
                    await supabase
                        .from('products')
                        .update({ video_path: videoPath })
                        .eq('id', product.id);
                }
            }

            toast.success('Product created successfully!');
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
                    <CardTitle className="text-gray-900">Add New Product</CardTitle>
                    <CardDescription>Create a new product for your UMKM catalog</CardDescription>
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Product Images</label>
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
                                    <p className="mt-2 text-sm text-gray-600">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                </label>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {images.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Video Upload Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Product Video</label>
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
                                        Click to upload video
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

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Product'
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
