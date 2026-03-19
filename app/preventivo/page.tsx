"use client";

import { useEffect, useState } from "react";

function safeGetLS(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
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
    const [documentData, setDocumentData] = useState<any>(null);
    const [aziendaData, setAziendaData] = useState<any>(null);
    const [numeroPreventivo, setNumeroPreventivo] = useState("");
    const [dataGenerazione, setDataGenerazione] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const oggi = new Date();
        setDataGenerazione(oggi.toLocaleDateString("it-IT"));

        const savedWizard = safeGetLS("wizard_data");
        if (savedWizard) {
            try {
                setAziendaData(JSON.parse(savedWizard));
            } catch { }
        }

        const url = new URL(window.location.href);
        const id = url.searchParams.get("id");

        if (!id) {
            setLoading(false);
            return;
        }

        fetch(`/api/preventivo?id=${encodeURIComponent(id)}`)
            .then((r) => r.json())
            .then((data) => {
                if (data?.document) {
                    setDocumentData(data.document);
                    setNumeroPreventivo(generateNumeroPreventivo(id));
                }
            })
            .catch(() => { })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handlePrint = () => window.print();

    const handleNewPreventivo = () => {
        localStorage.removeItem("wizard_data");
        localStorage.removeItem("preventivo_doc_id");
        localStorage.removeItem("numero_preventivo");
        window.location.href = "/wizard";
    };

    /* ================= LOADING STATE ================= */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow">
                    <p className="font-semibold">Caricamento preventivo...</p>
                </div>
            </div>
        );
    }

    /* ================= ERROR STATE ================= */

    if (!documentData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow">
                    <p className="font-semibold mb-4">Preventivo non disponibile.</p>
                    <button
                        onClick={handleNewPreventivo}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Nuovo Preventivo
                    </button>
                </div>
            </div>
        );
    }

    const {
        intestazione,
        titolo,
        introduzione,
        descrizioneTecnica,
        materiali,
        tempiInstallazione,
        costi,
        clausole,
        firma,
    } = documentData;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl border border-gray-200 print:shadow-none print:border-none">

                {(aziendaData || intestazione) && (
                    <div className="mb-10 pb-6 border-b border-gray-300 print:border-none">
                        <h2 className="text-2xl font-bold">
                            {aziendaData?.azienda ?? intestazione?.azienda ?? "—"}
                        </h2>
                        <p>
                            Cliente:{" "}
                            {intestazione?.clienteNome ?? aziendaData?.clienteNome ?? "—"}
                        </p>
                        <p>
                            Indirizzo cliente:{" "}
                            {intestazione?.clienteIndirizzo ??
                                aziendaData?.clienteIndirizzo ??
                                "—"}
                        </p>
                        <p>
                            Tecnico:{" "}
                            {intestazione?.tecnico ?? aziendaData?.tecnico ?? "—"}
                        </p>
                        <p>
                            Tel:{" "}
                            {intestazione?.telefono ?? aziendaData?.telefono ?? "—"}
                        </p>
                        <p>
                            Email:{" "}
                            {intestazione?.email ?? aziendaData?.email ?? "—"}
                        </p>
                        <p>
                            P.IVA:{" "}
                            {intestazione?.piva ?? aziendaData?.piva ?? "—"}
                        </p>
                    </div>
                )}

                <h1 className="text-3xl font-bold text-center">
                    PREVENTIVO N. {numeroPreventivo}
                </h1>

                <p className="text-center text-sm text-gray-500 mb-8">
                    Data: {dataGenerazione}
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">{titolo}</h2>
                    <p className="text-gray-700 leading-relaxed">{introduzione}</p>
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">
                        Descrizione tecnica dell'intervento
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        {descrizioneTecnica}
                    </p>
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Materiali inclusi</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        {materiali?.map((m: string, i: number) => (
                            <li key={i}>{m}</li>
                        ))}
                    </ul>
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">
                        Tempi di esecuzione
                    </h3>
                    <p>{tempiInstallazione}</p>
                </section>

                <section className="mb-8 bg-gray-50 p-6 rounded-xl border">
                    <h3 className="text-lg font-semibold mb-4">Costi dettagliati</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Materiali</span>
                            <span>€ {costi.materiali}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Manodopera</span>
                            <span>€ {costi.manodopera}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Extra</span>
                            <span>€ {costi.extra}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Sconti</span>
                            <span>€ {costi.sconti}</span>
                        </div>

                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Totale finale</span>
                            <span>€ {costi.totale}</span>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">
                        Clausole e condizioni
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                        {clausole?.map((c: string, i: number) => (
                            <li key={i}>{c}</li>
                        ))}
                    </ul>
                </section>

                <section className="mt-12 pt-6 border-t">
                    <p className="font-semibold">{firma}</p>
                </section>

                <div className="flex justify-between mt-10 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="px-5 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Scarica PDF
                    </button>

                    <button
                        onClick={handleNewPreventivo}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Nuovo Preventivo
                    </button>
                </div>

            </div>
        </div>
    );
}