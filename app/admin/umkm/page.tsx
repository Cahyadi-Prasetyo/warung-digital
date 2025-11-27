import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UMKMManagementPage() {
    const supabase = await createClient();

    const { data: umkmList, error } = await supabase
        .from('umkm_profiles')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching UMKM:', error);
        return <div>Error loading UMKM list</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">UMKM Management</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Manage registered UMKM businesses</p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/admin/umkm/create">
                        <Plus className="mr-2 h-4 w-4" /> Add UMKM
                    </Link>
                </Button>
            </div>

            {umkmList && umkmList.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500">No UMKM registered yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {umkmList?.map((umkm) => (
                        <Card key={umkm.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg text-gray-900">{umkm.name}</CardTitle>
                                <p className="text-sm text-gray-600">Owner: {umkm.owner_name}</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2 text-gray-600">
                                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">{umkm.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="h-4 w-4 flex-shrink-0" />
                                        <span>{umkm.phone}</span>
                                    </div>
                                    {umkm.email && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">{umkm.email}</span>
                                        </div>
                                    )}
                                </div>
                                {umkm.established_year && (
                                    <p className="text-xs text-gray-500">Est. {umkm.established_year}</p>
                                )}
                                <div className="pt-2">
                                    <Button asChild variant="outline" size="sm" className="w-full">
                                        <Link href={`/admin/umkm/${umkm.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
