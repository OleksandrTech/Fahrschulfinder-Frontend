// src/app/profile/ProfileClient.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSchoolPrices, updateSchoolSettings } from '@/app/actions/schoolActions';
import { 
    LayoutDashboard, 
    Euro, 
    Settings, 
    LogOut, 
    MapPin, 
    Trophy, 
    TrendingUp, 
    Building2, 
    Save, 
    Phone, 
    Mail, 
    Globe, 
    Home, 
    CheckCircle2,
    Lock,           // Neu
    Eye,            // Neu
    MousePointer,   // Neu
    UserCheck,      // Neu
    Lightbulb,      // Neu
    Info,           // Neu
    ExternalLink    // Neu
} from 'lucide-react';
import { logout } from "@/app/auth/actions/authActions";

// --- Typen ---
type SchoolData = {
    id: string;
    name: string;
    city: string;
    address?: string;
    PLZ?: string;
    phone_number?: string;
    email?: string; 
    website?: string;
    driving_price: number;
    grundgebuehr: number;
    theorypruefung: number;
    praxispruefung: number;
    is_premium: boolean;
};

type StatsData = {
    avgDrivingPrice: number;
    avgGrundgebuehr: number;
    totalSchools: number;
    cityRank: number;
} | null;

// --- Hauptkomponente ---
export default function ProfileClient({ school, stats }: { school: SchoolData, stats: StatsData }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'prices' | 'settings'>('dashboard');
    
    // States für Feedback-Nachrichten
    const [priceMsg, setPriceMsg] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);
    
    const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
    const [settingsError, setSettingsError] = useState<string | null>(null);

    // --- Handler: Preise speichern ---
    async function handlePriceSubmit(formData: FormData) {
        setPriceMsg(null);
        setPriceError(null);
        try {
            const result = await updateSchoolPrices(formData);
            if (result.success) {
                setPriceMsg(result.message);
            }
        } catch (e: any) {
            setPriceError(e.message);
        }
    }

    // --- Handler: Einstellungen (Kontakt) speichern ---
    async function handleSettingsSubmit(formData: FormData) {
        setSettingsMsg(null);
        setSettingsError(null);
        try {
            const result = await updateSchoolSettings(formData);
            if (result.success) {
                setSettingsMsg("Profil erfolgreich aktualisiert!");
            }
        } catch (e: any) {
            setSettingsError(e.message);
        }
    }

    // --- Statistik Berechnungen ---
    const avgPrice = stats?.avgDrivingPrice || 0;
    const priceDiff = school.driving_price - avgPrice;
    const priceColor = priceDiff > 0 ? 'text-red-600' : 'text-green-600';
    const priceText = avgPrice === 0 
        ? 'Keine Daten' 
        : (priceDiff > 0 ? `+${priceDiff}€ über Ø` : `${priceDiff}€ unter Ø`);

    return (
        <div className="flex h-screen bg-gray-100 w-full max-w-[1920px]">
            
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-blue-500">⚡</span> Fahrschulfinder
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Admin Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem 
                        icon={<LayoutDashboard size={20} />} 
                        label="Übersicht" 
                        active={activeTab === 'dashboard'} 
                        onClick={() => setActiveTab('dashboard')} 
                    />
                    <SidebarItem 
                        icon={<Euro size={20} />} 
                        label="Preise verwalten" 
                        active={activeTab === 'prices'} 
                        onClick={() => setActiveTab('prices')} 
                    />
                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <p className="px-4 text-xs font-semibold text-slate-500 mb-2 uppercase">Konto</p>
                        <SidebarItem 
                            icon={<Settings size={20} />} 
                            label="Einstellungen" 
                            active={activeTab === 'settings'} 
                            onClick={() => setActiveTab('settings')} 
                        />
                    </div>
                    {/* Zur Website Button */}
                    <div className="pt-2">
                        <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium">
                            <ExternalLink size={20} /><span>Zur Website</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form action={logout}>
                        <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
                            <LogOut size={18} />
                            <span>Abmelden</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} />
                        <span className="font-semibold text-gray-900">{school.city}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                                {school.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{school.name}</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    
                    {/* --- TAB 1: DASHBOARD --- */}
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Marktübersicht {school.city}</h2>
                                    <p className="text-gray-500">Vergleich basierend auf {stats?.totalSchools || 0} Fahrschulen.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-2.5 h-2.5 rounded-full ${school.is_premium ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></span>
                                        <span className={`font-bold ${school.is_premium ? 'text-green-700' : 'text-gray-600'}`}>{school.is_premium ? 'Premium Aktiv' : 'Standard'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* --- NEU: HINWEIS BOX --- */}
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                                <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="font-semibold text-blue-900 text-sm">Sichtbarkeit deiner Kontaktdaten</h4>
                                    <p className="text-blue-700/80 text-sm mt-1">
                                        Im öffentlichen Vergleich werden <strong>keine Kontaktdaten</strong> angezeigt (außer bei Premium). 
                                        Die visibilität deiner Fahrschule wird eingeschränkt.
                                    </p>
                                </div>
                            </div>

                            {/* Statistik Karten */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard 
                                    title="Dein Fahrstundenpreis" 
                                    value={`${school.driving_price}€`} 
                                    subValue={priceText}
                                    subColor={priceColor}
                                    icon={<Euro className="text-blue-600" />} 
                                />
                                <StatCard 
                                    title="Ø Preis in Stadt" 
                                    value={`${stats?.avgDrivingPrice || '-'}€`} 
                                    subValue="Durchschnitt"
                                    icon={<TrendingUp className="text-purple-600" />} 
                                />
                                <StatCard 
                                    title="Preis-Ranking" 
                                    value={`Platz ${stats?.cityRank || '-'}`} 
                                    subValue={`von ${stats?.totalSchools || '-'} Schulen`}
                                    icon={<Trophy className="text-yellow-600" />} 
                                />
                                <StatCard 
                                    title="Konkurrenz" 
                                    value={stats?.totalSchools.toString() || '-'} 
                                    subValue="Fahrschulen gelistet"
                                    icon={<Building2 className="text-gray-600" />} 
                                />
                            </div>

                            {/* Info Box & Premium Box */}
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Lightbulb size={20} className="text-yellow-500"/> Dein Optimierungs-Tipp
                                    </h3>
                                    {priceDiff > 5 ? (
                                        <p className="text-gray-600">
                                            Dein Fahrstundenpreis liegt <strong>{priceDiff}€ über dem Durchschnitt</strong> in {school.city}. 
                                            Stelle sicher, dass deine Qualitätsmerkmale im Profil gut sichtbar sind.
                                        </p>
                                    ) : priceDiff < -5 ? (
                                        <p className="text-gray-600">
                                            Du bist <strong>{Math.abs(priceDiff)}€ günstiger</strong> als der Durchschnitt! 
                                            Das ist ein starkes Verkaufsargument.
                                        </p>
                                    ) : (
                                        <p className="text-gray-600">
                                            Dein Preis liegt genau im Marktdurchschnitt. Achte auf gute Bewertungen und ein vollständiges Profil.
                                        </p>
                                    )}
                                </div>

                                {/* Premium Status Box */}
                                <div className="lg:col-span-1">
                                    {!school.is_premium ? (
                                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-6 shadow-lg h-full flex flex-col justify-between relative overflow-hidden">
                                            <div className="relative z-10">
                                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                                                    <Trophy className="text-yellow-300" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">Premium Partner werden</h3>
                                                <p className="text-blue-100 mb-4 text-sm">Mehr Sichtbarkeit für deine Schule.</p>
                                            </div>
                                            <div className="relative z-10 bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/20">
                                                <p className="text-xs text-blue-200 mb-1">Upgrade via Support</p>
                                                <span className="font-bold">Kontakt aufnehmen</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-green-800">Premium Aktiv</h3>
                                            <p className="text-green-600 mt-2 text-sm">Dein Profil wird bevorzugt.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* --- NEU: BESUCHER STATISTIK (LOCKED für Standard) --- */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-blue-600"/> 
                                    Performance & Besucher (30 Tage)
                                </h3>
                                
                                <div className="relative">
                                    {!school.is_premium && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300">
                                            <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-md border border-gray-100">
                                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Lock size={24} />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">Besucherzahlen sehen</h3>
                                                <p className="text-gray-500 text-sm mb-4">
                                                    Werde Premium-Partner, um zu sehen, wie viele Schüler dich suchen.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${!school.is_premium ? 'filter blur-sm select-none opacity-50' : ''}`}>
                                        <StatCard title="Profilaufrufe" value="1,204" subValue="+12% zum Vormonat" icon={<Eye className="text-blue-500" />} />
                                        <StatCard title="Webseiten-Klicks" value="342" subValue="Durch Premium-Link" icon={<MousePointer className="text-green-500" />} />
                                        <StatCard title="Kontaktanfragen" value="48" subValue="Anrufe & Mails" icon={<UserCheck className="text-purple-500" />} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* --- TAB 2: PREISE --- */}
                    {activeTab === 'prices' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Preise anpassen</h3>
                                <p className="text-sm text-gray-500">Diese Preise werden für den Kostenrechner verwendet.</p>
                            </div>
                            <div className="p-6 max-w-2xl">
                                <form action={handlePriceSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputGroup label="Fahrstunde (€)" name="drivingPrice" value={school.driving_price} type="number" />
                                        <InputGroup label="Grundgebühr (€)" name="grundgebuehr" value={school.grundgebuehr} type="number" />
                                        <InputGroup label="Theorieprüfung (€)" name="theorypruefung" value={school.theorypruefung} type="number" />
                                        <InputGroup label="Praxisprüfung (€)" name="praxispruefung" value={school.praxispruefung} type="number" />
                                    </div>
                                    
                                    {priceMsg && <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm border border-green-200">{priceMsg}</div>}
                                    {priceError && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-200">{priceError}</div>}
                                    
                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors">
                                        <Save size={18} /> Preise speichern
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: EINSTELLUNGEN (KONTAKT) --- */}
                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Profil & Kontaktdaten</h3>
                                <p className="text-sm text-gray-500">Diese Informationen werden auf deinem öffentlichen Profil angezeigt.</p>
                            </div>
                            <div className="p-6 max-w-2xl">
                                <form action={handleSettingsSubmit} className="space-y-8">
                                    
                                    {/* Sektion: Adresse */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                            <Home size={18} className="text-blue-600"/> Adresse
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            <InputGroup label="Straße & Hausnummer" name="address" value={school.address} placeholder="Musterstraße 12" />
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="col-span-1">
                                                    <InputGroup label="PLZ" name="plz" value={school.PLZ} placeholder="12345" />
                                                </div>
                                                <div className="col-span-2">
                                                    <InputGroup label="Stadt" name="city" value={school.city} placeholder="Musterstadt" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sektion: Kontakt */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                            <Phone size={18} className="text-blue-600"/> Kontaktwege
                                        </h4>
                                        
                                        <div className="space-y-4">
                                            <InputGroup 
                                                label="Telefonnummer" 
                                                name="phoneNumber" 
                                                value={school.phone_number} 
                                                placeholder="z.B. 0176 12345678" 
                                                icon={<Phone size={16} className="text-gray-400" />}
                                            />
                                            
                                            <InputGroup 
                                                label="E-Mail (öffentlich)" 
                                                name="email" 
                                                value={school.email} 
                                                placeholder="info@fahrschule.de" 
                                                type="email"
                                                icon={<Mail size={16} className="text-gray-400" />}
                                            />

                                            {/* --- NEU: WEBSITE LOCKED --- */}
                                            <div className="relative">
                                                <InputGroup 
                                                    label="Webseite" 
                                                    name="website" 
                                                    value={school.website} 
                                                    placeholder="www.meine-fahrschule.de" 
                                                    type="text"
                                                    icon={<Globe size={16} className="text-gray-400" />}
                                                    disabled={!school.is_premium}
                                                />
                                                {!school.is_premium && (
                                                    <div className="absolute right-2 top-8 pointer-events-none">
                                                        <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 shadow-sm">
                                                            <Lock size={12} className="mr-1"/> Premium
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {!school.is_premium && <p className="text-xs text-gray-500 ml-1">* Webseiten-Links sind exklusiv für Premium-Partner.</p>}
                                        </div>
                                    </div>

                                    {/* Feedback Nachrichten */}
                                    {settingsMsg && <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm border border-green-200 flex items-center gap-2"><CheckCircle2 size={16}/> {settingsMsg}</div>}
                                    {settingsError && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-200">{settingsError}</div>}
                                    
                                    <div className="pt-4">
                                        <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors">
                                            <Save size={18} /> Änderungen speichern
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// --- Hilfskomponenten ---

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function StatCard({ title, value, subValue, icon, subColor }: { title: string, value: string, subValue?: string, icon: any, subColor?: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
            </div>
            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <span className="text-2xl font-bold text-gray-900 block">{value}</span>
                {subValue && <span className={`text-xs font-medium mt-1 ${subColor || 'text-gray-500'}`}>{subValue}</span>}
            </div>
        </div>
    );
}

function InputGroup({ label, name, value, type = "text", placeholder, icon, disabled }: { label: string, name: string, value: any, type?: string, placeholder?: string, icon?: any, disabled?: boolean }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input 
                    name={name} 
                    type={type} 
                    defaultValue={value || ''} 
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${icon ? 'pl-10' : ''} ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70' : 'bg-white'}`} 
                />
            </div>
        </div>
    );
}