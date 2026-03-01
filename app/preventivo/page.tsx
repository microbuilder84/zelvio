"use client";

import { useEffect, useMemo, useState } from "react";

function safeGetLS(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeSetLS(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // ignore
    }
}

async function copyToClipboard(text: string) {
    // 1) modern clipboard
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // continue
    }

    // 2) fallback (older browsers / iOS quirks)
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch {
        return false;
    }
}

export default function PreventivoPage() {
    const [output, setOutput] = useState<string>("");
    const [aziendaData, setAziendaData] = useState<any>(null);
    const [dataGenerazione, setDataGenerazione] = useState<string>("");
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

    useEffect(() => {
        const saved = safeGetLS("preventivo_output");
        if (saved) setOutput(saved);

        const savedWizard = safeGetLS("wizard_data");
        if (savedWizard) {
            try {
                setAziendaData(JSON.parse(savedWizard));
            } catch {
                setAziendaData(null);
            }
        }

        const oggi = new Date();
        setDataGenerazione(oggi.toLocaleDateString("it-IT"));
    }, []);

    // auto-hide toast
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(t);
    }, [toast]);

    const isEmpty = useMemo(() => !output || output.trim().length === 0, [output]);

    const handlePrint = () => window.print();

    const handleCopy = async () => {
        if (isEmpty) {
            setToast({ type: "err", msg: "Niente da copiare." });
            return;
        }
        const ok = await copyToClipboard(output);
        setToast(ok ? { type: "ok", msg: "Testo copiato ✅" } : { type: "err", msg: "Copia non riuscita. Seleziona e copia manualmente." });
    };

    const handleBackToWizard = () => {
        // optional: keep output so user can return
        safeSetLS("preventivo_output", output || "");
        window.location.href = "/wizard";
    };

    const handleGoHome = () => {
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4">
            <div className="relative bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl border border-gray-200 print:border-0 print:shadow-none print:p-0">
                {/* ✅ TOAST */}
                {toast ? (
                    <div
                        className={`print:hidden absolute top-4 right-4 z-50 rounded-lg px-4 py-2 text-sm shadow ${toast.type === "ok"
                                ? "bg-green-50 border border-green-200 text-green-800"
                                : "bg-red-50 border border-red-200 text-red-800"
                            }`}
                    >
                        {toast.msg}
                    </div>
                ) : null}

                {/* ⭐ HEADER DINAMICO */}
                {aziendaData && (
                    <div className="mb-10 pb-6 border-b border-gray-300 print:border-none">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {aziendaData.azienda || "Azienda"}
                        </h2>

                        <p className="text-gray-700 mt-1">
                            Tecnico: {aziendaData.tecnico || "—"}
                        </p>

                        <p className="text-gray-700">Tel: {aziendaData.telefono || "—"}</p>

                        <p className="text-gray-700">Email: {aziendaData.email || "—"}</p>

                        <p className="text-gray-700">P.IVA: {aziendaData.piva || "—"}</p>
                    </div>
                )}

                {/* ⭐ TITOLO PRINCIPALE */}
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 print:mt-0">
                    Preventivo Generato
                </h1>

                {/* ⭐ DATA DEL PREVENTIVO */}
                <p className="text-center text-gray-600 mb-8 text-sm">
                    Data: {dataGenerazione}
                </p>

                {/* ✅ EMPTY STATE */}
                {isEmpty ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 p-6 rounded-xl text-sm leading-relaxed print:hidden">
                        <p className="font-semibold">Preventivo non trovato.</p>
                        <p className="mt-2">
                            Probabilmente hai ricaricato la pagina o il browser ha bloccato il salvataggio (modalità privata).
                            Torna al wizard e genera di nuovo il preventivo.
                        </p>

                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleBackToWizard}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Torna al Wizard
                            </button>
                            <button
                                onClick={handleGoHome}
                                className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Vai alla Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ⭐ CONTENUTO DEL PREVENTIVO */}
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:bg-white">
                            <pre className="whitespace-pre-wrap text-gray-800 leading-8 text-[17px] tracking-wide">
                                {output}
                            </pre>
                        </div>

                        {/* ⭐ BOX INFORMATIVO UNIVERSALE */}
                        <div className="mt-8 bg-blue-50 border border-blue-200 text-blue-900 p-5 rounded-xl text-sm leading-relaxed print:bg-white print:border-none">
                            <p>
                                La validità del presente preventivo, così come eventuali condizioni economiche o tecniche, sarà definita direttamente con il cliente.
                            </p>
                            <p className="mt-2">
                                Eventuali variazioni, richieste extra o condizioni non standard verranno comunicate prima dell’intervento.
                            </p>
                        </div>

                        {/* ⭐ BOTTONI AZIONE (non stampati) */}
                        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 print:hidden">
                            <button
                                onClick={handleCopy}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Copia Testo
                            </button>

                            <button
                                onClick={handlePrint}
                                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Scarica PDF
                            </button>

                            <button
                                onClick={handleBackToWizard}
                                className="px-5 py-2.5 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                            >
                                Torna al Wizard
                            </button>
                        </div>

                        {/* ⭐ FOOTER DINAMICO */}
                        {aziendaData && (
                            <div className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm print:border-none">
                                <p>
                                    {aziendaData.azienda || "Azienda"} — P.IVA {aziendaData.piva || "—"}
                                </p>
                                <p className="mt-1">
                                    {aziendaData.email || "—"} • {aziendaData.telefono || "—"}
                                </p>
                                <p className="mt-3 text-gray-500 italic">
                                    Questo documento è stato elaborato tramite il tuo strumento di preventivazione.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}