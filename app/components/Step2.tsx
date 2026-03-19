"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";
import { useState } from "react";

interface Step2Props {
    formData: any;
    updateField: (field: string, value: any) => void;
    errors: any;
    validateField?: (field: string, value: string) => void;
}

export default function Step2({ formData, updateField, errors, validateField }: Step2Props) {
    const [customInput, setCustomInput] = useState("");
    const extraPrezzi = formData.extraPrezzi || {};

    const toggleExtra = (value: string) => {
        const current = formData.extra || [];
        const prezziCorrenti = formData.extraPrezzi || {};

        if (current.includes(value)) {
            updateField(
                "extra",
                current.filter((item: string) => item !== value)
            );
            const nextPrezzi = { ...prezziCorrenti };
            delete nextPrezzi[value];
            updateField("extraPrezzi", nextPrezzi);
        } else {
            updateField("extra", [...current, value]);
        }
    };

    const updateExtraPrice = (value: string, prezzo: string) => {
        updateField("extraPrezzi", {
            ...extraPrezzi,
            [value]: prezzo,
        });
    };

    const addCustomExtra = () => {
        const value = customInput.trim();
        if (!value) return;

        const current = formData.extraPersonalizzati || [];

        if (!current.includes(value)) {
            updateField("extraPersonalizzati", [...current, value]);
        }

        setCustomInput("");
    };

    const removeCustomExtra = (value: string) => {
        const current = formData.extraPersonalizzati || [];
        updateField(
            "extraPersonalizzati",
            current.filter((item: string) => item !== value)
        );
    };

    const options = [
        "Canalina aggiuntiva",
        "Foro supplementare",
        "Staffa rinforzata",
        "Scarico condensa",
        "Prolunga elettrica",
        "Vibrostop",
    ];

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

            {/* ⭐ GRUPPO 3 — EXTRA E ACCESSORI */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">🧩 Extra e Accessori</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Seleziona eventuali extra da includere nel preventivo.
                </p>
            </div>

            {/* EXTRA STANDARD */}
            <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800">➕ Componenti aggiuntivi</h3>

                <div className="grid grid-cols-1 gap-3">
                    {options.map((item) => {
                        const selected = formData.extra?.includes(item) || false;
                        return (
                            <div
                                key={item}
                                className="p-3 border rounded-lg hover:bg-gray-100 transition shadow-sm bg-white"
                            >
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => toggleExtra(item)}
                                        className="h-4 w-4 accent-blue-600"
                                    />
                                    <span className="text-gray-800">{item}</span>
                                </label>

                                {selected && (
                                    <div className="mt-3">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Prezzo opzionale (€)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            inputMode="decimal"
                                            value={extraPrezzi[item] ?? ""}
                                            onChange={(e) => updateExtraPrice(item, e.target.value)}
                                            placeholder="€"
                                            className="w-full md:w-56 p-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* EXTRA PERSONALIZZATI */}
            <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800">✏️ Altro (personalizzato)</h3>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Es: Staffa speciale inox"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={addCustomExtra}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Aggiungi
                    </button>
                </div>

                {formData.extraPersonalizzati?.length > 0 && (
                    <ul className="space-y-2">
                        {formData.extraPersonalizzati.map(
                            (item: string, index: number) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center bg-white p-3 border rounded-lg"
                                >
                                    <span>{item}</span>
                                    <button
                                        onClick={() => removeCustomExtra(item)}
                                        className="text-red-500 text-sm"
                                    >
                                        Rimuovi
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>

        </div>
    );
}