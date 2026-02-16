export default function ComeFunziona() {
    return (
        <section id="come-funziona" className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6 text-center">

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Come funziona
                </h2>

                <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                    Zelvio ti guida passo dopo passo nella creazione di un preventivo professionale.
                </p>

                <div className="mt-16 grid md:grid-cols-3 gap-12">

                    {/* Step 1 */}
                    <div>
                        <div className="text-blue-600 text-4xl font-bold">1</div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">
                            Inserisci i dati dell’intervento
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Compila le informazioni principali: tipologia, ambiente, distanze e materiali.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div>
                        <div className="text-blue-600 text-4xl font-bold">2</div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">
                            Aggiungi dettagli e costi
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Specifica extra, manodopera e particolarità dell’installazione.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div>
                        <div className="text-blue-600 text-4xl font-bold">3</div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">
                            Genera il preventivo
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Ottieni un documento chiaro, preciso e pronto da inviare al cliente.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
} 