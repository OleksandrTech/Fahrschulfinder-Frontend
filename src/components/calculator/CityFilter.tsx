// src/components/calculator/CityFilter.tsx
"use client";

import { useState } from 'react';

interface CityFilterProps {
    cities: string[];
    onCitySelect: (city: string | null) => void; // Callback function to pass the selected city up
}

export default function CityFilter({ cities, onCitySelect }: CityFilterProps) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onCitySelect(null); // Clear selection in parent when user types

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
        onCitySelect(city); // Send the selected city to the parent component
        setSuggestions([]);
    };

    return (
        <div className="relative w-full max-w-xs">
            <label htmlFor="city-input" className="block text-sm font-medium text-gray-700 mb-1">
                Choose your city
            </label>
            <input
                id="city-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="e.g., Solingen"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 text-black"
            />

            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((city, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(city)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black"
                        >
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}