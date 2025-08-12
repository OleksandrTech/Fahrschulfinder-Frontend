import Link from "next/link";
import { Calculator } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Fahrschulfinder</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#" className="text-gray-500 hover:text-gray-900">
              Für Fahrschulen
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900">
              Über uns
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900">
              Kontakt
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
