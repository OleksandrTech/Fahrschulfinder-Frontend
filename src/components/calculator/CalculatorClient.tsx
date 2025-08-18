// src/app/calculator/CalculatorClient.tsx
"use client";

import { useState } from "react";
import CityFilter from "@/components/calculator/CityFilter";
import SchoolList from "@/components/calculator/SchoolList";
import LessonSliders from "@/components/calculator/LessonSliders"; // Import the new component
import { getSchoolsByCity } from "@/app/actions/schoolActions";

type School = {
    name: string;
    address: string;
    theory_price: number;
    driving_price: number;
};

// Define the shape of the lesson counts
interface LessonCounts {
    theory: number;
    driving: number;
}

export default function CalculatorClient({ cities }: { cities: string[] }) {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    // Add state for lesson counts, with initial values
    const [lessonCounts, setLessonCounts] = useState<LessonCounts>({ theory: 14, driving: 20 });

    const handleFindSchools = async () => {
        if (!selectedCity) return;
        setIsLoading(true);
        setSearched(true);
        const result = await getSchoolsByCity(selectedCity);
        setSchools(result);
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Führerschein Cost Calculator</h1>
            <div className="flex items-end gap-4">
                <CityFilter cities={cities} onCitySelect={setSelectedCity} />
                <button
                    onClick={handleFindSchools}
                    disabled={!selectedCity || isLoading}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isLoading ? 'Searching...' : 'Find'}
                </button>
            </div>

            {/* Add the sliders and pass the state updater function */}
            <LessonSliders onLessonsChange={setLessonCounts} />

            {/* If a search has been made, show the list and pass the lesson counts */}
            {searched && <SchoolList schools={schools} lessons={lessonCounts} />}
        </div>
    );
}