export const metadata = {
    title: "Cookie Policy — Zelvio",
    description: "Informativa sui cookie utilizzati da Zelvio.",
};

export default function CookiePage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-20 text-gray-800 leading-relaxed">

            <a href="/" className="text-sm opacity-70 hover:opacity-100 block mb-6">
                ← Torna alla home
            </a>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Cookie Policy
            </h1>

            <p className="mb-6">
                Zelvio utilizza cookie tecnici necessari al corretto funzionamento del sito.
                Non utilizziamo cookie di profilazione o marketing.
            </p>

            <h2 className="text-xl font-semibold mt-10 mb-3">1. Cosa sono i cookie</h2>
            <p className="mb-6">
                I cookie sono piccoli file di testo che il browser salva per permettere al sito di funzionare correttamente.
            </p>

            <h2 className="text-xl font-semibold mt-10 mb-3">2. Cookie utilizzati da Zelvio</h2>
            <ul className="list-disc pl-6 mb-6">
                <li>Cookie tecnici essenziali (es. sessione, autenticazione).</li>
                <li>Nessun cookie di tracciamento o marketing.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 mb-3">3. Gestione dei cookie</h2>
            <p className="mb-6">
                L’utente può gestire o disattivare i cookie tramite le impostazioni del proprio browser.
            </p>

            <h2 className="text-xl font-semibold mt-10 mb-3">4. Contatti</h2>
            <p className="mb-6">
                Per informazioni:{" "}
                <a href="mailto:info@zelvioapp.com" className="text-blue-600 underline">
                    info@zelvio.com
                </a>.
            </p>

        </main>
    );
}