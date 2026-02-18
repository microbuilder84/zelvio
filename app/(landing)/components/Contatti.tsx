export default function Contatti() {
    return (
        <section id="contatti" className="py-24 bg-gray-50">
            <div
                className="max-w-3xl mx-auto px-6 text-center
                           transition-all duration-300 ease-out
                           hover:-translate-y-[2px] hover:bg-white hover:shadow-sm
                           rounded-xl py-12"
            >

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Contatti
                </h2>

                <p
                    className="mt-6 text-gray-600 max-w-lg mx-auto leading-[1.65]
                               transition-opacity duration-300 hover:opacity-90"
                >
                    Per informazioni, richieste o supporto puoi contattarci tramite email.
                </p>

                <div className="mt-10 text-gray-700">
                    <p className="text-lg flex flex-col items-center gap-1 md:flex-row md:justify-center">
                        <span className="font-semibold">Email:</span>
                        <a
                            href="mailto:info@zelvio.com"
                            className="text-blue-600 hover:underline hover:opacity-80 underline-offset-2 transition-opacity duration-200"
                        >
                            info@zelvio.com
                        </a>
                    </p>
                </div>

            </div>
        </section>
    );
}