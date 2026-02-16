export default function PercheZelvio() {
    return (
        <section id="perche-zelvio" className="py-28 bg-gray-50">
            <div className="max-w-3xl mx-auto px-6 text-center md:text-left">

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                    Perché scegliere Zelvio
                </h2>

                <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed text-center md:text-left">
                    Uno strumento progettato per migliorare la tua efficienza e la qualità dei tuoi preventivi.
                </p>

                <div className="mt-20 grid md:grid-cols-2 gap-16">

                    {/* Benefit 1 */}
                    <div className="text-left">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Risparmi tempo prezioso
                        </h3>
                        <p className="mt-3 text-gray-600 leading-relaxed">
                            Automatizza calcoli, distanze, materiali e costi.
                            Meno tempo sui fogli, più tempo per i tuoi clienti.
                        </p>
                    </div>

                    {/* Benefit 2 */}
                    <div className="text-left">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Preventivi impeccabili
                        </h3>
                        <p className="mt-3 text-gray-600 leading-relaxed">
                            Documenti chiari, ordinati e professionali che valorizzano la tua immagine aziendale.
                        </p>
                    </div>

                    {/* Benefit 3 */}
                    <div className="text-left">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Zero errori di calcolo
                        </h3>
                        <p className="mt-3 text-gray-600 leading-relaxed">
                            Zelvio riduce al minimo gli errori umani, garantendo preventivi accurati e affidabili.
                        </p>
                    </div>

                    {/* Benefit 4 */}
                    <div className="text-left">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Immagine professionale superiore
                        </h3>
                        <p className="mt-3 text-gray-600 leading-relaxed">
                            Distinguiti dalla concorrenza con preventivi curati nei dettagli e coerenti nel formato.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}