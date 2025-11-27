import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Mail, Phone, Calendar, Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UMKMDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch UMKM data
    const { data: umkm, error } = await supabase
        .from('umkm_profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !umkm) {
        notFound();
    }

    // Fetch products from this UMKM
    const { data: products } = await supabase
        .from('products')
        .select('id, name, status')
        .eq('umkm_id', umkm.id);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href="/admin/umkm">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to UMKM
                    </Link>
                </Button>
                <Button asChild>
                    <Link href={`/admin/umkm/${umkm.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit UMKM
                    </Link>
                </Button>
            </div>

            {/* UMKM Info Card */}
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle className="text-2xl text-gray-900">{umkm.name}</CardTitle>
                        <p className="text-gray-600 mt-1">Owner: {umkm.owner_name}</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Contact Information */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Address</p>
                                    <p className="text-sm text-gray-600">{umkm.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Phone</p>
                                    <p className="text-sm text-gray-600">{umkm.phone}</p>
                                </div>
                            </div>
                            {umkm.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Email</p>
                                        <p className="text-sm text-gray-600">{umkm.email}</p>
                                    </div>
                                </div>
                            )}
                            {umkm.established_year && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Established</p>
                                        <p className="text-sm text-gray-600">{umkm.established_year}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Business Story */}
                    {umkm.story && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Business Story</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{umkm.story}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Products Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Products ({products?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {products && products.length > 0 ? (
                        <div className="space-y-2">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <p className="font-medium text-gray-900">{product.name}</p>
                                    <Badge
                                        className={
                                            product.status === 'active'
                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                : 'bg-gray-100 text-gray-700 border-gray-200'
                                        }
                                    >
                                        {product.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No products yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
