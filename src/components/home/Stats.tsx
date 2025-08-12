export default function Stats() {
  return (
    <div className="mt-20 bg-blue-600 rounded-2xl p-8 text-white text-center">
      <h2 className="text-3xl font-bold mb-8">
        Bereits über 500 Fahrschüler haben ihre perfekte Fahrschule gefunden
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="text-4xl font-bold">19</div>
          <div className="text-blue-200">Fahrschulen in Solingen</div>
        </div>
        <div>
          <div className="text-4xl font-bold">500+</div>
          <div className="text-blue-200">Zufriedene Nutzer</div>
        </div>
        <div>
          <div className="text-4xl font-bold">€200</div>
          <div className="text-blue-200">Durchschnittliche Ersparnis</div>
        </div>
      </div>
    </div>
  );
}
