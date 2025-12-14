import CTAButton from "./CTAButton";
import RegistrationButton from "./RegistrationButton";

export default function Hero() {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Die transparente Art,
        <span className="text-blue-600 block">deine Fahrschule zu finden</span>
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Schluss mit undurchsichtigen Preisen! Berechne deine individuellen Führerschein-Kosten 
        und vergleiche alle Fahrschulen in Solingen – kostenlos und in nur 60 Sekunden.
      </p>

      <CTAButton />
      <RegistrationButton />
    </div>
  );
}
