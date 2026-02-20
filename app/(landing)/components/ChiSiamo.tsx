export default function ChiSiamo() {
    return (
        <section id="chi-siamo" className="py-20 md:py-28 bg-white">
            <div
                className="max-w-3xl mx-auto px-6 text-center
                           md:text-left
                           rounded-xl py-10 md:py-12
                           transition-all duration-300 ease-out
                           md:hover:-translate-y-[2px] md:hover:bg-gray-50 md:hover:shadow-sm"
            >

                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                    Chi siamo
                </h2>

                <p
                    className="mt-6 md:mt-8 text-gray-600 leading-[1.65] 
                               max-w-md md:max-w-xl mx-auto md:mx-0
                               text-[15px] md:text-base"
                >
                    Zelvio nasce dall’esperienza diretta nel settore delle installazioni
                    e dalla necessità di creare preventivi più rapidi, accurati e professionali.
                    Il nostro obiettivo è offrire ai tecnici uno strumento semplice,
                    affidabile e capace di valorizzare il loro lavoro.
                </p>

                <p
                    className="mt-5 md:mt-6 text-gray-600 leading-[1.65] 
                               max-w-md md:max-w-xl mx-auto md:mx-0
                               text-[15px] md:text-base"
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