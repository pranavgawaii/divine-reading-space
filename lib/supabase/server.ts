import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// No cookies, no auth session maintenance. Just a data client.
// Uses ANON key, but since RLS is disabled, this client has FULL ACCESS.
// SECURITY WARNING: Use this ONLY in Server Components or API Routes.
// DO NOT expose this client or its usage patterns to the client-side unless intended.
// Actually, using Anon key with RLS disabled usually means ANYONE with the key can read/write if exposed client-side.
// The user instruction says "STEP 1: REMOVE RLS POLICIES ENTIRELY".
// "Since we're using Clerk for auth and handling permissions in API routes, we don't need Supabase RLS at all"
// This implies we should ONLY perform DB operations on the SERVER.
export function createClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
