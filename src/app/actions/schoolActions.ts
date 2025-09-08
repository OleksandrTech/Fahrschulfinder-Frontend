// src/app/actions/schoolActions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUniqueCities() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("driving_school")
        .select("city")
        .eq("is_published", true);

    if (error) {
        console.error("Error fetching cities:", error);
        return [];
    }
    if (!data) return [];

    const uniqueCities = [
        ...new Set(data.map((item) => item.city).filter(Boolean) as string[]),
    ];
    return uniqueCities;
}

export async function getSchoolsByCity(city: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("driving_school")
        .select(
            "id, name, address, driving_price, grundgebuehr, theorypruefung, praxispruefung"
        )
        .eq("city", city)
        .eq("is_published", true);

    if (error) {
        console.error("Error fetching schools:", error);
        return [];
    }
    return data || [];
}

// New function to fetch a single school by its ID
export async function getSchoolById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('driving_school')
        .select('*') // Select all columns for the profile page
        .eq('id', id)
        .eq("is_published", true)
        .single(); // .single() ensures only one row is returned

    if (error) {
        console.error(`Error fetching school with id ${id}:`, error);
        return null; // Return null if there's an error or no school is found
    }

    return data;
}


export async function updateSchoolPrices(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("You must be logged in to update school prices.");
    }

    const drivingPrice = formData.get("drivingPrice");
    const grundgebuehr = formData.get("grundgebuehr");
    const theorypruefung = formData.get("theorypruefung");
    const praxispruefung = formData.get("praxispruefung");

    if (
        drivingPrice === null ||
        grundgebuehr === null ||
        theorypruefung === null ||
        praxispruefung === null
    ) {
        throw new Error("All price fields are required.");
    }

    const { error } = await supabase
        .from("driving_school")
        .update({
            driving_price: Number(drivingPrice),
            grundgebuehr: Number(grundgebuehr),
            theorypruefung: Number(theorypruefung),
            praxispruefung: Number(praxispruefung),
        })
        .eq("admin_id", user.id);

    if (error) {
        throw new Error("Could not update the school prices.");
    }

    revalidatePath("/profile");
    return { success: true, message: "Prices updated successfully!" };
}