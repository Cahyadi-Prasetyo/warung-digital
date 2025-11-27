import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import QRGenerator from './QRGenerator';

export const dynamic = 'force-dynamic';

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function QRGeneratorPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch product details
    const { data: product, error } = await supabase
        .from('products')
        .select('id, name, unique_code')
        .eq('id', id)
        .single();

    if (error || !product) {
        notFound();
    }

    return (
        <QRGenerator
            productId={product.id}
            productName={product.name}
            uniqueCode={product.unique_code}
        />
    );
}
