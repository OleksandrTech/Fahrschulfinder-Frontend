// src/app/actions/schoolActions.ts
"use server";

// CORRECT: We only import the versatile server client.
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUniqueCities() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('driving_school')
        .select('city')
        .eq('is_published', true);

    if (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
    if (!data) return [];

    const uniqueCities = [...new Set(data.map(item => item.city).filter(Boolean) as string[])];
    return uniqueCities;
}

export async function getSchoolsByCity(city: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('driving_school')
        .select('name, address, theory_price, driving_price')
        .eq('city', city)
        .eq('is_published', true);

    if (error) {
        console.error('Error fetching schools:', error);
        return [];
    }
    return data || [];
}

export async function updateSchoolPrices(formData: FormData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("You must be logged in to update school prices.");
    }

    const theoryPrice = formData.get('theoryPrice');
    const drivingPrice = formData.get('drivingPrice');

    if (theoryPrice === null || drivingPrice === null) {
        throw new Error("Both theory and driving prices are required.");
    }

    const { error } = await supabase
        .from('driving_school')
        .update({
            theory_price: Number(theoryPrice),
            driving_price: Number(drivingPrice),
        })
        .eq('admin_id', user.id);

    if (error) {
        throw new Error("Could not update the school prices.");
    }
    
    revalidatePath('/profile');
    return { success: true, message: "Prices updated successfully!" };
}