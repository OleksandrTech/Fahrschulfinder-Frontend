// src/components/calculator/SchoolList.tsx
import Link from 'next/link';
import {
    calculatePrice,
    ExperienceLevel,
    experienceLevels,
} from "@/lib/priceCalculator";
import { ChevronRight } from 'lucide-react';

interface School {
    id: string;
    name: string;
    address: string;
    grundgebuehr: number;
    driving_price: number;
    theorypruefung: number;
    praxispruefung: number;
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

    // Labels mapping (wiederholt, könnte man zentralisieren, aber hier ok)
    const levelLabel = experienceLevels[selectedLevel].label === "Beginner" ? "Anfänger" :
                       experienceLevels[selectedLevel].label === "Some Experience" ? "Fortgeschrittene" : 
                       experienceLevels[selectedLevel].label;

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Suchergebnisse 
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-normal">
                    {schools.length} Schulen
                </span>
            </h2>
            <div className="grid gap-4">
                {schools.map((school) => {
                    const totalPrice = calculatePrice(school, selectedLevel);

                    return (
                        <Link href={`/school/${school.id}`} key={school.id} className="group">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {school.name}
                                    </h3>
                                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                                        {school.address}
                                    </p>
                                </div>
                                
                                <div className="text-right flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Geschätzte Gesamtkosten</span>
                                        <span className="text-2xl font-extrabold text-blue-600">
                                            {formatPrice(totalPrice)}
                                        </span>
                                    </div>
                                    <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
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