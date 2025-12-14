// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
            
            {/* --- ZURÜCK BUTTON --- */}
            <Link 
                href="/" 
                className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium z-10"
            >
                <ArrowLeft size={20} className="mr-2" /> Zur Startseite
            </Link>

            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                
                {/* Linke Seite - Bild & Info */}
                <div className="hidden md:flex w-1/2 bg-gray-900 relative flex-col justify-end p-12 text-white">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-60"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Willkommen zurück!</h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Verwalten Sie Ihre Fahrschule, Kurse und Schüler an einem Ort. 
                            Die effiziente Lösung für modernes Fahrschulmanagement.
                        </p>
                    </div>
                </div>

                {/* Rechte Seite - Login Formular */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Fahrschule Login</h1>
                        <p className="text-gray-500 text-sm mt-1">Melden Sie sich an, um Ihr Fahrschul-Dashboard zu verwalten</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <Link href="#" className="text-sm text-blue-600 hover:underline">Passwort vergessen?</Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center">
                                <span className="mr-2">⚠️</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Wird angemeldet...' : 'Anmelden'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Noch kein Konto?{' '}
                            <Link href="/registration" className="font-semibold text-blue-600 hover:underline">
                                Hier registrieren
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}