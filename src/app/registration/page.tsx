// src/app/registration/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getUniqueCities } from '@/app/actions/schoolActions';

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
        phoneNumber: '',
        schoolEmail: '',
        website: '',
        grundGebuehr: '',
        theoryPruefung: '',
        praxisPruefung: '',
        drivingPrice: '',
    });

    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const suggestionsRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        async function loadCities() {
            try {
                const cities = await getUniqueCities();
                setAvailableCities(cities);
            } catch (err) {
                console.error("Fehler beim Laden der Städte:", err);
            }
        }
        loadCities();

        function handleClickOutside(event: MouseEvent) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowCitySuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, city: value }));

        if (value.length > 0) {
            const filtered = availableCities.filter(city => 
                city.toLowerCase().includes(value.toLowerCase())
            );
            setCitySuggestions(filtered);
            setShowCitySuggestions(true);
        } else {
            setCitySuggestions([]);
            setShowCitySuggestions(false);
        }
    };

    const selectCity = (city: string) => {
        setFormData(prev => ({ ...prev, city: city }));
        setShowCitySuggestions(false);
    };

    useEffect(() => {
        setPasswordsMatch(formData.password === formData.confirmPassword && formData.password !== '');
    }, [formData.password, formData.confirmPassword]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordsMatch) {
            setError("Passwörter stimmen nicht überein.");
            return;
        }

        const cityExists = availableCities.some(
            c => c.toLowerCase() === formData.city.trim().toLowerCase()
        );

        if (!cityExists) {
            setError("Bitte wählen Sie eine Stadt aus der Vorschlagsliste. Wir sind derzeit nur in ausgewählten Städten verfügbar.");
            return;
        }

        setError(null);
        setLoading(true);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (authError || !authData.user) {
            setError(authError?.message || "Fehler bei der Registrierung.");
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
            setError(adminError?.message || "Admin Profil konnte nicht erstellt werden.");
            setLoading(false);
            return;
        }

        const schoolData = {
            name: formData.schoolName,
            address: formData.address,
            city: availableCities.find(c => c.toLowerCase() === formData.city.trim().toLowerCase()) || formData.city,
            PLZ: formData.plz,
            phone_number: formData.phoneNumber,
            email: formData.schoolEmail,
            website: formData.website,
            driving_price: Number(formData.drivingPrice),
            grundgebuehr: Number(formData.grundGebuehr),
            theorypruefung: Number(formData.theoryPruefung),
            praxispruefung: Number(formData.praxisPruefung),
            admin_id: admin.id,
        };

        const { error: schoolError } = await supabase
            .from('driving_school')
            .insert(schoolData as any);

        if (schoolError) {
            setError(schoolError.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        alert("Registrierung erfolgreich! Bitte überprüfe deine E-Mails.");
        router.push('/login');
    };

    const isFormComplete = 
        formData.email && formData.password && formData.fullName && 
        formData.schoolName && formData.address && formData.city && formData.plz &&
        formData.drivingPrice && formData.grundGebuehr;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50 relative">
            
            {/* --- ZURÜCK BUTTON --- */}
            <Link 
                href="/" 
                className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium"
            >
                <ArrowLeft size={20} className="mr-2" /> Zur Startseite
            </Link>

            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg mt-10 md:mt-0">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Fahrschule Registrieren</h2>
                <form onSubmit={handleSignUp} className="space-y-4">

                    <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">Admin Login Daten</h3>
                    <input name="fullName" type="text" placeholder="Dein vollständiger Name" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />
                    <input name="email" type="email" placeholder="Login E-Mail Adresse" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />

                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Passwort (min. 6 Zeichen)"
                            onChange={handleChange}
                            className="w-full p-3 border rounded text-gray-900"
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Passwort bestätigen"
                            onChange={handleChange}
                            className={`w-full p-3 border rounded text-gray-900 ${
                                !passwordsMatch && formData.confirmPassword.length > 0 
                                ? "border-red-500 focus:ring-red-500" 
                                : ""
                            }`}
                            required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="h-6">
                        {passwordsMatch ? (
                            <div className="flex items-center text-green-600 text-sm animate-in fade-in slide-in-from-top-1">
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Passwörter stimmen überein!
                            </div>
                        ) : (formData.confirmPassword.length > 0 && (
                            <div className="flex items-center text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="h-4 w-4 mr-2" /> Passwörter stimmen nicht überein
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700">Fahrschul-Details</h3>
                    <input name="schoolName" type="text" placeholder="Name der Fahrschule" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />
                    <input name="address" type="text" placeholder="Straße & Hausnummer" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />
                    
                    <div className="flex gap-4">
                        <div className="w-full relative">
                            <input 
                                name="city" 
                                type="text" 
                                placeholder="Stadt (auswählen)" 
                                value={formData.city}
                                onChange={handleCityChange} 
                                className="w-full p-3 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                                required 
                                autoComplete="off"
                            />
                            {showCitySuggestions && citySuggestions.length > 0 && (
                                <ul ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {citySuggestions.map((city, idx) => (
                                        <li 
                                            key={idx} 
                                            onClick={() => selectCity(city)}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 flex items-center"
                                        >
                                            <MapPin size={14} className="mr-2 text-gray-400"/> {city}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <input name="plz" type="text" placeholder="PLZ" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="text-sm font-semibold text-gray-600">Öffentliche Kontaktdaten</label>
                        <input name="phoneNumber" type="tel" placeholder="Telefonnummer (z.B. 0176...)" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" />
                        <input name="schoolEmail" type="email" placeholder="Kontakt E-Mail (öffentlich)" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" />
                        <input name="website" type="text" placeholder="Webseite (www.beispiel.de)" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" />
                    </div>

                    <h3 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700">Preise (€)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input name="grundGebuehr" type="number" placeholder="Grundgebühr" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required min="0" />
                        <input name="theoryPruefung" type="number" placeholder="Theorieprüfung" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required min="0" />
                        <input name="praxisPruefung" type="number" placeholder="Praxisprüfung" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required min="0" />
                        <input name="drivingPrice" type="number" placeholder="Fahrstunde (45min)" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required min="0" />
                    </div>

                    {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || !passwordsMatch || !isFormComplete}
                        className="w-full p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 mt-6 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Erstelle Account...' : 'Kostenlos Registrieren'}
                    </button>
                </form>
            </div>
        </div>
    );
}