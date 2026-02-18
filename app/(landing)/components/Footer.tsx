export default function Footer() {
    return (
        <footer
            className="py-12 bg-white border-t border-gray-200 
                       transition-all duration-300 ease-out 
                       hover:bg-gray-50"
        >
            <div className="max-w-5xl mx-auto px-6 text-center text-gray-600">

                <p
                    className="font-semibold text-gray-800 
                               transition-opacity duration-300 hover:opacity-90"
                >
                    Zelvio
                </p>

                <p
                    className="mt-3 text-sm transition-opacity duration-300 hover:opacity-80"
                >
                    © {new Date().getFullYear()} Zelvio. Tutti i diritti riservati.
                </p>

            </div>
        </footer>
    );
}