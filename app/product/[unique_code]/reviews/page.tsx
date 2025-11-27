import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProductReviews from './ProductReviewsClient'; // Client Component
import { Metadata } from 'next';

type Props = {
    params: Promise<{ unique_code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { unique_code } = await params;
    const supabase = await createClient();
    const { data: product } = await supabase
        .from('products')
        .select('name')
        .eq('unique_code', unique_code)
        .single();

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `Reviews - ${product.name}`,
    };
}

export default async function ReviewsPage({ params }: Props) {
    const { unique_code } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select(`
      *,
      approvedReviews:reviews(*)
    `)
        .eq('unique_code', unique_code)
        .eq('status', 'active')
        .single();

    if (error || !product) {
        console.error('Error fetching product:', error);
        notFound();
    }

    // Filter reviews manually if needed (or rely on RLS/Query if adjusted)
    // @ts-ignore
    product.approvedReviews = product.approvedReviews.filter((r: any) => r.status === 'approved');

    return <ProductReviews product={product} />;
}
