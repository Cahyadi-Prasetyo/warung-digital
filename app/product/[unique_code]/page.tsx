import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProductShow from './ProductShow'; // Client Component
import { Metadata } from 'next';
import { headers } from 'next/headers';

type Props = {
    params: Promise<{ unique_code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { unique_code } = await params;
    const supabase = await createClient();
    const { data: product } = await supabase
        .from('products')
        .select('name, umkm_profiles(name)')
        .eq('unique_code', unique_code)
        .single();

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    // @ts-ignore - Supabase types might be tricky with joins
    const umkmName = product.umkm_profiles?.name || 'UMKM';
    return {
        title: `${product.name} - ${umkmName} `,
    };
}

export default async function ProductPage({ params }: Props) {
    const { unique_code } = await params;
    const supabase = await createClient();

    // Fetch product with relations
    const { data: product, error } = await supabase
        .from('products')
        .select(`
      *,
      umkmProfile:umkm_profiles(*),
      images:product_images(*),
      approvedReviews:reviews(*)
    `)
        .eq('unique_code', unique_code)
        .eq('status', 'active')
        .single();

    if (error || !product) {
        console.error('Error fetching product:', error);
        notFound();
    }

    // Track QR Scan
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await supabase.from('qr_scans').insert({
        product_id: product.id,
        scanned_at: new Date().toISOString(),
        ip_address: ip,
        user_agent: userAgent,
    });

    // Filter reviews manually if needed, or rely on RLS/Query
    // The query above fetches all reviews, we might want to filter by status='approved'
    // But Supabase select with filter on relation is tricky in one go without modifiers.
    // Let's filter in JS for now or refine query.
    // Actually, we can use: reviews(..., status.eq.approved) but the syntax is specific.
    // Simple JS filter:
    // @ts-ignore
    product.approvedReviews = product.approvedReviews.filter((r: any) => r.status === 'approved');

    return <ProductShow product={product} />;
}
