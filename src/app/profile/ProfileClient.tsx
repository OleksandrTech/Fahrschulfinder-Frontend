// src/components/profile/ProfileClient.tsx
"use client";

import { useState } from 'react';
import { updateSchoolPrices } from '@/app/actions/schoolActions';

// Define the type for the school data that this component receives
type SchoolData = {
    id: number;
    name: string;
    theory_price: number;
    driving_price: number;
};

export default function ProfileClient({ school }: { school: SchoolData }) {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // This function will be called when the form is submitted.
    // It's an async function that handles the server action call.
    async function handleSubmit(formData: FormData) {
        setMessage(null);
        setError(null);
        try {
            const result = await updateSchoolPrices(formData);
            if (result.success) {
                setMessage(result.message);
            }
        } catch (e: any) {
            setError(e.message);
        }
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Manage Your School</h2>
            <p className="text-lg text-gray-600 mb-6">{school.name}</p>

            {/* The form calls the server action directly */}
            <form action={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700">Update Lesson Prices</h3>
                <div>
                    <label htmlFor="theoryPrice" className="block text-sm font-medium text-gray-700">Theory Lesson Price (€)</label>
                    <input
                        id="theoryPrice"
                        name="theoryPrice"
                        type="number"
                        defaultValue={school.theory_price} // Use defaultValue for initial value
                        className="mt-1 w-full p-3 border rounded"
                        required
                        min="0"
                    />
                </div>
                <div>
                    <label htmlFor="drivingPrice" className="block text-sm font-medium text-gray-700">Driving Lesson Price (€)</label>
                    <input
                        id="drivingPrice"
                        name="drivingPrice"
                        type="number"
                        defaultValue={school.driving_price} // Use defaultValue for initial value
                        className="mt-1 w-full p-3 border rounded"
                        required
                        min="0"
                    />
                </div>

                {message && <p className="text-green-600 bg-green-100 p-3 rounded text-center">{message}</p>}
                {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center">{error}</p>}

                <button type="submit" className="w-full p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
                    Save Changes
                </button>
            </form>
        </div>
    );
}