import { createClient } from '@/utils/supabase/server';
import ReviewList from './ReviewList';

export const dynamic = 'force-dynamic';

export default async function ReviewManagementPage() {
    const supabase = await createClient();

    // Fetch ALL reviews (not just pending)
    const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
            *,
            products (
                name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return <div>Error loading reviews</div>;
    }

    return <ReviewList initialReviews={reviews || []} />;
}
