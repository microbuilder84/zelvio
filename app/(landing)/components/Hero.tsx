"use client";

export default function Hero() {
    return (
        <section className="pt-32 pb-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-5xl mx-auto px-6 text-center">

                {/* Titolo */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Eleva ogni preventivo al livello dei veri professionisti
                </h1>

                {/* Payoff */}
                <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
                    Presenta ai tuoi clienti documenti chiari, accurati e impeccabili,
                    progettati per distinguerti dalla concorrenza.
                </p>

                {/* Testo breve */}
                <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                    Zelvio trasforma il processo di preventivazione in un flusso semplice e guidato,
                    aiutandoti a lavorare meglio, più velocemente e con un’immagine aziendale superiore.
                </p>

                {/* CTA */}
                <a
                    href="/wizard"
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Inizia ora
                </a>

            </div>
        </section>
    );
}