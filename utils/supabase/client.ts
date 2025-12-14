// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Use the environment variables we just set up
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}