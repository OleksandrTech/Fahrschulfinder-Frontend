/// src/app/profile/ProfileClient.tsx
"use client";

import { useState } from 'react';
import { updateSchoolPrices } from '@/app/actions/schoolActions';
import { 
    LayoutDashboard, 
    Euro, 
    Settings, 
    LogOut, 
    MapPin, 
    Trophy,
    ChevronRight,
    Bell,
    CheckCircle2,
    Building2,
    TrendingUp
} from 'lucide-react';
import { logout } from "@/app/auth/actions/authActions";

// Typen definieren
type SchoolData = {
    id: string;
    name: string;
    city: string; // Neu: City ist wichtig
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

export default function ProfileClient({ school, stats }: { school: SchoolData, stats: StatsData }) {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'prices' | 'settings'>('dashboard');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    // Berechnungen für die Anzeige (Fallback auf 0 falls keine Stats da sind)
    const avgPrice = stats?.avgDrivingPrice || 0;
    const priceDiff = school.driving_price - avgPrice;
    const priceColor = priceDiff > 0 ? 'text-red-600' : 'text-green-600';
    // Wenn billiger: "5€ günstiger", wenn teurer: "5€ teurer"
    const priceText = avgPrice === 0 ? 'Keine Daten' : (priceDiff > 0 ? `+${priceDiff}€ über Ø` : `${priceDiff}€ unter Ø`);

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
                    
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Marktübersicht {school.city}</h2>
                                    <p className="text-gray-500">Echte Daten basierend auf {stats?.totalSchools || 0} Fahrschulen in deiner Stadt.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${school.is_premium ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        <span className="font-medium text-gray-700">{school.is_premium ? 'Premium Aktiv' : 'Standard'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Statistik Karten (REAL DATA) */}
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
                                    subValue="Durchschnitt aller Schulen"
                                    icon={<TrendingUp className="text-purple-600" />} 
                                />
                                <StatCard 
                                    title="Preis-Ranking" 
                                    value={`Platz ${stats?.cityRank || '-'}`} 
                                    subValue={`von ${stats?.totalSchools || '-'} Schulen`}
                                    icon={<Trophy className="text-yellow-600" />} 
                                    positive={stats && stats.cityRank <= 3}
                                />
                                <StatCard 
                                    title="Konkurrenz" 
                                    value={stats?.totalSchools.toString() || '-'} 
                                    subValue="Fahrschulen gelistet"
                                    icon={<Building2 className="text-gray-600" />} 
                                />
                            </div>

                            {/* Info Box statt Fake Chart */}
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Dein Optimierungs-Tipp</h3>
                                    {priceDiff > 5 ? (
                                        <p className="text-gray-600">
                                            Dein Fahrstundenpreis liegt <strong>{priceDiff}€ über dem Durchschnitt</strong> in {school.city}. 
                                            Überlege, ob du mit speziellen Angeboten oder Paketen für Schüler attraktiver werden kannst, oder hebe deine Premium-Qualität im Profil hervor.
                                        </p>
                                    ) : priceDiff < -5 ? (
                                        <p className="text-gray-600">
                                            Du bist <strong>{Math.abs(priceDiff)}€ günstiger</strong> als der Durchschnitt! 
                                            Das ist ein starkes Verkaufsargument. Wir heben das in deinem öffentlichen Profil hervor.
                                        </p>
                                    ) : (
                                        <p className="text-gray-600">
                                            Dein Preis liegt genau im Marktdurchschnitt. Um dich abzuheben, sind gute Bewertungen und ein vollständiges Profil (Bilder, Öffnungszeiten) besonders wichtig.
                                        </p>
                                    )}
                                </div>

                                {/* Premium Box */}
                                <div className="lg:col-span-1">
                                    {!school.is_premium ? (
                                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-6 shadow-lg h-full flex flex-col justify-between relative overflow-hidden">
                                            <div className="relative z-10">
                                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                                                    <Trophy className="text-yellow-300" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">Werde Premium Partner</h3>
                                                <p className="text-blue-100 mb-4 text-sm">Heb dich von den {stats?.totalSchools || 10} anderen Schulen ab.</p>
                                                <ul className="text-sm space-y-2 mb-6 text-blue-50">
                                                    <li className="flex gap-2">✓ Platz 1 im Ranking</li>
                                                    <li className="flex gap-2">✓ Goldenes Profil</li>
                                                    <li className="flex gap-2">✓ Direkt-Verlinkung Website</li>
                                                </ul>
                                            </div>
                                            <div className="relative z-10 bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/20">
                                                <p className="text-xs text-blue-200 mb-1">Upgrade via Support</p>
                                                <a href="tel:+491234567890" className="text-xl font-bold hover:text-blue-200 transition-colors">0123 456 78 90</a>
                                            </div>
                                            {/* Deko */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-green-800">Premium Aktiv</h3>
                                            <p className="text-green-600 mt-2 text-sm">Dein Profil wird bevorzugt angezeigt.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* PREISE TAB (Identisch zu vorher, nur eingebettet) */}
                    {activeTab === 'prices' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Preise anpassen</h3>
                                <p className="text-sm text-gray-500">Diese Preise werden für den Kostenrechner verwendet.</p>
                            </div>
                            <div className="p-6 max-w-2xl">
                                <form action={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Fahrstunde (€)</label>
                                            <input name="drivingPrice" type="number" defaultValue={school.driving_price} className="w-full p-2.5 border rounded-lg" required min="0"/>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Grundgebühr (€)</label>
                                            <input name="grundgebuehr" type="number" defaultValue={school.grundgebuehr} className="w-full p-2.5 border rounded-lg" required min="0"/>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Theorieprüfung (€)</label>
                                            <input name="theorypruefung" type="number" defaultValue={school.theorypruefung} className="w-full p-2.5 border rounded-lg" required min="0"/>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Praxisprüfung (€)</label>
                                            <input name="praxispruefung" type="number" defaultValue={school.praxispruefung} className="w-full p-2.5 border rounded-lg" required min="0"/>
                                        </div>
                                    </div>
                                    {message && <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm">{message}</div>}
                                    {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Speichern</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                            <Settings className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-gray-900 font-medium">Einstellungen</h3>
                            <p className="text-gray-500">Hier kannst du bald dein Passwort und deine E-Mail ändern.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Hilfskomponenten
function SidebarItem({ icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function StatCard({ title, value, subValue, icon, subColor }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {subValue && <span className={`text-xs font-medium mt-1 ${subColor || 'text-gray-500'}`}>{subValue}</span>}
            </div>
        </div>
    );
}