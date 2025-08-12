import { Calculator, MapPin, Star } from "lucide-react";

export default function Features() {
  return (
    <div className="mt-20 grid md:grid-cols-3 gap-8">
      <div className="text-center p-6 bg-white rounded-xl shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
          <Calculator className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparente Preise</h3>
        <p className="text-gray-600">
          Keine versteckten Kosten. Berechne deine individuellen Führerschein-Kosten basierend auf deiner Erfahrung.
        </p>
      </div>

      <div className="text-center p-6 bg-white rounded-xl shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
          <MapPin className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Alle Fahrschulen in Solingen</h3>
        <p className="text-gray-600">
          Vergleiche alle 19 Fahrschulen in Solingen auf einen Blick. Finde die perfekte Schule für dich.
        </p>
      </div>

      <div className="text-center p-6 bg-white rounded-xl shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
          <Star className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Echte Bewertungen</h3>
        <p className="text-gray-600">
          Lies authentische Bewertungen von anderen Fahrschülern und triff die richtige Entscheidung.
        </p>
      </div>
    </div>
  );
}
