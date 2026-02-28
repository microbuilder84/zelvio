export default function Contatti() {
    return (
        <section id="contatti" className="py-20 md:py-28 bg-gray-50">
            <div
                className="max-w-3xl mx-auto px-6 text-center
                           rounded-xl py-10 md:py-12
                           transition-all duration-300 ease-out
                           md:hover:-translate-y-[2px] md:hover:bg-white md:hover:shadow-sm"
            >

                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                    Contatti
                </h2>

                <p
                    className="mt-5 md:mt-6 max-w-md mx-auto
                               text-[15px] md:text-base text-gray-600 leading-[1.65]"
                >
                    Per informazioni, richieste o supporto puoi contattarci tramite email.
                </p>

                <div className="mt-8 text-gray-700">
                    <p className="flex flex-col items-center gap-1 text-base md:text-lg md:flex-row md:justify-center">
                        <span className="font-semibold">Email:</span>
                        <a
                            href="mailto:info@zelvio.com"
                            className="text-blue-600 underline-offset-2 hover:underline
                                       md:hover:opacity-80 transition-opacity duration-200"
                        >
                            info@zelvioapp.com
                        </a>
                    </p>
                </div>

            </div>
        </section>
    );
}