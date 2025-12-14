// src/app/school/[id]/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SchoolProfileDisplay from "@/components/school/SchoolProfileDisplay";
import { getSchoolById } from "@/app/actions/schoolActions";
import { notFound } from "next/navigation";

// 1. WICHTIG: params muss jetzt ein Promise sein!
interface SchoolProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SchoolProfilePage({ params }: SchoolProfilePageProps) {
    // 2. WICHTIG: Wir müssen auf die params warten (await)
    const { id } = await params; 
    const schoolId = id;

    // Validate for a UUID format instead of just digits.
    const uuidRegex = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;

    if (!schoolId || !uuidRegex.test(schoolId)) {
        console.error("Invalid school ID format received:", schoolId);
        notFound();
    }
    
    const school = await getSchoolById(schoolId);

    // If no school is found for the ID, display a 404 page
    if (!school) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow w-full flex justify-center items-start py-12 px-4">
                <SchoolProfileDisplay school={school} />
            </main>
            <Footer />
        </div>
    );
}
