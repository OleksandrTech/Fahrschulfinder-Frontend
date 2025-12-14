// src/components/calculator/CalculatorClient.tsx
"use client";

import { useState } from "react";
import CityFilter from "@/components/calculator/CityFilter";
import SchoolList from "@/components/calculator/SchoolList";
import { getSchoolsByCity } from "@/app/actions/schoolActions";
import { ExperienceLevel, experienceLevels } from "@/lib/priceCalculator";
import { Search, Settings, ChevronDown, ChevronUp, Info } from "lucide-react";

// WICHTIG: Hier wurde "is_premium" hinzugefügt, damit es zur SchoolList passt
type School = {
    id: string;
    name: string;
    address: string;
    PLZ: string;
    grundgebuehr: number;
    driving_price: number;
    theorypruefung: number;
    praxispruefung: number;
    is_premium: boolean; // <--- Das fehlte und hat den Fehler verursacht
};

export default function CalculatorClient({ cities }: { cities: string[] }) {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>("beginner");
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleFindSchools = async () => {
        if (!selectedCity) return;
        setIsLoading(true);
        setSearched(true);
        
        // Die Action gibt jetzt auch is_premium zurück (siehe Schritt 1)
        const result = await getSchoolsByCity(selectedCity);
        
        // Wir casten das Ergebnis auf unseren aktualisierten School Typ
        setSchools(result as School[]);
        setIsLoading(false);
    };

    const levelLabels: Record<ExperienceLevel, string> = {
        beginner: "Anfänger (Keine Erfahrung)",
        someExperience: "Etwas Erfahrung",
        advanced: "Fortgeschritten",
        veryExperienced: "Profikurs (Umschreiber)",
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Finde die günstigste Fahrschule
                </h1>
                <p className="text-gray-500">Vergleiche Preise in deiner Stadt – schnell & transparent.</p>
            </div>

            {/* --- SEARCH BAR --- */}
            <div className="bg-white p-2 md:p-3 rounded-xl shadow-xl border border-gray-200 relative z-10">
                <div className="flex flex-col md:flex-row gap-2">
                    
                    {/* 1. City Input */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                        <label className="block text-xs font-bold text-gray-500 uppercase px-2 mb-1">
                            Stadt
                        </label>
                        <CityFilter cities={cities} onCitySelect={setSelectedCity} />
                    </div>

                    {/* Divider (Desktop only) */}
                    <div className="hidden md:block w-px bg-gray-200 my-2"></div>

                    {/* 2. Experience Level Dropdown */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                        <label className="block text-xs font-bold text-gray-500 uppercase px-2 mb-1">
                            Erfahrung
                        </label>
                        <div className="px-2">
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value as ExperienceLevel)}
                                className="w-full bg-transparent text-gray-900 font-semibold focus:outline-none cursor-pointer py-1"
                            >
                                {Object.entries(experienceLevels).map(([key]) => (
                                    <option key={key} value={key}>
                                        {levelLabels[key as ExperienceLevel]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 3. Search Button */}
                    <div className="md:w-auto">
                        <button
                            onClick={handleFindSchools}
                            disabled={!selectedCity || isLoading}
                            className="w-full h-full md:px-8 py-3 md:py-0 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Suchen...</span>
                            ) : (
                                <>
                                    <Search size={20} />
                                    <span>Preise prüfen</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* --- ADVANCED SETTINGS TOGGLE --- */}
                <div className="mt-2 px-2">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors py-2"
                    >
                        {showAdvanced ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />}
                        Erweiterte Einstellungen & Details
                    </button>

                    {showAdvanced && (
                        <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in slide-in-from-top-2 fade-in">
                            <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center">
                                <Settings size={14} className="mr-2" />
                                Berechnungsgrundlage für {levelLabels[selectedLevel]}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Fahrstunden</span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {experienceLevels[selectedLevel].drivingLessons} <span className="text-sm font-normal text-gray-500">Stunden</span>
                                    </p>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Theorie</span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {experienceLevels[selectedLevel].theoryExams} <span className="text-sm font-normal text-gray-500">Prüfung(en)</span>
                                    </p>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Praxis</span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {experienceLevels[selectedLevel].practicalExams} <span className="text-sm font-normal text-gray-500">Prüfung(en)</span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-start gap-2 text-xs text-blue-600/80">
                                <Info size={14} className="mt-0.5 shrink-0" />
                                <p>Diese Werte sind Schätzungen basierend auf typischen Anforderungen für dieses Erfahrungslevel. Die tatsächliche Stundenanzahl kann variieren.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {searched && (
                <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <SchoolList schools={schools} selectedLevel={selectedLevel} />
                </div>
            )}
        </div>
    );
}