import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProductStory from './ProductStory'; // Client Component
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
        title: `Story - ${product.name}`,
    };
}

export default async function StoryPage({ params }: Props) {
    const { unique_code } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select(`
      *,
      images:product_images(*)
    `)
        .eq('unique_code', unique_code)
        .eq('status', 'active')
        .single();

    if (error || !product) {
        console.error('Error fetching product:', error);
        notFound();
    }

    return <ProductStory product={product} />;
}
