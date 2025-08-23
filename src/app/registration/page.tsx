// src/app/registration/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const supabase = createClient();
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        schoolName: '',
        address: '',
        city: '',
        plz: '',
        grundGebuehr: '',
        theoryPruefung: '',
        praxisPruefung: '',
        drivingPrice: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        setPasswordsMatch(formData.password === formData.confirmPassword && formData.password !== '');
    }, [formData.password, formData.confirmPassword]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordsMatch) {
            setError("Passwords do not match.");
            return;
        }

        setError(null);
        setLoading(true);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (authError || !authData.user) {
            setError(authError?.message || "Could not sign up the user.");
            setLoading(false);
            return;
        }

        const { data: admin, error: adminError } = await supabase
            .from('driving_school_admin')
            .insert({
                id: authData.user.id,
                full_name: formData.fullName,
            })
            .select()
            .single();

        if (adminError || !admin) {
            setError(adminError?.message || "Could not create the admin profile.");
            setLoading(false);
            return;
        }

        const { error: schoolError } = await supabase
            .from('driving_school')
            .insert({
                name: formData.schoolName,
                address: formData.address,
                city: formData.city,
                PLZ: formData.plz,
                driving_price: Number(formData.drivingPrice),
                grundgebuehr: Number(formData.grundGebuehr),
                theorypruefung: Number(formData.theoryPruefung),
                praxispruefung: Number(formData.praxisPruefung),
                admin_id: admin.id,
            });

        if (schoolError) {
            setError(schoolError.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        alert("Registration successful! Please check your email to verify your account.");
        router.push('/login');
    };

    const isFormComplete = Object.values(formData).every(value => value.trim() !== '');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register Your Driving School</h2>
                <form onSubmit={handleSignUp} className="space-y-4">

                    <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">Admin Account Details</h3>
                    <input name="fullName" type="text" placeholder="Your Full Name" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                    <input name="email" type="email" placeholder="Login Email" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />

                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password (min. 6 characters)"
                            onChange={handleChange}
                            className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            aria-label="Toggle confirm password visibility"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="h-6">
                        {passwordsMatch && (
                            <div className="flex items-center text-green-600">
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                <p className="text-sm">Passwords match!</p>
                            </div>
                        )}
                    </div>

                    <h3 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700">School Details</h3>
                    <input name="schoolName" type="text" placeholder="Driving School Name" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                    <input name="address" type="text" placeholder="Street Address" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                    <div className="flex gap-4">
                        <input name="city" type="text" placeholder="City" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                        <input name="plz" type="text" placeholder="Postal Code (PLZ)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400 text-gray-900" required />
                    </div>
                    <div className="flex gap-4">
                        <div className='flex flex-col gap-3'>
                            <input name="grundGebuehr" type="number" placeholder="Grundgebühr Price (€)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400  text-gray-900" required min="0" />
                            <input name="theoryPruefung" type="number" placeholder="TheoryPrüfung Price (€)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400  text-gray-900" required min="0" />
                        </div>

                        <div className='flex flex-col gap-3'>
                            <input name="praxisPruefung" type="number" placeholder="PraxisPrüfung Price (€)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400  text-gray-900" required min="0" />
                            <input name="drivingPrice" type="number" placeholder="Fahrstunde Price (€)" onChange={handleChange} className="w-full p-3 border rounded placeholder:text-gray-400  text-gray-900" required min="0" />
                        </div>
                    </div>

                    {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || !passwordsMatch || !isFormComplete}
                        className="w-full p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}