import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from '@/app/profile/ProfileClient';

export default async function ProfilePage() {
    const supabase = await createClient();

    // 1. User checken
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // 2. ALLE Daten abrufen
    // WICHTIG: Hier fehlten vorher die neuen Felder, deshalb wurden sie nicht angezeigt!
    const { data: school, error } = await supabase
        .from('driving_school')
        .select(`
            id, 
            name, 
            city, 
            address, 
            PLZ, 
            phone_number, 
            email, 
            website, 
            driving_price, 
            grundgebuehr, 
            praxispruefung, 
            theorypruefung, 
            is_premium
        `)
        .eq('admin_id', user.id)
        .single();

    if (error || !school) return <div className="p-8 text-center">Keine Daten gefunden.</div>;

    // 3. Statistiken (unverändert)
    let stats = null;
    if (school.city) {
        const { data: citySchools } = await supabase
            .from('driving_school')
            .select('driving_price, grundgebuehr')
            .eq('city', school.city)
            .eq('is_published', true);

        if (citySchools && citySchools.length > 0) {
            const totalSchools = citySchools.length;
            const avgDrivingPrice = Math.round(citySchools.reduce((a, c) => a + (c.driving_price || 0), 0) / totalSchools);
            const avgGrundgebuehr = Math.round(citySchools.reduce((a, c) => a + (c.grundgebuehr || 0), 0) / totalSchools);
            const cityRank = citySchools.filter(s => (s.driving_price || 0) < school.driving_price).length + 1;
            stats = { avgDrivingPrice, avgGrundgebuehr, totalSchools, cityRank };
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50">
            <ProfileClient school={school} stats={stats} />
        </div>
    );
}