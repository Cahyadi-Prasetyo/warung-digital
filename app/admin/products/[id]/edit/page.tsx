import { createClient } from '@/utils/supabase/server';
import EditProductForm from './EditProductForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch product data
    const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (productError || !product) {
        notFound();
    }

    // Fetch UMKM list for dropdown
    const { data: umkmList, error: umkmError } = await supabase
        .from('umkm_profiles')
        .select('id, name')
        .order('name');

    if (umkmError) {
        console.error('Error fetching UMKM:', umkmError);
        return <div>Error loading UMKM list</div>;
    }

    // Fetch existing product images
    const { data: existingImages, error: imagesError } = await supabase
        .from('product_images')
        .select('id, image_path, is_featured')
        .eq('product_id', id)
        .order('sort_order');

    return <EditProductForm product={product} umkmList={umkmList || []} existingImages={existingImages || []} />;
}
