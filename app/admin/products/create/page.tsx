import { createClient } from '@/utils/supabase/server';
import CreateProductForm from './CreateProductForm';

export const dynamic = 'force-dynamic';

export default async function CreateProductPage() {
    const supabase = await createClient();

    // Fetch UMKM list for dropdown
    const { data: umkmList, error } = await supabase
        .from('umkm_profiles')
        .select('id, name')
        .order('name');

    if (error) {
        console.error('Error fetching UMKM:', error);
        return <div>Error loading UMKM list</div>;
    }

    return <CreateProductForm umkmList={umkmList || []} />;
}
