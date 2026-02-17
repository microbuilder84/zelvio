"use client";

export default function Hero() {
    return (
        <section className="pt-32 pb-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">

                {/* Testo */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Eleva ogni preventivo al livello dei veri professionisti
                    </h1>

                    <p className="mt-4 text-lg text-gray-700 max-w-xl">
                        Presenta ai tuoi clienti documenti chiari, accurati e impeccabili,
                        progettati per distinguerti dalla concorrenza.
                    </p>

                    <p className="mt-3 text-gray-500 max-w-lg">
                        Zelvio trasforma il processo di preventivazione in un flusso semplice e guidato,
                        aiutandoti a lavorare meglio, più velocemente e con un’immagine aziendale superiore.
                    </p>

                    <a
                        href="/wizard"
                        className="mt-8 inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition text-lg"
                    >
                        Inizia ora
                    </a>
                    <p className="text-gray-500 text-sm mt-2">Senza registrazione</p>
                </div>

                {/* Mockup */}
                <div className="flex-1">
                    <div className="rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                        <img
                            src="/mockup.png"
                            alt="Anteprima Zelvio"
                            className="w-full"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}