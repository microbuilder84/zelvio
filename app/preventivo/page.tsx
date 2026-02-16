"use client";

import { useEffect, useState } from "react";

export default function PreventivoPage() {
    const [output, setOutput] = useState("");
    const [aziendaData, setAziendaData] = useState<any>(null);
    const [dataGenerazione, setDataGenerazione] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("preventivo_output");
        if (saved) setOutput(saved);

        const savedWizard = localStorage.getItem("wizard_data");
        if (savedWizard) {
            try {
                setAziendaData(JSON.parse(savedWizard));
            } catch { }
        }

        // ⭐ Genera la data in formato italiano
        const oggi = new Date();
        const dataIT = oggi.toLocaleDateString("it-IT");
        setDataGenerazione(dataIT);

    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl border border-gray-200 print:border-0 print:shadow-none print:p-0">

                {/* ⭐ HEADER DINAMICO */}
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

                {/* ⭐ TITOLO PRINCIPALE */}
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 print:mt-0">
                    Preventivo Generato
                </h1>

                {/* ⭐ DATA DEL PREVENTIVO */}
                <p className="text-center text-gray-600 mb-8 text-sm">
                    Data: {dataGenerazione}
                </p>

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
                <div className="flex justify-between mt-8 print:hidden">
                    <button
                        onClick={() => navigator.clipboard.writeText(output)}
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

                    <a
                        href="/"
                        className="px-5 py-2.5 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                    >
                        Torna al Wizard
                    </a>
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

            </div>
        </div>
    );
}