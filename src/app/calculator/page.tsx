// src/app/calculator/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getUniqueCities } from "@/app/actions/schoolActions";
import CalculatorClient from "@/components/calculator/CalculatorClient";

export default async function CalculatorPage() {
    const cities = await getUniqueCities();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow w-full flex justify-center items-start py-12 px-4">
                <CalculatorClient cities={cities} />
            </main>
            <Footer />
        </div>
    );
}