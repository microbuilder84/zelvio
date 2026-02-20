"use client";

export default function Hero() {
    return (
        <section className="pt-24 pb-24 md:pt-36 md:pb-32 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 md:gap-20">

                {/* Testo */}
                <div className="flex-1 md:pr-16 text-center md:text-left">
                    <h1 className="text-3xl md:text-[2.9rem] font-semibold text-gray-900 leading-[1.22] tracking-tight mb-5">
                        Eleva ogni preventivo<br />al livello dei veri professionisti
                    </h1>

                    {/* Primo paragrafo */}
                    <p className="text-[16px] text-gray-900 max-w-md mx-auto md:mx-0 leading-[1.45] mt-4">
                        Presenta ai tuoi clienti documenti chiari, accurati e impeccabili,
                        progettati per distinguerti dalla concorrenza.
                    </p>

                    {/* Secondo paragrafo */}
                    <p className="mt-5 text-gray-800 text-[15px] max-w-md mx-auto md:mx-0 leading-[1.55]">
                        Zelvio trasforma il processo di preventivazione in un flusso semplice e guidato,
                        aiutandoti a lavorare meglio, più velocemente e con un’immagine aziendale superiore.
                    </p>

                    {/* CTA */}
                    <div className="mt-8 flex flex-col items-center md:items-start">
                        <a
                            href="/wizard"
                            className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-xl
                                       shadow-md hover:shadow-xl
                                       hover:bg-blue-700
                                       transition-all duration-200 ease-out
                                       text-lg md:text-xl flex items-center gap-3
                                       hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-[1px]"
                        >
                            Inizia ora
                            <span className="text-2xl leading-none">→</span>
                        </a>
                    </div>
                </div>

                {/* Mockup */}
                <div className="flex-1 relative flex justify-center mt-10 md:mt-0">

                    {/* Glow morbido */}
                    <div className="absolute inset-0 -z-10 flex justify-center">
                        <div className="w-[16rem] h-[16rem] md:w-[26rem] md:h-[26rem] bg-blue-200 rounded-full blur-[100px] md:blur-[140px] opacity-20"></div>
                    </div>

                    {/* Frame premium */}
                    <div
                        className="rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white/90 backdrop-blur-sm
                                   w-[260px] md:w-[400px] transition-all duration-700"
                    >
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