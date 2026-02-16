"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";

interface Step3Props {
    formData: any;
    updateField: (field: string, value: any) => void;
}

export default function Step3({ formData, updateField }: Step3Props) {
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
            <Stepper steps={steps} currentStep={3} />

            {/* ⭐ SEZIONE PRINCIPALE */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    🧩 Extra e Accessori
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Seleziona eventuali extra da includere nel preventivo.
                </p>
            </div>

            {/* ⭐ LISTA CHECKBOX PREMIUM */}
            <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
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
                                className="h-4 w-4 accent-blue-600 transition-transform hover:scale-110"
                            />
                            <span className="text-gray-800">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
}