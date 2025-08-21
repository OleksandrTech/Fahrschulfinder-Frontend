// src/components/calculator/CalculatorClient.tsx
"use client";

import { useState } from "react";
import CityFilter from "@/components/calculator/CityFilter";
import SchoolList from "@/components/calculator/SchoolList";
import ExperienceLevelSelector from "@/components/calculator/ExperienceLevelSelector";
import { getSchoolsByCity } from "@/app/actions/schoolActions";
import { ExperienceLevel } from "@/lib/priceCalculator";

type School = {
    name: string;
    address: string;
    grundgebuehr: number;
    driving_price: number;
    theorypruefung: number;
    praxispruefung: number;
};

export default function CalculatorClient({ cities }: { cities: string[] }) {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [selectedLevel, setSelectedLevel] =
        useState<ExperienceLevel>("beginner");

    const handleFindSchools = async () => {
        if (!selectedCity) return;
        setIsLoading(true);
        setSearched(true);
        const result = await getSchoolsByCity(selectedCity);
        setSchools(result);
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Führerschein Cost Calculator
            </h1>

            {/* 1. City Filter is now on its own */}
            <CityFilter cities={cities} onCitySelect={setSelectedCity} />

            {/* 2. Experience level selector stays here */}
            <ExperienceLevelSelector
                selectedLevel={selectedLevel}
                onLevelChange={setSelectedLevel}
            />

            {/* 3. The button is moved here and styled to be full-width */}
            <button
                onClick={handleFindSchools}
                disabled={!selectedCity || isLoading}
                className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
                {isLoading ? "Searching..." : "Find Driving Schools"}
            </button>

            {/* 4. The results will still appear below everything */}
            {searched && (
                <SchoolList schools={schools} selectedLevel={selectedLevel} />
            )}
        </div>
    );
}