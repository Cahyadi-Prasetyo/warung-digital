import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Supabase Env Vars Missing!", {
            url: supabaseUrl ? "Set" : "Missing",
            key: supabaseKey ? "Set" : "Missing"
        });
    }

    return createBrowserClient(
        supabaseUrl!,
        supabaseKey!
    );
}
