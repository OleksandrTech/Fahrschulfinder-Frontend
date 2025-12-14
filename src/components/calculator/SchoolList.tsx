// src/components/calculator/SchoolList.tsx
import Link from 'next/link';
import {
    calculatePrice,
    ExperienceLevel,
    experienceLevels,
} from "@/lib/priceCalculator";
import { ChevronRight, CheckCircle2, Trophy } from 'lucide-react';

interface School {
    id: string;
    name: string;
    address: string;
    grundgebuehr: number;
    driving_price: number;
    theorypruefung: number;
    praxispruefung: number;
    is_premium: boolean; // Wichtig: Typ aktualisieren
}

interface SchoolListProps {
    schools: School[];
    selectedLevel: ExperienceLevel;
}

export default function SchoolList({
    schools,
    selectedLevel,
}: SchoolListProps) {
    if (schools.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                <p className="text-gray-500 font-medium">
                    Keine Fahrschulen in dieser Stadt gefunden.
                </p>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    // 1. Preise berechnen und Daten anreichern
    const schoolsWithPrices = schools.map(school => {
        return {
            ...school,
            totalPrice: calculatePrice(school, selectedLevel)
        };
    });

    // 2. Sortieren: Erst Premium, dann Preis (aufsteigend)
    const sortedSchools = schoolsWithPrices.sort((a, b) => {
        // Wenn a Premium ist und b nicht -> a kommt zuerst (-1)
        if (a.is_premium && !b.is_premium) return -1;
        // Wenn b Premium ist und a nicht -> b kommt zuerst (1)
        if (!a.is_premium && b.is_premium) return 1;
        
        // Wenn beide gleich sind (beide Premium oder beide Standard), entscheidet der Preis
        return a.totalPrice - b.totalPrice;
    });

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Suchergebnisse 
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-normal">
                    {schools.length} Schulen
                </span>
            </h2>
            <div className="grid gap-4">
                {sortedSchools.map((school) => {
                    return (
                        <Link href={`/school/${school.id}`} key={school.id} className="group block">
                            <div className={`
                                relative p-6 rounded-xl border shadow-sm transition-all duration-200 flex flex-col sm:flex-row justify-between items-center gap-4
                                ${school.is_premium 
                                    ? 'bg-blue-50/30 border-blue-200 hover:border-blue-400 hover:shadow-md' 
                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                                }
                            `}>
                                {/* Premium Badge (Absolut positioniert oder inline) */}
                                {school.is_premium && (
                                    <div className="absolute top-0 right-0 mt-3 mr-3 md:mt-4 md:mr-4">
                                        <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                            <CheckCircle2 size={10} /> Empfohlen
                                        </span>
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {school.name}
                                        </h3>
                                        {/* Kleines Icon neben dem Namen für Premium */}
                                        {school.is_premium && (
                                            <Trophy size={16} className="text-yellow-500 fill-yellow-500" />
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                        {school.address}
                                    </p>
                                    
                                    {/* Optional: Premium Features hervorheben */}
                                    {school.is_premium && (
                                        <div className="mt-2 text-xs text-blue-700 font-medium flex gap-2">
                                            <span>✓ Top Bewertung</span>
                                            <span>✓ Schnelle Termine</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="text-right flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                            {experienceLevels[selectedLevel].label} Paket
                                        </span>
                                        <span className="text-2xl font-extrabold text-blue-600">
                                            {formatPrice(school.totalPrice)}
                                        </span>
                                    </div>
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${school.is_premium ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}