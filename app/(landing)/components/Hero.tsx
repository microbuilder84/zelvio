"use client";

export default function Hero() {
    return (
        <section className="pt-48 pb-40 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-24">

                {/* Testo */}
                <div className="flex-1 md:pr-16 text-center md:text-left">
                    <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 leading-tight mb-8">
                        Eleva ogni preventivo<br />al livello dei veri professionisti
                    </h1>

                    <p className="mt-4 text-xl text-gray-700 max-w-xl">
                        Presenta ai tuoi clienti documenti chiari, accurati e impeccabili,
                        progettati per distinguerti dalla concorrenza.
                    </p>

                    <p className="mt-5 text-gray-500 text-lg max-w-lg">
                        Zelvio trasforma il processo di preventivazione in un flusso semplice e guidato,
                        aiutandoti a lavorare meglio, più velocemente e con un’immagine aziendale superiore.
                    </p>

                    {/* CTA + micro-benefit */}
                    <div className="mt-12 flex flex-col items-center md:items-start">
                        <a
                            href="/wizard"
                            className="px-14 py-5 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transition text-xl"
                        >
                            Inizia ora
                        </a>

                        <p className="text-gray-500 text-sm mt-4 tracking-wide w-full text-center md:text-left">
                            Senza registrazione • Gratuito
                        </p>
                    </div>
                </div>

                {/* Mockup */}
                <div className="flex-1 relative">

                    {/* Glow sfumato più grande */}
                    <div className="absolute inset-0 -z-10 flex justify-center">
                        <div className="w-[28rem] h-[28rem] bg-blue-200 rounded-full blur-3xl opacity-40"></div>
                    </div>

                    {/* Frame elegante + leggera inclinazione */}
                    <div className="rounded-2xl shadow-xl border border-gray-200 overflow-hidden bg-white/80 backdrop-blur-sm transform rotate-1 hover:rotate-0 transition-all duration-500">
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