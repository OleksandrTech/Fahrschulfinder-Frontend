// src/app/actions/schoolActions.ts
"use server";

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getUniqueCities() {
    const { data, error } = await supabase.from('driving_school').select('city');

    if (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
    if (!data) return [];

    const uniqueCities = [...new Set(data.map(item => item.city).filter(Boolean) as string[])];
    return uniqueCities;
}

export async function getSchoolsByCity(city: string) {
    const { data, error } = await supabase
        .from('driving_school')
        // Fetch the prices in addition to name and address
        .select('name, address, theory_price, driving_price')
        .eq('city', city);

    if (error) {
        console.error('Error fetching schools:', error);
        return [];
    }
    return data || [];
}