import { createClient } from '@/utils/supabase/server';
import ProductList from './ProductList';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            umkm_profiles (
                name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return <div>Error loading products</div>;
    }

    // Transform data to match the expected type if necessary, 
    // though Supabase typing should handle it if set up correctly.
    // We might need to cast or ensure the join is typed.

    return (
        <ProductList initialProducts={products as any} />
    );
}
