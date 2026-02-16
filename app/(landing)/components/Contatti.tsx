export default function Contatti() {
    return (
        <section id="contatti" className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 text-center">

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Contatti
                </h2>

                <p className="mt-4 text-gray-600 max-w-xl mx-auto">
                    Per informazioni, richieste o supporto puoi contattarci tramite email.
                </p>

                <div className="mt-10 text-gray-700">
                    <p>
                        <span className="font-semibold">Email:</span>{" "}
                        <a href="mailto:info@zelvio.com" className="text-blue-600 hover:underline">
                            info@zelvio.com
                        </a>
                    </p>
                </div>

            </div>
        </section>
    );
}