"use client";

export default function Hero() {
    return (
        <section className="pt-44 pb-40 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-24">

                {/* Testo */}
                <div className="flex-1 md:pr-16 text-center md:text-left">
                    <h1 className="text-4xl md:text-[2.9rem] font-semibold text-gray-900 leading-[1.18] tracking-tight mb-6">
                        Eleva ogni preventivo<br />al livello dei veri professionisti
                    </h1>

                    {/* Primo paragrafo – premium */}
                    <p className="text-lg text-gray-800 max-w-lg leading-[1.45] mt-4">
                        Presenta ai tuoi clienti documenti chiari, accurati e impeccabili,
                        progettati per distinguerti dalla concorrenza.
                    </p>

                    {/* Secondo paragrafo – premium */}
                    <p className="mt-5 text-gray-700 text-base max-w-md leading-[1.55]">
                        Zelvio trasforma il processo di preventivazione in un flusso semplice e guidato,
                        aiutandoti a lavorare meglio, più velocemente e con un’immagine aziendale superiore.
                    </p>

                    {/* CTA */}
                    <div className="mt-10 flex flex-col items-center md:items-start">
                        <a
                            href="/wizard"
                            className="px-12 py-5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 text-xl flex items-center gap-3"
                        >
                            Inizia ora
                            <span className="text-2xl leading-none">→</span>
                        </a>

                        <p className="text-gray-500 text-sm mt-4 tracking-wide">
                            Nessun account • Nessuna carta • Gratuito
                        </p>
                    </div>
                </div>

                {/* Mockup */}
                <div className="flex-1 relative flex justify-center">

                    {/* Glow morbido */}
                    <div className="absolute inset-0 -z-10 flex justify-center">
                        <div className="w-[26rem] h-[26rem] bg-blue-200 rounded-full blur-[140px] opacity-25"></div>
                    </div>

                    {/* Frame premium */}
                    <div className="rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white/90 backdrop-blur-sm transform rotate-[1deg] hover:rotate-0 transition-all duration-700 w-[400px]">
                        <img
                            src="/preventivo-intervento-zelvio.png"
                            alt="Anteprima Zelvio"
                            className="w-full"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}