// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            // Redirect to the profile page on successful login
            router.push('/profile');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded placeholder:text-gray-400 text-black"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded placeholder:text-gray-400 text-black"
                        required
                    />
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center">{error}</p>}
                    <button type="submit" className="w-full p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}