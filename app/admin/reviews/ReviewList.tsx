'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Review = {
    id: number;
    product_id: number;
    customer_name: string;
    rating: number;
    comment: string;
    status: string;
    created_at: string;
    products: {
        name: string;
    } | null;
};

type FilterTab = 'all' | 'approved' | 'pending' | 'rejected';

export default function ReviewList({ initialReviews }: { initialReviews: Review[] }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [loading, setLoading] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
    const router = useRouter();
    const supabase = createClient();

    const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
        setLoading(id);
        try {
            const { error } = await supabase
                .from('reviews')
                .update({ status })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
            toast.success(`Review ${status} successfully!`);
            router.refresh();
        } catch (error) {
            console.error('Error updating review:', error);
            toast.error('Failed to update review. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        setLoading(id);
        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setReviews(reviews.filter(r => r.id !== id));
            toast.success('Review deleted successfully!');
            router.refresh();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    // Filter reviews based on active tab
    const filteredReviews = reviews.filter(review => {
        if (activeFilter === 'all') return true;
        return review.status === activeFilter;
    });

    // Count reviews by status
    const counts = {
        all: reviews.length,
        approved: reviews.filter(r => r.status === 'approved').length,
        pending: reviews.filter(r => r.status === 'pending').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { color: string; label: string }> = {
            approved: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Approved' },
            pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Pending' },
            rejected: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Rejected' },
        };
        const variant = variants[status] || variants.pending;
        return (
            <Badge className={`${variant.color} border`}>
                {variant.label}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Review Management</h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">Manage all product reviews</p>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeFilter === 'all'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        All Reviews ({counts.all})
                    </button>
                    <button
                        onClick={() => setActiveFilter('approved')}
                        className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeFilter === 'approved'
                            ? 'border-green-600 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Approved ({counts.approved})
                    </button>
                    <button
                        onClick={() => setActiveFilter('pending')}
                        className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeFilter === 'pending'
                            ? 'border-yellow-600 text-yellow-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Pending ({counts.pending})
                    </button>
                    <button
                        onClick={() => setActiveFilter('rejected')}
                        className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeFilter === 'rejected'
                            ? 'border-red-600 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Rejected ({counts.rejected})
                    </button>
                </nav>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No {activeFilter !== 'all' ? activeFilter : ''} reviews found.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredReviews.map((review) => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CardTitle className="text-lg text-gray-900">{review.customer_name}</CardTitle>
                                            {getStatusBadge(review.status)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Product: {review.products?.name || 'Unknown'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <Badge variant="outline" className="whitespace-nowrap">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-700">{review.comment}</p>
                                <div className="flex flex-wrap gap-2">
                                    {review.status !== 'approved' && (
                                        <Button
                                            onClick={() => handleUpdateStatus(review.id, 'approved')}
                                            disabled={loading === review.id}
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Check className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                    )}
                                    {review.status !== 'rejected' && review.status !== 'pending' && (
                                        <Button
                                            onClick={() => handleUpdateStatus(review.id, 'rejected')}
                                            disabled={loading === review.id}
                                            size="sm"
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                        >
                                            <X className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    )}
                                    {review.status === 'pending' && (
                                        <Button
                                            onClick={() => handleUpdateStatus(review.id, 'rejected')}
                                            disabled={loading === review.id}
                                            size="sm"
                                            variant="destructive"
                                        >
                                            <X className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => handleDelete(review.id)}
                                        disabled={loading === review.id}
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
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
