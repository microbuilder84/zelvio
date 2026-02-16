export default function Footer() {
    return (
        <footer className="py-12 bg-white border-t border-gray-200">
            <div className="max-w-5xl mx-auto px-6 text-center text-gray-600">

                <p className="font-semibold text-gray-800">Zelvio</p>

                <p className="mt-3 text-sm">
                    © {new Date().getFullYear()} Zelvio. Tutti i diritti riservati.
                </p>

            </div>
        </footer>
    );
}