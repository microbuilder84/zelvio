"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";

interface Step4Props {
    formData: any;
    updateField: (field: string, value: string) => void;
    errors: any;
    validateField?: (field: string, value: string) => void;
}

export default function Step4({ formData, updateField, errors, validateField }: Step4Props) {
    return (
        <div className="space-y-8">

            {/* ⭐ STEPPER */}
            <Stepper steps={steps} currentStep={4} />

            {/* ⭐ SEZIONE PRINCIPALE */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    💶 Costi e Materiali
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Inserisci i costi relativi ai materiali, alla manodopera e ad eventuali extra.
                </p>
            </div>

            {/* ⭐ GRUPPO COSTI PRINCIPALI */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    📦 Materiali e Manodopera
                </h3>

                {/* COSTO MATERIALI */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Costo Materiali (€)
                    </label>
                    <input
                        type="text"
                        value={formData.costoMateriali}
                        onChange={(e) => updateField("costoMateriali", e.target.value)}
                        onBlur={(e) => validateField?.("costoMateriali", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.costoMateriali ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 350"
                    />
                    {errors.costoMateriali && (
                        <p className="text-red-600 text-sm">{errors.costoMateriali}</p>
                    )}
                </div>

                {/* COSTO MANODOPERA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Costo Manodopera (€)
                    </label>
                    <input
                        type="text"
                        value={formData.costoManodopera}
                        onChange={(e) => updateField("costoManodopera", e.target.value)}
                        onBlur={(e) => validateField?.("costoManodopera", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.costoManodopera ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 200"
                    />
                    {errors.costoManodopera && (
                        <p className="text-red-600 text-sm">{errors.costoManodopera}</p>
                    )}
                </div>
            </div>

            {/* ⭐ GRUPPO COSTI EXTRA */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    ➕ Extra e Sconti
                </h3>

                {/* COSTO EXTRA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Costo Extra (€)
                    </label>
                    <input
                        type="text"
                        value={formData.costoExtra}
                        onChange={(e) => updateField("costoExtra", e.target.value)}
                        onBlur={(e) => validateField?.("costoExtra", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.costoExtra ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 50"
                    />
                    {errors.costoExtra && (
                        <p className="text-red-600 text-sm">{errors.costoExtra}</p>
                    )}
                </div>

                {/* SCONTI */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Sconti (€)
                    </label>
                    <input
                        type="text"
                        value={formData.sconti}
                        onChange={(e) => updateField("sconti", e.target.value)}
                        onBlur={(e) => validateField?.("sconti", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.sconti ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 20"
                    />
                    {errors.sconti && (
                        <p className="text-red-600 text-sm">{errors.sconti}</p>
                    )}
                </div>
            </div>

        </div>
    );
}