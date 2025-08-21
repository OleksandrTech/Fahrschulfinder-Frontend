// src/app/registration/page.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Register() {
    const supabase = createClient();
    const router = useRouter();

    // State to hold all form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        schoolName: '',
        address: '',
        city: '',
        plz: '', 
        // add to supabase table
        grundgebuehr: '',
        theorypruefung: '',
        praxisprufueng: '',
        // add to supabase table
        drivingPrice: '', 
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // A single function to update our form data state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // --- Step 1: Create the login account with Supabase Auth ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (authError || !authData.user) {
            setError(authError?.message || "Could not sign up the user.");
            setLoading(false);
            return;
        }

        // --- Step 2: Create the admin record in your custom table ---
        const { data: admin, error: adminError } = await supabase
            .from('driving_school_admin')
            .insert({
                // We link this record to the auth user
                id: authData.user.id, // Make sure your table's 'id' is a UUID and linked to auth.users
                full_name: formData.fullName,
            })
            .select()
            .single();

        if (adminError || !admin) {
            setError(adminError?.message || "Could not create the admin profile.");
            setLoading(false);
            return;
        }

        // --- Step 3: Create the school record, linking it to the admin ---
        const { error: schoolError } = await supabase
            .from('driving_school')
            .insert({
                name: formData.schoolName,
                address: formData.address,
                city: formData.city,
                PLZ: formData.plz,
                driving_price: Number(formData.drivingPrice),
                grundgebuehr: Number(formData.grundgebuehr),
                theorypruefung: Number(formData.theorypruefung),
                praxisprufueng: Number(formData.praxisprufueng),
                admin_id: admin.id, // This is the foreign key link!
            });

        if (schoolError) {
            setError(schoolError.message);
            setLoading(false);
            return;
        }

        // --- Success! ---
        setLoading(false);
        alert("Registration successful! Please check your email to verify your account.");
        router.push('/login'); // Redirect to login page after successful registration
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register Your Driving School</h2>
                <form onSubmit={handleSignUp} className="space-y-4">

                    <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">Admin Account Details</h3>
                    <input name="fullName" type="text" placeholder="Your Full Name" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                    <input name="email" type="email" placeholder="Login Email" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                    <input name="password" type="password" placeholder="Password (min. 6 characters)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />

                    <h3 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700">School Details</h3>
                    <input name="schoolName" type="text" placeholder="Driving School Name" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                    <input name="address" type="text" placeholder="Street Address" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                    <div className="flex gap-4">
                        <input name="city" type="text" placeholder="City" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                        <input name="plz" type="text" placeholder="Postal Code (PLZ)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                    </div>
                    <div className="flex gap-4">
                        <input name="grundgebuehr" type="number" placeholder="Grundgebühr Price (€)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400  text-gray-900" required min="0" />
                        <input name="theorypruefung" type="number" placeholder="TheoryPrüfung Price (€)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400  text-gray-900" required min="0" />
                        <input name="praxisprufueng" type="number" placeholder="PraxisPrüfung Price (€)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400  text-gray-900" required min="0" />
                        <input name="drivingPrice" type="number" placeholder="Fahrstunde Price (€)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400  text-gray-900" required min="0" />
                    </div>

                    {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:bg-gray-400">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}