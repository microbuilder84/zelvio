export const metadata = {
    title: "Legal — Zelvio",
    description: "Documenti legali di Zelvio: Privacy, Termini e Cookie.",
};

export default function LegalPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-20 text-gray-800 leading-relaxed">

            <a href="/" className="text-sm opacity-70 hover:opacity-100 block mb-6">
                ← Torna alla home
            </a>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
                Documenti Legali
            </h1>

            <p className="mb-8">
                In questa pagina trovi tutti i documenti legali relativi all’utilizzo di Zelvio.
                Manteniamo le nostre policy semplici, chiare e trasparenti.
            </p>

            <div className="space-y-8">

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Privacy Policy
                    </h2>
                    <p className="mb-2">
                        Come gestiamo i dati personali degli utenti e quali informazioni raccogliamo.
                    </p>
                    <a href="/privacy" className="text-blue-600 underline">
                        Vai alla Privacy Policy →
                    </a>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Termini & Condizioni
                    </h2>
                    <p className="mb-2">
                        Le regole di utilizzo del servizio e le responsabilità dell’utente.
                    </p>
                    <a href="/termini" className="text-blue-600 underline">
                        Vai ai Termini & Condizioni →
                    </a>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Cookie Policy
                    </h2>
                    <p className="mb-2">
                        Informazioni sui cookie tecnici utilizzati da Zelvio.
                    </p>
                    <a href="/cookie" className="text-blue-600 underline">
                        Vai alla Cookie Policy →
                    </a>
                </section>

            </div>

        </main>
    );
}