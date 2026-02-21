export default function ComeFunziona() {
    return (
        <section id="come-funziona" className="py-20 md:py-28 bg-white">
            <div className="max-w-5xl mx-auto px-6 text-center">

                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                    Come funziona
                </h2>

                <p className="mt-3 max-w-md mx-auto text-[15px] md:text-base text-gray-600 leading-relaxed">
                    Zelvio ti guida passo dopo passo nella creazione di un preventivo professionale.
                </p>

                <div className="mt-14 grid md:grid-cols-3 gap-8 md:gap-16">

                    {/* Step 1 */}
                    <div className="p-5 md:p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-gray-50 cursor-default">
                        <div className="text-blue-600 text-4xl md:text-5xl font-bold leading-none">1</div>
                        <h3 className="mt-4 text-lg md:text-xl font-semibold text-gray-900">
                            Inserisci i dati dell’intervento
                        </h3>
                        <p className="mt-3 text-[15px] md:text-base text-gray-600 leading-relaxed">
                            Compila le informazioni principali: tipologia, ambiente, distanze e materiali.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="p-5 md:p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-gray-50 cursor-default">
                        <div className="text-blue-600 text-4xl md:text-5xl font-bold leading-none">2</div>
                        <h3 className="mt-4 text-lg md:text-xl font-semibold text-gray-900">
                            Aggiungi dettagli e costi
                        </h3>
                        <p className="mt-3 text-[15px] md:text-base text-gray-600 leading-relaxed">
                            Specifica extra, manodopera e particolarità dell’installazione.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="p-5 md:p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-gray-50 cursor-default">
                        <div className="text-blue-600 text-4xl md:text-5xl font-bold leading-none">3</div>
                        <h3 className="mt-4 text-lg md:text-xl font-semibold text-gray-900">
                            Genera il preventivo
                        </h3>
                        <p className="mt-3 text-[15px] md:text-base text-gray-600 leading-relaxed">
                            Ottieni un documento chiaro, preciso e pronto da inviare al cliente.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}