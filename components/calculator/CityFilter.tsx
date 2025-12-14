// src/components/calculator/CityFilter.tsx
"use client";

import { useState } from 'react';

interface CityFilterProps {
    cities: string[];
    onCitySelect: (city: string | null) => void; 
}

export default function CityFilter({ cities, onCitySelect }: CityFilterProps) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onCitySelect(null);

        if (value.length > 0) {
            const filteredSuggestions = cities.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (city: string) => {
        setInputValue(city);
        onCitySelect(city);
        setSuggestions([]);
    };

    return (
        <div className="relative w-full">
            <input
                id="city-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="z.B. Solingen"
                className="w-full bg-transparent text-gray-900 font-semibold placeholder:text-gray-400 focus:outline-none py-1 px-2"
                autoComplete="off"
            />

            {suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto left-0">
                    {suggestions.map((city, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(city)}
                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 text-gray-700 font-medium transition-colors border-b border-gray-50 last:border-0"
                        >
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}