export default function Footer() {
    return (
        <footer
            className="py-8 md:py-12 bg-white border-t border-gray-200
                       transition-all duration-300 ease-out
                       md:hover:bg-gray-50"
        >
            <div className="max-w-4xl mx-auto px-6 text-center text-gray-600">

                <p
                    className="text-base md:text-lg font-semibold text-gray-800
                               transition-opacity duration-300 md:hover:opacity-90"
                >
                    Zelvio
                </p>

                <p
                    className="mt-2 text-xs md:text-sm opacity-80
                               transition-opacity duration-300 md:hover:opacity-90"
                >
                    © {new Date().getFullYear()} Zelvio. Tutti i diritti riservati.
                </p>

                {/* ⭐ Link legali */}
                <div className="mt-4 flex flex-col items-center gap-1 text-xs md:text-sm opacity-80">

                    <a
                        href="/privacy"
                        className="hover:underline transition-opacity duration-300 md:hover:opacity-90"
                    >
                        Privacy Policy
                    </a>

                    <a
                        href="/termini"
                        className="hover:underline transition-opacity duration-300 md:hover:opacity-90"
                    >
                        Termini & Condizioni
                    </a>

                    <a
                        href="/cookie"
                        className="hover:underline transition-opacity duration-300 md:hover:opacity-90"
                    >
                        Cookie Policy
                    </a>

                    <a
                        href="/legal"
                        className="hover:underline transition-opacity duration-300 md:hover:opacity-90"
                    >
                        Legal
                    </a>

                </div>

            </div>
        </footer>
    );
}