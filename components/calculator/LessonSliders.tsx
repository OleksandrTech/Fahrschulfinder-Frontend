// src/components/calculator/LessonSliders.tsx
"use client";

interface LessonSlidersProps {
    onLessonsChange: (lessons: { theory: number; driving: number }) => void;
}

export default function LessonSliders({ onLessonsChange }: LessonSlidersProps) {
    const handleTheoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const theory = Number(e.target.value);
        // This is a bit complex just to get the other slider's current value
        const driving = Number((document.getElementById('driving-lessons-slider') as HTMLInputElement).value);
        onLessonsChange({ theory, driving });
    };

    const handleDrivingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const driving = Number(e.target.value);
        const theory = Number((document.getElementById('theory-lessons-slider') as HTMLInputElement).value);
        onLessonsChange({ theory, driving });
    };

    return (
        <div className="space-y-6 mt-8 pt-6 border-t">
            {/* Theory Lessons Slider */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="theory-lessons-slider" className="font-semibold text-gray-700">Theory Lessons</label>
                    <span className="text-lg font-bold text-gray-900">14</span> {/* This should be dynamic */}
                </div>
                <input
                    id="theory-lessons-slider"
                    type="range"
                    min="10"
                    max="20"
                    defaultValue="14"
                    onChange={handleTheoryChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>10 lessons</span>
                    <span>20 lessons</span>
                </div>
            </div>

            {/* Driving Lessons Slider */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="driving-lessons-slider" className="font-semibold text-gray-700">Driving Lessons</label>
                    <span className="text-lg font-bold text-gray-900">20</span> {/* This should be dynamic */}
                </div>
                <input
                    id="driving-lessons-slider"
                    type="range"
                    min="15"
                    max="40"
                    defaultValue="20"
                    onChange={handleDrivingChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>15 lessons</span>
                    <span>40 lessons</span>
                </div>
            </div>
        </div>
    );
}