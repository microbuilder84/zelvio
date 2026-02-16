export default function RegistratiPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
            <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full text-center border border-gray-200">

                <h1 className="text-3xl font-bold text-gray-900">
                    Registrazione non ancora disponibile
                </h1>

                <p className="text-gray-600 mt-4 leading-relaxed">
                    Stiamo lavorando per introdurre un sistema di registrazione che ti permetterà
                    di salvare i tuoi preventivi, gestire i clienti e accedere a funzionalità avanzate.
                </p>

                <a
                    href="/"
                    className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Torna alla Home
                </a>

            </div>
        </div>
    );
}