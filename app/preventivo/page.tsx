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
    } catch { }
}

async function copyToClipboard(text: string) {
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch { }

    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
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

function generateNumeroPreventivo(docId?: string) {
    const oggi = new Date();
    const anno = oggi.getFullYear();
    const mese = String(oggi.getMonth() + 1).padStart(2, "0");

    if (docId) {
        return `${anno}-${mese}-${docId.slice(0, 6).toUpperCase()}`;
    }

    const codice = String(Date.now()).slice(-5);
    return `${anno}-${mese}-${codice}`;
}

export default function PreventivoPage() {
    const [output, setOutput] = useState<string>("");
    const [aziendaData, setAziendaData] = useState<any>(null);
    const [dataGenerazione, setDataGenerazione] = useState<string>("");
    const [numeroPreventivo, setNumeroPreventivo] = useState<string>("");
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
    const [isRecovering, setIsRecovering] = useState(false);

    useEffect(() => {
        const oggi = new Date();
        setDataGenerazione(oggi.toLocaleDateString("it-IT"));

        const savedWizard = safeGetLS("wizard_data");
        if (savedWizard) {
            try {
                setAziendaData(JSON.parse(savedWizard));
            } catch {
                setAziendaData(null);
            }
        }

        const savedOutput = safeGetLS("preventivo_output");
        const savedDocId = safeGetLS("preventivo_doc_id");

        const url = new URL(window.location.href);
        const idFromUrl = url.searchParams.get("id") || savedDocId;

        // 1️⃣ Caso normale: output presente
        if (savedOutput && savedOutput.trim()) {
            setOutput(savedOutput);

            const savedNumero = safeGetLS("numero_preventivo");
            if (savedNumero) {
                setNumeroPreventivo(savedNumero);
            } else {
                const nuovo = generateNumeroPreventivo(savedDocId || undefined);
                setNumeroPreventivo(nuovo);
                safeSetLS("numero_preventivo", nuovo);
            }

            return;
        }

        // 2️⃣ Fallback server recovery
        if (idFromUrl) {
            setIsRecovering(true);

            fetch(`/api/preventivo?id=${encodeURIComponent(idFromUrl)}`)
                .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
                .then(({ ok, j }) => {
                    if (!ok) return;

                    if (typeof j?.output === "string" && j.output.trim()) {
                        setOutput(j.output);
                        safeSetLS("preventivo_output", j.output);
                        safeSetLS("preventivo_doc_id", idFromUrl);

                        const nuovoNumero = generateNumeroPreventivo(idFromUrl);
                        setNumeroPreventivo(nuovoNumero);
                        safeSetLS("numero_preventivo", nuovoNumero);
                    }
                })
                .finally(() => {
                    setIsRecovering(false);
                });
        }
    }, []);

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
        setToast(
            ok
                ? { type: "ok", msg: "Testo copiato ✅" }
                : { type: "err", msg: "Copia non riuscita." }
        );
    };

    const handleBackToWizard = () => {
        safeSetLS("preventivo_output", output || "");
        window.location.href = "/wizard";
    };

    const handleGoHome = () => {
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4">
            <div className="relative bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl border border-gray-200 print:border-0 print:shadow-none print:p-0">

                {toast && (
                    <div
                        className={`print:hidden absolute top-4 right-4 z-50 rounded-lg px-4 py-2 text-sm shadow ${toast.type === "ok"
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                            }`}
                    >
                        {toast.msg}
                    </div>
                )}

                {aziendaData && (
                    <div className="mb-10 pb-6 border-b border-gray-300 print:border-none">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {aziendaData.azienda || "Azienda"}
                        </h2>
                        <p className="text-gray-700 mt-1">
                            Tecnico: {aziendaData.tecnico || "—"}
                        </p>
                        <p className="text-gray-700">
                            Tel: {aziendaData.telefono || "—"}
                        </p>
                        <p className="text-gray-700">
                            Email: {aziendaData.email || "—"}
                        </p>
                        <p className="text-gray-700">
                            P.IVA: {aziendaData.piva || "—"}
                        </p>
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-1 text-center text-gray-900 print:mt-0">
                    PREVENTIVO N. {numeroPreventivo}
                </h1>

                <p className="text-center text-gray-600 mb-8 text-sm">
                    Data: {dataGenerazione}
                </p>

                {isRecovering && (
                    <div className="text-center text-sm text-gray-500 mb-6">
                        Recupero preventivo in corso...
                    </div>
                )}

                {isEmpty ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 p-6 rounded-xl text-sm print:hidden">
                        <p className="font-semibold">Preventivo non trovato.</p>
                        <p className="mt-2">
                            Il documento potrebbe essere scaduto o il salvataggio non disponibile.
                            Torna al wizard e genera nuovamente il preventivo.
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
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:bg-white">
                            <pre className="whitespace-pre-wrap text-gray-800 leading-8 text-[17px] tracking-wide">
                                {output}
                            </pre>
                        </div>

                        <div className="mt-8 bg-blue-50 border border-blue-200 text-blue-900 p-5 rounded-xl text-sm print:bg-white print:border-none">
                            <p>
                                La validità del presente preventivo e le eventuali condizioni economiche saranno definite con il cliente in fase di conferma.
                            </p>
                        </div>

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
                                Modifica Dati
                            </button>
                        </div>

                        {aziendaData && (
                            <div className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm print:border-none">
                                <p>
                                    {aziendaData.azienda || "Azienda"} — P.IVA {aziendaData.piva || "—"}
                                </p>
                                <p className="mt-1">
                                    {aziendaData.email || "—"} • {aziendaData.telefono || "—"}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}