// src/components/calculator/SchoolList.tsx
import {
    calculatePrice,
    ExperienceLevel,
    experienceLevels,
} from "@/lib/priceCalculator";

interface School {
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
            <p className="text-gray-500 mt-8 pt-6 border-t text-center">
                No schools found for this city.
            </p>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
        }).format(price);
    };

    return (
        <div className="mt-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Estimated Cost for the{" "}
                <span className="text-blue-600">
                    {experienceLevels[selectedLevel].label}
                </span>{" "}
                Level
            </h2>
            <ul className="space-y-3">
                {schools.map((school, index) => {
                    const totalPrice = calculatePrice(school, selectedLevel);

                    return (
                        <li
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold text-gray-900">{school.name}</p>
                                <p className="text-sm text-gray-500">{school.address}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">
                                    {formatPrice(totalPrice)}
                                </p>
                                <p className="text-xs text-gray-500">Total estimated cost</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}