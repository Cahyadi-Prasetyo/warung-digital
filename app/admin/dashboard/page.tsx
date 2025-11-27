import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/server';
import { Package, Star, Scan, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch metrics
    const [
        { count: totalProducts },
        { count: pendingReviews },
        { count: totalScans },
        { count: totalUMKM }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('qr_scans').select('*', { count: 'exact', head: true }),
        supabase.from('umkm_profiles').select('*', { count: 'exact', head: true })
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.email}</p>
            </div>

            {/* Metric Cards - Simple & Clean */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Products */}
                <Card className="border border-gray-200 hover:border-blue-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Products
                        </CardTitle>
                        <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center">
                            <Package className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{totalProducts || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">In catalog</p>
                    </CardContent>
                </Card>

                {/* Pending Reviews */}
                <Card className="border border-gray-200 hover:border-yellow-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Pending Reviews
                        </CardTitle>
                        <div className="h-8 w-8 rounded-md bg-yellow-50 flex items-center justify-center">
                            <Star className="h-4 w-4 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{pendingReviews || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Need approval</p>
                    </CardContent>
                </Card>

                {/* Total Scans */}
                <Card className="border border-gray-200 hover:border-green-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Scans
                        </CardTitle>
                        <div className="h-8 w-8 rounded-md bg-green-50 flex items-center justify-center">
                            <Scan className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{totalScans || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">QR scans</p>
                    </CardContent>
                </Card>

                {/* Total UMKM */}
                <Card className="border border-gray-200 hover:border-purple-300 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total UMKM
                        </CardTitle>
                        <div className="h-8 w-8 rounded-md bg-purple-50 flex items-center justify-center">
                            <Users className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{totalUMKM || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Registered</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="border border-gray-200">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-2">
                            <Button asChild className="w-full justify-start" variant="default">
                                <Link href="/admin/products/create">
                                    <Package className="mr-2 h-4 w-4" />
                                    Add New Product
                                </Link>
                            </Button>
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link href="/admin/products">
                                    <Package className="mr-2 h-4 w-4" />
                                    Manage Products
                                </Link>
                            </Button>
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link href="/admin/reviews">
                                    <Star className="mr-2 h-4 w-4" />
                                    Review Management
                                </Link>
                            </Button>
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link href="/admin/umkm">
                                    <Users className="mr-2 h-4 w-4" />
                                    UMKM Management
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border border-gray-200">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg text-gray-900">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {pendingReviews && pendingReviews > 0 ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <div className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center">
                                        <Star className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {pendingReviews} Pending Review{pendingReviews > 1 ? 's' : ''}
                                        </p>
                                        <p className="text-xs text-gray-600">Waiting for approval</p>
                                    </div>
                                </div>
                                <Button asChild size="sm" className="w-full">
                                    <Link href="/admin/reviews">Review Now</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                                    <Star className="h-5 w-5 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">No pending reviews</p>
                                <p className="text-xs text-gray-400 mt-1">All caught up!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
