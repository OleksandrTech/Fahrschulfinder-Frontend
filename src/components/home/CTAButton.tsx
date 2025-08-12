import Link from "next/link";
import { Calculator } from "lucide-react";

export default function CTAButton() {
  return (
    <div className="text-center">
      <Link 
        href="/calculator" 
        className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <Calculator className="mr-3 h-6 w-6" />
        Jetzt die perfekte Preise für dich rechnen
      </Link>

      <p className="text-sm text-gray-500 mt-4">
        ✓ Kostenlos ✓ Unverbindlich ✓ In 60 Sekunden
      </p>
    </div>
  );
}
