import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import { getUniqueCities } from "@/app/actions/schoolActions"; <--- Nicht mehr benötigt
import CalculatorClient from "@/components/calculator/CalculatorClient";
import { BERGISCHES_LAND_CITIES } from "@/lib/cities"; // <--- Import

export default async function CalculatorPage() {
    // Statt DB-Abruf nutzen wir die feste Liste
    const cities = BERGISCHES_LAND_CITIES;

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