export const metadata = {
    title: "Privacy Policy — Zelvio",
    description: "Informativa sulla privacy di Zelvio.",
};

export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-20 text-gray-800 leading-relaxed">

            <a href="/" className="text-sm opacity-70 hover:opacity-100 block mb-6">
                ← Torna alla home
            </a>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Privacy Policy
            </h1>

            <p className="mb-6">
                La presente informativa descrive come Zelvio gestisce i dati personali degli utenti che utilizzano il servizio.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
                1. Titolare del trattamento
            </h2>
            <p className="mb-6">
                Il titolare del trattamento è Zelvio. Per qualsiasi richiesta è possibile contattarci via email:{" "}
                <a href="mailto:info@zelvioapp.com" className="text-blue-600 underline">
                    info@zelvioapp.com
                </a>.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
                2. Dati raccolti
            </h2>
            <p className="mb-4">
                Zelvio raccoglie esclusivamente i dati necessari al funzionamento del servizio:
            </p>
            <ul className="list-disc pl-6 mb-6">
                <li>Dati forniti dall’utente (nome, email, informazioni dei preventivi).</li>
                <li>Dati tecnici anonimi (browser, dispositivo, pagine visitate).</li>
                <li>Dati di autenticazione, se l’utente crea un account.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
                3. Finalità del trattamento
            </h2>
            <p className="mb-6">
                I dati vengono utilizzati per fornire il servizio, migliorare la piattaforma, garantire la sicurezza e rispondere alle richieste di supporto.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
                4. Base giuridica
            </h2>
            <p className="mb-6">
                Il trattamento si basa sull’esecuzione del servizio richiesto, sugli obblighi di legge e sul legittimo interesse a mantenere sicuro e funzionante il servizio.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
                5. Conservazione dei dati
            </h2>
            <p className="mb-6">
                I dati vengono conservati per il tempo necessario a mantenere attivo l’account e adempiere agli obblighi legali. L’utente può richiederne la cancellazione in qualsiasi momento.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
                6. Condivisione dei dati
            </h2>
            <p className="mb-6">
                Zelvio non vende né cede i dati a terzi. I dati possono essere condivisi solo con fornitori tecnici affidabili necessari al funzionamento del servizio (hosting, database, email).
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
                7. Diritti dell’utente
            </h2>
            <p className="mb-4">
                L’utente può in qualsiasi momento:
            </p>
            <ul className="list-disc pl-6 mb-6">
                <li>accedere ai propri dati</li>
                <li>richiederne la modifica</li>
                <li>richiederne la cancellazione</li>
                <li>opporsi al trattamento</li>
                <li>richiedere l’esportazione dei dati</li>
            </ul>
            <p className="mb-6">
                Per esercitare i diritti:{" "}
                <a href="mailto:info@zelvioapp.com" className="text-blue-600 underline">
                    info@zelvioapp.com
                </a>.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
                8. Sicurezza
            </h2>
            <p className="mb-6">
                Adottiamo misure tecniche e organizzative per proteggere i dati da accessi non autorizzati, perdita o divulgazione.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
                9. Modifiche alla presente informativa
            </h2>
            <p className="mb-6">
                La presente informativa può essere aggiornata. Le modifiche saranno pubblicate su questa pagina.
            </p>

        </main>
    );
}