// src/components/school/SchoolProfileDisplay.tsx
"use client";

import { MapPin, Phone, Mail, Globe } from 'lucide-react';

// Define a more complete type for the school data
type School = {
    id: string;
    name: string;
    address: string;
    city: string;
    PLZ: string;
    phone_number?: string; // Optional fields
    email?: string;
    website?: string;
    grundgebuehr: number;
    driving_price: number;
    theorypruefung: number;
    praxispruefung: number;
};

interface SchoolProfileDisplayProps {
    school: School;
}

export default function SchoolProfileDisplay({ school }: SchoolProfileDisplayProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
        }).format(price);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
            {/* Header section */}
            <div className="border-b pb-6 mb-6">
                <h1 className="text-4xl font-bold text-gray-900">{school.name}</h1>
                <div className="flex items-center text-gray-500 mt-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <p>{school.address}, {school.PLZ} {school.city}</p>
                </div>
            </div>

            {/* Contact & Prices Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Left side: Contact Info */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact</h2>
                    <div className="space-y-3">
                        {school.phone_number && (
                            <div className="flex items-center">
                                <Phone className="h-5 w-5 mr-3 text-gray-400" />
                                <a href={`tel:${school.phone_number}`} className="text-blue-600 hover:underline">{school.phone_number}</a>
                            </div>
                        )}
                        {school.email && (
                            <div className="flex items-center">
                                <Mail className="h-5 w-5 mr-3 text-gray-400" />
                                <a href={`mailto:${school.email}`} className="text-blue-600 hover:underline">{school.email}</a>
                            </div>
                        )}
                        {school.website && (
                            <div className="flex items-center">
                                <Globe className="h-5 w-5 mr-3 text-gray-400" />
                                <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {school.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Price List */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Price List</h2>
                    <ul className="space-y-2">
                        <li className="flex justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Grundgebühr</span>
                            <span className="font-bold text-gray-800">{formatPrice(school.grundgebuehr)}</span>
                        </li>
                        <li className="flex justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Driving Lesson (Fahrstunde)</span>
                            <span className="font-bold text-gray-800">{formatPrice(school.driving_price)}</span>
                        </li>
                        <li className="flex justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Theory Exam (Theorieprüfung)</span>
                            <span className="font-bold text-gray-800">{formatPrice(school.theorypruefung)}</span>
                        </li>
                        <li className="flex justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Practical Exam (Praxisprüfung)</span>
                            <span className="font-bold text-gray-800">{formatPrice(school.praxispruefung)}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
