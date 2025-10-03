// src/app/profile/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from '@/app/profile/ProfileClient';

export default async function ProfilePage() {
    const supabase = await createClient();

    // 1. Get the current user
    const { data: { user } } = await supabase.auth.getUser();

    // 2. If no user is logged in, redirect to the login page
    if (!user) {
        redirect('/login');
    }

    // 3. Fetch the school data linked to this user
    const { data: school, error } = await supabase
        .from('driving_school')
        .select('id, name, driving_price, grundgebuehr, praxispruefung, theorypruefung, is_premium')
        .eq('admin_id', user.id)
        .single(); // .single() expects only one row to be returned

    if (error || !school) {
        // Handle case where school data isn't found for a logged-in user
        return <div className="text-center p-8">Could not find your school data. Please contact support.</div>;
    }

    // 4. Render the page, passing the fetched data to the client component
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50">
            {/* The ProfileClient component handles all the user interaction */}
            <ProfileClient school={school} />
        </div>
    );
}