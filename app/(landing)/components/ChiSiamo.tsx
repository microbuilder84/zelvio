export default function ChiSiamo() {
    return (
        <section id="chi-siamo" className="py-24 bg-white">
            <div
                className="max-w-3xl mx-auto px-6 text-center
                           transition-all duration-300 ease-out
                           hover:-translate-y-[2px] hover:bg-gray-50 hover:shadow-sm
                           rounded-xl py-12"
            >

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Chi siamo
                </h2>

                <p
                    className="mt-8 text-gray-600 leading-[1.65] max-w-xl mx-auto
                               transition-opacity duration-300 hover:opacity-90"
                >
                    Zelvio nasce dall’esperienza diretta nel settore delle installazioni
                    e dalla necessità di creare preventivi più rapidi, accurati e professionali.
                    Il nostro obiettivo è offrire ai tecnici uno strumento semplice,
                    affidabile e capace di valorizzare il loro lavoro.
                </p>

                <p
                    className="mt-6 text-gray-600 leading-[1.65] max-w-xl mx-auto
                               transition-opacity duration-300 hover:opacity-90"
                >
                    Crediamo che ogni professionista meriti strumenti moderni e intuitivi,
                    in grado di migliorare l’efficienza e l’immagine aziendale.
                    Per questo abbiamo progettato Zelvio: un flusso guidato, chiaro
                    e pensato per chi vuole distinguersi.
                </p>

            </div>
        </section>
    );
}