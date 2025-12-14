// src/app/actions/schoolActions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSchoolSettings(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Nicht autorisiert.");
    }

    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;
    const website = formData.get("website") as string;
    
    // Optional: Auch Adresse updatebar machen
    const address = formData.get("address") as string;
    const plz = formData.get("plz") as string;
    const city = formData.get("city") as string;

    const { error } = await supabase
        .from("driving_school")
        .update({
            phone_number: phoneNumber,
            email: email, // Die öffentliche Kontakt-Email
            website: website,
            address: address,
            PLZ: plz,
            city: city
        })
        .eq("admin_id", user.id);

    if (error) {
        console.error("Update Error:", error);
        throw new Error("Fehler beim Speichern der Einstellungen.");
    }

    revalidatePath("/profile");
    return { success: true, message: "Einstellungen erfolgreich gespeichert!" };
}
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
export async function getSchoolStatistics(city: string, schoolId: string) {
    const supabase = await createClient();
    
    // 1. Alle Fahrschulen in derselben Stadt holen (nur die veröffentlichten)
    const { data: schools, error } = await supabase
        .from('driving_school')
        .select('id, driving_price, grundgebuehr')
        .eq('city', city)
        .eq('is_published', true);

    if (error || !schools || schools.length === 0) {
        return null;
    }

    // 2. Berechnungen durchführen
    const totalSchools = schools.length;
    
    // Durchschnittspreis Fahrstunde
    const totalDrivingPrice = schools.reduce((acc, curr) => acc + (curr.driving_price || 0), 0);
    const avgDrivingPrice = Math.round(totalDrivingPrice / totalSchools);

    // Durchschnittspreis Grundgebühr
    const totalGrund = schools.reduce((acc, curr) => acc + (curr.grundgebuehr || 0), 0);
    const avgGrundgebuehr = Math.round(totalGrund / totalSchools);

    // Ranking (Günstigste Fahrstunde ist Platz 1)
    // Wir sortieren die Schulen nach Preis aufsteigend
    const sortedByPrice = [...schools].sort((a, b) => a.driving_price - b.driving_price);
    // Wir finden den Index unserer eigenen Schule (+1 für "Platz 1" statt "Index 0")
    const rankIndex = sortedByPrice.findIndex(s => s.id === schoolId);
    const cityRank = rankIndex !== -1 ? rankIndex + 1 : totalSchools;

    return {
        avgDrivingPrice,
        avgGrundgebuehr,
        totalSchools,
        cityRank
    };
}
