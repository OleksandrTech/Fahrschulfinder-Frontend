// src/components/calculator/ExperienceLevelSelector.tsx
"use client";

import {
    experienceLevels,
    ExperienceLevel,
} from "@/lib/priceCalculator";

interface ExperienceLevelSelectorProps {
    onLevelChange: (level: ExperienceLevel) => void;
    selectedLevel: ExperienceLevel;
}

export default function ExperienceLevelSelector({
    onLevelChange,
    selectedLevel,
}: ExperienceLevelSelectorProps) {
    return (
        <div className="my-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Select Your Experience Level
            </h3>
            <div className="flex flex-col gap-4">
                {(Object.keys(experienceLevels) as ExperienceLevel[]).map((level) => (
                    <button
                        key={level}
                        onClick={() => onLevelChange(level)}
                        className={`p-4 rounded-lg transition-all duration-200 w-full flex justify-between items-center ${selectedLevel === level
                                ? "bg-blue-600 text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                            }`}
                    >
                        {/* Left side content */}
                        <p className="font-bold text-lg">
                            {experienceLevels[level].label}
                        </p>

                        {/* Right side content */}
                        <div className="text-right">
                            <p className="text-sm">
                                {experienceLevels[level].drivingLessons} Driving Lessons
                            </p>
                            <p className="text-sm">
                                {experienceLevels[level].theoryExams} Theory Prüfungen
                            </p>
                            <p className="text-sm">
                                {experienceLevels[level].practicalExams} Praxis Prüfungen
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}