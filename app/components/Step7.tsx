"use client";

import { useState } from "react";
import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";
import "./loader.css";

interface Step7Props {
    formData: any;
    onGenerate: () => void;
}

export default function Step7({ formData, onGenerate }: Step7Props) {
    const [loading, setLoading] = useState(false);

    return (
        <div className="relative space-y-10">

            {/* ⭐ STEPPER */}
            <Stepper steps={steps} currentStep={7} />

            {/* ⭐ OVERLAY ELEGANTE */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="loader-dots text-lg font-semibold">
                            Generazione in corso
                        </div>
                        <p className="text-gray-600 mt-2">Attendere qualche secondo…</p>
                    </div>
                </div>
            )}

            {/* ⭐ CONTENUTO */}
            <div className="space-y-10">

                {/* ⭐ TITOLO PRINCIPALE */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        📄 Riepilogo Finale
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Controlla tutte le informazioni prima di generare il preventivo definitivo.
                    </p>
                </div>

                {/* ⭐ CARD RIEPILOGO */}
                <div className="space-y-6">

                    {/* STEP 1 */}
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                            🔧 Dati iniziali intervento
                        </h3>
                        <div className="space-y-1 text-gray-700">
                            <p><strong>Tipo di intervento:</strong> {formData.intervento}</p>
                            <p><strong>Modello:</strong> {formData.modello}</p>
                            <p><strong>Potenza:</strong> {formData.potenza}</p>
                            <p><strong>Ambiente:</strong> {formData.ambiente}</p>
                            <p><strong>Metratura:</strong> {formData.metratura} m²</p>
                        </div>
                    </div>

                    {/* STEP 2 */}
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                            🏗️ Dati installazione
                        </h3>
                        <div className="space-y-1 text-gray-700">
                            <p><strong>Distanza:</strong> {formData.distanza} m</p>
                            <p><strong>Altezza:</strong> {formData.altezza} m</p>
                            <p><strong>Posizione Esterna:</strong> {formData.posizioneEsterna}</p>
                            <p><strong>Tipo di muro:</strong> {formData.tipoMuro}</p>
                        </div>
                    </div>

                    {/* STEP 3 */}
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                            🧩 Extra selezionati
                        </h3>

                        {formData.extra && formData.extra.length > 0 ? (
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                {formData.extra.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">Nessun extra selezionato</p>
                        )}
                    </div>

                    {/* STEP 4 */}
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                            💶 Costi
                        </h3>
                        <div className="space-y-1 text-gray-700">
                            <p><strong>Costo materiali:</strong> € {formData.costoMateriali}</p>
                            <p><strong>Costo manodopera:</strong> € {formData.costoManodopera}</p>
                            <p><strong>Costo extra:</strong> € {formData.costoExtra}</p>
                            <p><strong>Sconti:</strong> € {formData.sconti}</p>
                        </div>
                    </div>

                </div>

                {/* ⭐ TESTO INVITO */}
                <p className="text-center text-blue-600 font-semibold">
                    Premi il pulsante per generare il preventivo finale.
                </p>

                {/* ⭐ PULSANTE GENERA */}
                <button
                    onClick={() => {
                        setLoading(true);
                        onGenerate();
                    }}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold transition text-white ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Generazione in corso..." : "Genera Preventivo"}
                </button>

            </div>
        </div>
    );
}