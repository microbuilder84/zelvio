"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";

interface Step4Props {
    formData: any;
    updateField: (field: string, value: any) => void;
    errors: any;
    validateField?: (field: string, value: string) => void;
}

export default function Step4({ formData, updateField, errors, validateField }: Step4Props) {
    const materialiRighe = Array.isArray(formData.materialiRighe)
        ? formData.materialiRighe
        : [];

    const toMoneyNumber = (v: unknown) => {
        if (typeof v === "number") return Number.isFinite(v) ? v : 0;
        const n = Number(String(v ?? "").replace(",", "."));
        return Number.isFinite(n) ? n : 0;
    };

    const totaleMateriali = materialiRighe.reduce(
        (acc: number, row: any) => acc + toMoneyNumber(row?.prezzo),
        0
    );

    const setMaterialiRighe = (next: any[]) => updateField("materialiRighe", next);

    return (
        <div className="space-y-8">

            {/* ⭐ STEPPER */}
            <Stepper steps={steps} currentStep={3} />

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

                {/* MATERIALI DETTAGLIATI */}
                <div className="space-y-3">
                    <div className="flex items-end justify-between gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Materiali (righe dettagliate)
                            </label>
                            <p className="text-gray-500 text-xs">
                                Inserisci descrizione e prezzo. Il totale si aggiorna automaticamente.
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-gray-600">Totale materiali</div>
                            <div className="font-bold text-gray-900 text-lg">
                                € {totaleMateriali}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {materialiRighe.map((row: any, idx: number) => (
                            <div
                                key={idx}
                                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
                            >
                                <div className="md:col-span-7 space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Descrizione
                                    </label>
                                    <input
                                        type="text"
                                        value={row?.descrizione ?? ""}
                                        onChange={(e) => {
                                            const next = [...materialiRighe];
                                            next[idx] = {
                                                ...next[idx],
                                                descrizione: e.target.value,
                                            };
                                            setMaterialiRighe(next);
                                        }}
                                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${
                                            errors?.materialiRighe?.[idx]?.descrizione
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        placeholder="Es. Climatizzatore Daikin Perfera"
                                    />
                                    {errors?.materialiRighe?.[idx]?.descrizione && (
                                        <p className="text-red-600 text-sm">
                                            {errors.materialiRighe[idx].descrizione}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-4 space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Prezzo (€)
                                    </label>
                                    <input
                                        type="text"
                                        value={row?.prezzo ?? ""}
                                        onChange={(e) => {
                                            const next = [...materialiRighe];
                                            next[idx] = { ...next[idx], prezzo: e.target.value };
                                            setMaterialiRighe(next);
                                        }}
                                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${
                                            errors?.materialiRighe?.[idx]?.prezzo
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        placeholder="Es. 350"
                                    />
                                    {errors?.materialiRighe?.[idx]?.prezzo && (
                                        <p className="text-red-600 text-sm">
                                            {errors.materialiRighe[idx].prezzo}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-1 pt-7 flex">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (materialiRighe.length <= 1) return;
                                            const next = materialiRighe.filter(
                                                (_: any, i: number) => i !== idx
                                            );
                                            setMaterialiRighe(next);
                                        }}
                                        className={`w-full min-h-[46px] flex items-center justify-center px-3 py-2 rounded-lg border shadow-sm text-lg font-semibold leading-none transition ${
                                            materialiRighe.length <= 1
                                                ? "opacity-40 cursor-not-allowed bg-gray-100 text-red-400"
                                                : "hover:bg-red-50 border-red-200 text-red-600"
                                        }`}
                                        disabled={materialiRighe.length <= 1}
                                        aria-label="Rimuovi riga materiale"
                                        title="Rimuovi"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() =>
                                setMaterialiRighe([
                                    ...materialiRighe,
                                    { descrizione: "", prezzo: "" },
                                ])
                            }
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                        >
                            + Aggiungi riga
                        </button>
                    </div>
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