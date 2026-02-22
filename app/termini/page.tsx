export const metadata = {
    title: "Termini e Condizioni — Zelvio",
    description: "Termini di utilizzo del servizio Zelvio.",
};

export default function TerminiPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-20 text-gray-800 leading-relaxed">

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Termini e Condizioni
            </h1>

            <p className="mb-6">
                Utilizzando Zelvio, l’utente accetta i presenti Termini e Condizioni.
            </p>

            <h2 className="text-xl font-semibold mt-10 mb-3">1. Oggetto del servizio</h2>
            <p className="mb-6">
                Zelvio è uno strumento che permette di creare preventivi in modo semplice e veloce.
                Il servizio è fornito “così com’è”, senza garanzie implicite o esplicite.
            </p>

            <h2 className="text-xl font-semibold mt-10 mb-3">2. Uso consentito</h2>
            <p className="mb-6">
                L’utente si impegna a utilizzare Zelvio in modo lecito e conforme alla normativa vigente.
                È vietato utilizzare il servizio per attività fraudolente o dannose.
            </p>

            <h2 className="text-xl font-semibold mt-10 mb-3">3. Account e sicurezza</h2>
            <p className="mb-6">
                L’utente è responsabile della sicurezza del proprio account e delle informazioni inserite.
            </p>

            <h2 className="text-xl font-semibold mt-10 mb-3">4. Limitazione di responsabilità</h2>
            <p className="mb-6">
                Zelvio non è responsabile per eventuali danni derivanti da un uso improprio del servizio
                o da informazioni inserite dall’utente.
            </p>

            <h2 className="text-xl font-semibold mt-10 mb-3">5. Modifiche al servizio</h2>
            <p className="mb-6">
                Zelvio può aggiornare o modificare il servizio in qualsiasi momento per migliorarne funzionalità e sicurezza.
            </p>

            <h2 className="text-xl font-semibold mt-10 mb-3">6. Contatti</h2>
            <p className="mb-6">
                Per informazioni o richieste:{" "}
                <a href="mailto:info@zelvio.com" className="text-blue-600 underline">
                    info@zelvio.com
                </a>.
            </p>

        </main>
    );
}