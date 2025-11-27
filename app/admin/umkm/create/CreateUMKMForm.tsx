'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateUMKMForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        owner_name: '',
        address: '',
        phone: '',
        email: '',
        story: '',
        established_year: '',
    });
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.name || !formData.owner_name || !formData.address || !formData.phone || !formData.story) {
                throw new Error('Please fill in all required fields');
            }

            const { error: insertError } = await supabase.from('umkm_profiles').insert({
                name: formData.name,
                owner_name: formData.owner_name,
                address: formData.address,
                phone: formData.phone,
                email: formData.email || null,
                story: formData.story,
                established_year: formData.established_year ? parseInt(formData.established_year) : null,
            });

            if (insertError) throw insertError;

            router.push('/admin/umkm');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/umkm">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to UMKM
                    </Link>
                </Button>
            </div>

            <Card className="max-w-4xl">
                <CardHeader>
                    <CardTitle className="text-gray-900">Add New UMKM</CardTitle>
                    <CardDescription>Register a new UMKM business</CardDescription>
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
                                    Business Name <span className="text-red-500">*</span>
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
                                <label htmlFor="owner_name" className="text-sm font-medium text-gray-900">
                                    Owner Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="owner_name"
                                    value={formData.owner_name}
                                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                                    required
                                    className="bg-white text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium text-gray-900">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                                rows={3}
                                className="bg-white text-gray-900"
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-900">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    className="bg-white text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-900">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-white text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="established_year" className="text-sm font-medium text-gray-900">
                                Established Year
                            </label>
                            <Input
                                id="established_year"
                                type="number"
                                min="1900"
                                max={new Date().getFullYear()}
                                value={formData.established_year}
                                onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                                className="bg-white text-gray-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="story" className="text-sm font-medium text-gray-900">
                                Business Story <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="story"
                                value={formData.story}
                                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                required
                                rows={5}
                                placeholder="Tell us about the business, its history, and what makes it special..."
                                className="bg-white text-gray-900"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create UMKM'
                                )}
                            </Button>
                            <Button type="button" variant="outline" asChild className="flex-1 sm:flex-none">
                                <Link href="/admin/umkm">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
