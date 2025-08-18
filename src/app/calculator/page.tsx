// src/app/calculator/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getUniqueCities } from "@/app/actions/schoolActions";
import CalculatorClient from "@/components/calculator/CalculatorClient";

// This is a Server Component. Its only job is to fetch data.
export default async function CalculatorPage() {
    const cities = await getUniqueCities();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Pass the server-fetched data to the interactive client component */}
                <CalculatorClient cities={cities} />
            </main>
            <Footer />
        </div>
    );
}