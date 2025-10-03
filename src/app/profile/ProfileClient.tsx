"use client";

import { useState } from 'react';
import { updateSchoolPrices } from '@/app/actions/schoolActions';
import { loadStripe } from '@stripe/stripe-js';

type SchoolData = {
    id: string;
    name: string;
    driving_price: number;
    grundgebuehr: number;
    theorypruefung: number;
    praxispruefung: number;
    is_premium: boolean;
};

export default function ProfileClient({ school }: { school: SchoolData }) {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUpgrading, setIsUpgrading] = useState(false);

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

    async function handleUpgrade() {
        setError(null);
        setIsUpgrading(true);

        try {
            const res = await fetch('/api/stripe/checkout-session', { method: 'POST' });
            if (!res.ok) { throw new Error('Failed to create checkout session.'); }
            const { sessionId } = await res.json();
            
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

            if (!stripe) { throw new Error('Stripe.js failed to load.'); }

            // --- CRITICAL DIAGNOSTIC STEP ---
            // Using `as any` tells TypeScript to trust us and ignore the type error.
            // This will force the code to compile and run in the browser.
            const result = await (stripe as any).redirectTo('checkout', { sessionId });

            // If the code above causes a new error, it will appear in the browser console.
            if (result.error) {
                console.error("Stripe redirect error:", result.error.message);
                setError(result.error.message);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUpgrading(false);
        }
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Manage Your School</h2>
                    <p className="text-lg text-gray-600 ">{school.name}</p>
                </div>
                {school.is_premium && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                        Premium
                    </span>
                )}
            </div>

            {!school.is_premium && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-blue-800">Unlock Premium Features</h3>
                    <p className="text-blue-700 mt-1">Upgrade to get priority listing, add more details to your profile, and more!</p>
                    <button 
                        onClick={handleUpgrade} 
                        disabled={isUpgrading}
                        className="mt-4 w-full p-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isUpgrading ? 'Redirecting...' : 'Upgrade to Premium'}
                    </button>
                </div>
            )}

            <form action={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700">Update Prices</h3>
                
                <div>
                    <label htmlFor="drivingPrice" className="block text-sm font-medium text-gray-700">Driving Lesson Price (€)</label>
                    <input id="drivingPrice" name="drivingPrice" type="number" defaultValue={school.driving_price} className="mt-1 w-full p-3 border rounded" required min="0"/>
                </div>
                <div>
                    <label htmlFor="grundgebuehr" className="block text-sm font-medium text-gray-700">Grundgebühr Price (€)</label>
                    <input id="grundgebuehr" name="grundgebuehr" type="number" defaultValue={school.grundgebuehr} className="mt-1 w-full p-3 border rounded" required min="0"/>
                </div>
                <div>
                    <label htmlFor="praxispruefung" className="block text-sm font-medium text-gray-700">Practical Exam Price (€)</label>
                    <input id="praxispruefung" name="praxispruefung" type="number" defaultValue={school.praxispruefung} className="mt-1 w-full p-3 border rounded" required min="0"/>
                </div>
                <div>
                    <label htmlFor="theorypruefung" className="block text-sm font-medium text-gray-700">Theory Exam Price (€)</label>
                    <input id="theorypruefung" name="theorypruefung" type="number" defaultValue={school.theorypruefung} className="mt-1 w-full p-3 border rounded" required min="0"/>
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