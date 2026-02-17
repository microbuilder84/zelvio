"use client";

export default function Hero() {
    return (
        <section className="pt-56 pb-40 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-28">

                {/* Testo */}
                <div className="flex-1 md:pr-20 text-center md:text-left">
                    <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 leading-tight mb-8">
                        Eleva ogni preventivo<br />al livello dei veri professionisti
                    </h1>

                    <p className="mt-4 text-xl text-gray-700 max-w-xl leading-relaxed">
                        Presenta ai tuoi clienti documenti chiari, accurati e impeccabili,
                        progettati per distinguerti dalla concorrenza.
                    </p>

                    <p className="mt-5 text-gray-500 text-base max-w-lg leading-relaxed">
                        Zelvio trasforma il processo di preventivazione in un flusso semplice e guidato,
                        aiutandoti a lavorare meglio, più velocemente e con un’immagine aziendale superiore.
                    </p>
                    {/* CTA + micro-benefit */}
                    <div className="mt-14 flex flex-col items-center md:items-start">
                        <a
                            href="/wizard"
                            className="px-16 py-6 bg-blue-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all duration-300 text-2xl flex items-center gap-3"
                        >
                            Inizia ora
                            <span className="text-3xl leading-none">→</span>
                        </a>

                        <p className="text-gray-500 text-sm mt-4 tracking-wide w-full text-center md:text-left">
                            Nessun account • Nessuna carta • Gratuito
                        </p>
                    </div>
                </div>

                {/* Mockup */}
                <div className="flex-1 relative">

                    {/* Glow sfumato più grande */}
                    <div className="absolute inset-0 -z-10 flex justify-center">
                        <div className="w-[32rem] h-[32rem] bg-blue-200 rounded-full blur-3xl opacity-40"></div>
                    </div>

                    {/* Frame elegante + inclinazione premium */}
                    <div className="rounded-3xl shadow-2xl border border-gray-200 overflow-hidden bg-white/80 backdrop-blur-sm transform rotate-[0.5deg] hover:rotate-0 transition-all duration-700 scale-[1.08]">
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