"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";
import "./loader.css";
import { useState, useEffect } from "react";

interface Step7Props {
    formData: any;
    onGenerate: () => Promise<boolean>;
    isGenerating?: boolean;
    error?: string | null;
    onBack?: () => void;
    updateField?: (field: string, value: any) => void; // ✅ AGGIUNTO
}

export default function Step7({
    formData,
    onGenerate,
    isGenerating = false,
    error = null,
    onBack,
    updateField,
}: Step7Props) {
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        if (error) setLocalError(null);
    }, [error]);

    const effectiveError = error || localError;

    const handleGenerate = async () => {
        if (isGenerating) return;

        setLocalError(null);

        const ok = await onGenerate();

        if (!ok && !error) {
            setLocalError("Generazione non riuscita. Controlla la connessione e riprova.");
        }
    };

    return (
        <div className="relative space-y-10">
            <Stepper steps={steps} currentStep={7} />

            {isGenerating && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="loader-dots text-lg font-semibold">
                            Generazione in corso
                        </div>
                        <p className="text-gray-600 mt-2">
                            Attendere qualche secondo…
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-10">

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        📄 Riepilogo Finale
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Controlla tutte le informazioni prima di generare il preventivo definitivo.
                    </p>
                </div>

                {effectiveError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <div className="font-semibold">Errore</div>
                        <div className="mt-1">{effectiveError}</div>
                    </div>
                )}

                {/* DATI INTERVENTO */}
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-lg mb-3">🔧 Dati intervento</h3>
                    <p><strong>Tipo:</strong> {formData.intervento || "—"}</p>
                    <p><strong>Modello:</strong> {formData.modello || "—"}</p>
                    <p><strong>Potenza:</strong> {formData.potenza || "—"}</p>
                    <p><strong>Ambiente:</strong> {formData.ambiente || "—"}</p>
                    <p><strong>Metratura:</strong> {formData.metratura || "—"} m²</p>
                </div>

                {/* INSTALLAZIONE */}
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-lg mb-3">🏗️ Installazione</h3>
                    <p><strong>Distanza:</strong> {formData.distanza || "—"} m</p>
                    <p><strong>Altezza:</strong> {formData.altezza || "—"} m</p>
                    <p><strong>Posizione esterna:</strong> {formData.posizioneEsterna || "—"}</p>
                    <p><strong>Tipo muro:</strong> {formData.tipoMuro || "—"}</p>
                </div>

                {/* TEMPI INSTALLAZIONE – MODIFICABILE */}
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-lg mb-3">⏱️ Tempi di esecuzione</h3>

                    <input
                        type="text"
                        value={formData.tempiInstallazione || ""}
                        onChange={(e) =>
                            updateField && updateField("tempiInstallazione", e.target.value)
                        }
                        placeholder="Es: 2 giorni lavorativi"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <p className="text-xs text-gray-500 mt-2">
                        Inserisci una stima realistica (es. 1 giorno, 2-3 giorni, 4 ore…)
                    </p>
                </div>

                {/* COSTI */}
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-lg mb-3">💶 Costi</h3>
                    <p><strong>Materiali:</strong> € {formData.costoMateriali || "0"}</p>
                    <p><strong>Manodopera:</strong> € {formData.costoManodopera || "0"}</p>
                    <p><strong>Extra:</strong> € {formData.costoExtra || "0"}</p>
                    <p><strong>Sconti:</strong> € {formData.sconti || "0"}</p>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`w-full py-3 rounded-lg font-semibold text-white ${isGenerating
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {isGenerating ? "Generazione in corso..." : "Genera Preventivo"}
                </button>

            </div>
        </div>
    );
}