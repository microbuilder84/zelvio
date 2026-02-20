"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
    const [activeSection, setActiveSection] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Evidenziazione sezione attiva
    useEffect(() => {
        const sections = [
            "come-funziona",
            "perche-zelvio",
            "chi-siamo",
            "contatti",
        ];

        const handleScroll = () => {
            let current = "";

            for (const id of sections) {
                const el = document.getElementById(id);
                if (!el) continue;

                const rect = el.getBoundingClientRect();

                if (rect.top <= 120 && rect.bottom >= 120) {
                    current = id;
                    break;
                }
            }

            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const linkClass = (id: string) =>
        `relative transition-all duration-200 ease-out
         after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300
         ${activeSection === id
            ? "text-blue-600 after:w-full"
            : "text-gray-700 opacity-80 hover:opacity-100 hover:text-blue-600 after:w-0 hover:after:w-full"
        }`;

    return (
        <header className="
            fixed top-0 left-0 w-full 
            bg-white 
            md:bg-white/80 md:backdrop-blur-md 
            border-b border-gray-200 
            z-50 transition-all duration-300
        ">
            <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

                {/* LOGO */}
                <a
                    href="/"
                    className="text-xl font-semibold text-gray-900 tracking-tight hover:opacity-80 transition-opacity duration-200"
                >
                    Zelvio
                </a>

                {/* LINK CENTRALI (DESKTOP) */}
                <div className="hidden md:flex items-center gap-10 font-medium px-6">
                    <a href="#come-funziona" className={linkClass("come-funziona")}>
                        Come funziona
                    </a>

                    <a href="#perche-zelvio" className={linkClass("perche-zelvio")}>
                        Perché Zelvio
                    </a>

                    <a href="#chi-siamo" className={linkClass("chi-siamo")}>
                        Chi siamo
                    </a>

                    <a href="#contatti" className={linkClass("contatti")}>
                        Contatti
                    </a>
                </div>

                {/* BOTTONI DESTRA (DESKTOP) */}
                <div className="hidden md:flex items-center gap-6 pl-10">
                    <a
                        href="/accedi"
                        className="relative text-gray-700 opacity-80 hover:opacity-100 hover:text-blue-600 transition-all duration-200 font-medium
                        after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Accedi
                    </a>

                    <a
                        href="/registrati"
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md hover:bg-blue-700 transition-all duration-200 font-medium"
                    >
                        Registrati
                    </a>
                </div>

                {/* HAMBURGER MENU (MOBILE) */}
                <button
                    className="md:hidden flex flex-col gap-[4px] mr-2 z-50"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <span
                        className={`h-[2px] w-5 bg-gray-900 transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[6px]" : ""
                            }`}
                    ></span>
                    <span
                        className={`h-[2px] w-5 bg-gray-900 transition-all duration-300 ${isOpen ? "opacity-0" : ""
                            }`}
                    ></span>
                    <span
                        className={`h-[2px] w-5 bg-gray-900 transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""
                            }`}
                    ></span>
                </button>

                {/* MENU MOBILE FULLSCREEN */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-white z-40 flex flex-col p-8 animate-fadeIn"
                    >
                        <div className="flex flex-col gap-6 mt-10 text-left">

                            <a
                                href="#come-funziona"
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-medium text-gray-900"
                            >
                                Come funziona
                            </a>

                            <a
                                href="#perche-zelvio"
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-medium text-gray-900"
                            >
                                Perché Zelvio
                            </a>

                            <a
                                href="#chi-siamo"
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-medium text-gray-900"
                            >
                                Chi siamo
                            </a>

                            <a
                                href="#contatti"
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-medium text-gray-900"
                            >
                                Contatti
                            </a>
                        </div>

                        <div className="mt-auto flex flex-col gap-4 pt-10 border-t">
                            <a
                                href="/accedi"
                                onClick={() => setIsOpen(false)}
                                className="text-gray-800 text-lg font-medium"
                            >
                                Accedi
                            </a>

                            <a
                                href="/registrati"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 bg-blue-600 text-white rounded-lg text-center text-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Registrati
                            </a>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}