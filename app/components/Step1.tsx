"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";

interface Step1Props {
    formData: any;
    updateField: (field: string, value: string) => void;
    errors: any;
    validateField?: (field: string, value: string) => void;
}

export default function Step1({ formData, updateField, errors, validateField }: Step1Props) {
    return (
        <div className="space-y-8">

            {/* ⭐ STEPPER */}
            <Stepper steps={steps} currentStep={1} />

            {/* ⭐ SEZIONE PRINCIPALE */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    📘 Dati iniziali intervento
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Inserisci le informazioni di base per iniziare la generazione del preventivo.
                </p>
            </div>

            {/* ⭐ GRUPPO 1 — DATI TECNICI */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🔧 Informazioni tecniche
                </h3>

                {/* CAMPO: TIPO INTERVENTO */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Tipo di intervento
                    </label>
                    <input
                        type="text"
                        value={formData.intervento}
                        onChange={(e) => updateField("intervento", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.intervento ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. Installazione, Manutenzione..."
                    />
                    {errors.intervento && (
                        <p className="text-red-600 text-sm">{errors.intervento}</p>
                    )}
                </div>

                {/* CAMPO: MODELLO */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Modello
                    </label>
                    <input
                        type="text"
                        value={formData.modello}
                        onChange={(e) => updateField("modello", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.modello ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. Daikin Perfera 12000 BTU"
                    />
                    {errors.modello && (
                        <p className="text-red-600 text-sm">{errors.modello}</p>
                    )}
                </div>

                {/* CAMPO: POTENZA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Potenza (BTU)
                    </label>
                    <input
                        type="text"
                        value={formData.potenza}
                        onChange={(e) => updateField("potenza", e.target.value)}
                        onBlur={(e) => validateField?.("potenza", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.potenza ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 12000"
                    />
                    {errors.potenza && (
                        <p className="text-red-600 text-sm">{errors.potenza}</p>
                    )}
                </div>
            </div>

            {/* ⭐ GRUPPO 2 — DATI AMBIENTE */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🏠 Ambiente
                </h3>

                {/* CAMPO: AMBIENTE */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Ambiente
                    </label>
                    <input
                        type="text"
                        value={formData.ambiente}
                        onChange={(e) => updateField("ambiente", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.ambiente ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. Soggiorno, Camera..."
                    />
                    {errors.ambiente && (
                        <p className="text-red-600 text-sm">{errors.ambiente}</p>
                    )}
                </div>

                {/* CAMPO: METRATURA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Metratura (m²)
                    </label>
                    <input
                        type="text"
                        value={formData.metratura}
                        onChange={(e) => updateField("metratura", e.target.value)}
                        onBlur={(e) => validateField?.("metratura", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.metratura ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 25"
                    />
                    {errors.metratura && (
                        <p className="text-red-600 text-sm">{errors.metratura}</p>
                    )}
                </div>
            </div>

        </div>
    );
}