import Link from "next/link";
import { Calculator } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Calculator className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold">Fahrschulfinder</span>
            </div>
            <p className="text-gray-400">
              Die transparente Art, deine Fahrschule in Solingen zu finden.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Für Fahrschüler</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Preisrechner
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Fahrschulen vergleichen
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Bewertungen lesen
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Für Fahrschulen</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Registrieren
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Premium Profil
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Statistiken
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Fahrschulfinder. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
