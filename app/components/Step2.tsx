"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";

interface Step2Props {
    formData: any;
    updateField: (field: string, value: string) => void;
    errors: any;
    validateField?: (field: string, value: string) => void;
}

export default function Step2({ formData, updateField, errors, validateField }: Step2Props) {
    return (
        <div className="space-y-8">

            {/* ⭐ STEPPER */}
            <Stepper steps={steps} currentStep={2} />

            {/* ⭐ SEZIONE PRINCIPALE */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    🧰 Dati installazione
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Specifica le condizioni dell’installazione per calcolare correttamente materiali e manodopera.
                </p>
            </div>

            {/* ⭐ GRUPPO 1 — DISTANZE E MISURE */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    📏 Distanze e misure
                </h3>

                {/* DISTANZA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Distanza Unità Interna → Esterna (m)
                    </label>
                    <input
                        type="text"
                        value={formData.distanza}
                        onChange={(e) => updateField("distanza", e.target.value)}
                        onBlur={(e) => validateField?.("distanza", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.distanza ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 3.5"
                    />
                    {errors.distanza && (
                        <p className="text-red-600 text-sm">{errors.distanza}</p>
                    )}
                </div>

                {/* ALTEZZA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Altezza Installazione (m)
                    </label>
                    <input
                        type="text"
                        value={formData.altezza}
                        onChange={(e) => updateField("altezza", e.target.value)}
                        onBlur={(e) => validateField?.("altezza", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.altezza ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 2.2"
                    />
                    {errors.altezza && (
                        <p className="text-red-600 text-sm">{errors.altezza}</p>
                    )}
                </div>
            </div>

            {/* ⭐ GRUPPO 2 — POSIZIONAMENTO */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🏗️ Posizionamento
                </h3>

                {/* POSIZIONE ESTERNA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Posizione Unità Esterna
                    </label>
                    <input
                        type="text"
                        value={formData.posizioneEsterna}
                        onChange={(e) => updateField("posizioneEsterna", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.posizioneEsterna ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. Balcone, Giardino, Tetto..."
                    />
                    {errors.posizioneEsterna && (
                        <p className="text-red-600 text-sm">{errors.posizioneEsterna}</p>
                    )}
                </div>

                {/* TIPO MURO */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Tipo di Muro
                    </label>
                    <input
                        type="text"
                        value={formData.tipoMuro}
                        onChange={(e) => updateField("tipoMuro", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.tipoMuro ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. Cartongesso, Cemento, Mattone..."
                    />
                    {errors.tipoMuro && (
                        <p className="text-red-600 text-sm">{errors.tipoMuro}</p>
                    )}
                </div>
            </div>

        </div>
    );
}