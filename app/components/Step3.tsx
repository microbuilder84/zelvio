"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";
import { useState } from "react";

interface Step3Props {
    formData: any;
    updateField: (field: string, value: any) => void;
}

export default function Step3({ formData, updateField }: Step3Props) {
    const [customInput, setCustomInput] = useState("");

    const toggleExtra = (value: string) => {
        const current = formData.extra || [];

        if (current.includes(value)) {
            updateField(
                "extra",
                current.filter((item: string) => item !== value)
            );
        } else {
            updateField("extra", [...current, value]);
        }
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
            <Stepper steps={steps} currentStep={3} />

            <div>
                <h2 className="text-xl font-bold text-gray-900">
                    🧩 Extra e Accessori
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Seleziona eventuali extra da includere nel preventivo.
                </p>
            </div>

            {/* EXTRA STANDARD */}
            <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800">
                    ➕ Componenti aggiuntivi
                </h3>

                <div className="grid grid-cols-1 gap-3">
                    {options.map((item) => (
                        <label
                            key={item}
                            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer 
                         hover:bg-gray-100 transition shadow-sm bg-white"
                        >
                            <input
                                type="checkbox"
                                checked={formData.extra?.includes(item) || false}
                                onChange={() => toggleExtra(item)}
                                className="h-4 w-4 accent-blue-600"
                            />
                            <span className="text-gray-800">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* EXTRA PERSONALIZZATI */}
            <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800">
                    ✏️ Altro (personalizzato)
                </h3>

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