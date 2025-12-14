// src/components/school/SchoolProfileDisplay.tsx
"use client";

import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, CheckCircle2, Car, BookOpen, GraduationCap, Clock, Navigation, ArrowLeft, Lock } from 'lucide-react';

type School = {
    id: string;
    name: string;
    address: string;
    city: string;
    PLZ: string;
    phone_number?: string;
    email?: string;
    website?: string;
    grundgebuehr: number;
    driving_price: number;
    theorypruefung: number;
    praxispruefung: number;
    is_premium?: boolean;
};

interface SchoolProfileDisplayProps {
    school: School;
}

export default function SchoolProfileDisplay({ school }: SchoolProfileDisplayProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const displayUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 py-6">
            
            {/* --- ZURÜCK BUTTON --- */}
            <div>
                <Link 
                    href="/calculator" 
                    className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Zurück zum Vergleich
                </Link>
            </div>

            {/* --- HEADER SECTION --- */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="h-32 md:h-48 bg-gradient-to-r from-slate-800 to-blue-900 relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>
                
                <div className="px-6 md:px-10 pb-8 -mt-12 relative flex flex-col md:flex-row gap-6 items-start md:items-end">
                    <div className="bg-white w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-xl flex items-center justify-center text-4xl md:text-5xl font-bold text-blue-700 border-4 border-white shrink-0">
                        {school.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{school.name}</h1>
                            {school.is_premium && (
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-blue-200">
                                    <CheckCircle2 size={14} /> Verifiziert
                                </span>
                            )}
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-gray-600 mb-4 md:mb-0">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <span className="font-medium">{school.address}, {school.PLZ} {school.city}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons (LOCKED wenn kein Premium) */}
                    <div className="flex gap-3 w-full md:w-auto">
                        {school.is_premium ? (
                            <>
                                {school.phone_number && (
                                    <a href={`tel:${school.phone_number}`} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                        <Phone size={18} /> Anrufen
                                    </a>
                                )}
                                {school.website && (
                                    <a href={school.website.startsWith('http') ? school.website : `https://${school.website}`} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                                        <Globe size={18} /> Webseite
                                    </a>
                                )}
                            </>
                        ) : (
                            <button disabled className="flex-1 md:flex-none bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-semibold border border-gray-200 flex items-center justify-center gap-2 cursor-not-allowed">
                                <Lock size={18} /> Kontakt gesperrt
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <div className="grid md:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: CONTACT (LOCKED) */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4 flex items-center gap-2">
                            <Navigation size={20} className="text-blue-600" /> Kontakt
                        </h3>
                        
                        {/* Premium Wall Overlay */}
                        {!school.is_premium && (
                            <div className="absolute inset-0 top-16 bg-white/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
                                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-gray-600">Kontaktdaten nur für Premium</p>
                                </div>
                            </div>
                        )}

                        <div className={`space-y-5 ${!school.is_premium ? 'filter blur-[3px] select-none opacity-50' : ''}`}>
                            <ContactItem 
                                icon={<Phone size={18} />} 
                                label="Telefon" 
                                value={school.phone_number || "0123 456789"} 
                                href={school.is_premium ? `tel:${school.phone_number}` : undefined}
                            />
                            <ContactItem 
                                icon={<Mail size={18} />} 
                                label="E-Mail" 
                                value={school.email || "kontakt@fahrschule.de"} 
                                href={school.is_premium ? `mailto:${school.email}` : undefined}
                            />
                            <ContactItem 
                                icon={<Globe size={18} />} 
                                label="Webseite" 
                                value={school.website ? displayUrl(school.website) : "www.fahrschule.de"} 
                                href={school.is_premium ? school.website : undefined}
                                isLink
                            />
                        </div>
                    </div>

                    {/* CTA Box (Deaktiviert für Standard) */}
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2">Interesse geweckt?</h4>
                        <p className="text-sm text-blue-700/80 mb-4">
                            Melde dich jetzt an oder vereinbare eine unverbindliche Beratung.
                        </p>
                        {school.is_premium ? (
                            <a href={`mailto:${school.email}?subject=Anfrage über Fahrschulfinder`} className="block w-full bg-white hover:bg-blue-50 text-blue-600 font-bold text-center py-2.5 rounded-lg border border-blue-200 transition-colors shadow-sm">
                                Nachricht senden
                            </a>
                        ) : (
                            <button disabled className="block w-full bg-gray-100 text-gray-400 font-bold text-center py-2.5 rounded-lg border border-gray-200 cursor-not-allowed flex items-center justify-center gap-2">
                                <Lock size={16} /> Direktnachricht
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: PRICING (IMMER SICHTBAR) */}
                <div className="md:col-span-2">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-green-100 p-3 rounded-xl text-green-700">
                                <Car size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Preise & Leistungen</h2>
                                <p className="text-gray-500">Transparente Übersicht für Klasse B</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <PriceCard title="Fahrstunde" subtitle="pro 45 Minuten" price={school.driving_price} icon={<Car size={20} />} color="blue" />
                            <PriceCard title="Grundgebühr" subtitle="einmalig" price={school.grundgebuehr} icon={<BookOpen size={20} />} color="purple" />
                            <PriceCard title="Theorieprüfung" subtitle="Vorstellung zur Prüfung" price={school.theorypruefung} icon={<GraduationCap size={20} />} color="orange" />
                            <PriceCard title="Praxisprüfung" subtitle="Vorstellung zur Prüfung" price={school.praxispruefung} icon={<CheckCircle2 size={20} />} color="green" />
                        </div>

                        <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">
                            <Clock className="shrink-0 text-gray-400 mt-0.5" size={18} />
                            <p><strong>Hinweis:</strong> Die Gesamtkosten hängen von der Anzahl der benötigten Fahrstunden ab.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-Components ---

function ContactItem({ icon, label, value, href, isLink }: any) {
    const content = (
        <div className="flex items-start gap-4 group">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">{icon}</div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-gray-900 font-medium break-all">{value}</p>
            </div>
        </div>
    );

    if (href) {
        return (
            <a 
                href={isLink && !href.startsWith('http') ? `https://${href}` : href} 
                target={isLink ? "_blank" : undefined} 
                rel={isLink ? "noopener noreferrer" : undefined}
                className="block hover:opacity-75 transition-opacity"
            >
                {content}
            </a>
        );
    }
    return content;
}

function PriceCard({ title, subtitle, price, icon, color }: any) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        green: "bg-green-50 text-green-600 border-green-100",
    };
    const style = colors[color as keyof typeof colors] || colors.blue;

    return (
        <div className={`p-5 rounded-2xl border ${style.split(' ')[2]} bg-white flex justify-between items-center`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${style}`}>{icon}</div>
                <div>
                    <p className="font-bold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
            </div>
            <span className="text-xl font-bold text-gray-900">
                {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price)}
            </span>
        </div>
    );
}