"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";

interface Step5Props {
    formData: any;
    updateField: (field: string, value: string) => void;
}

export default function Step5({ formData, updateField }: Step5Props) {
    return (
        <div className="space-y-8">

            {/* ⭐ STEPPER */}
            <Stepper steps={steps} currentStep={5} />

            {/* ⭐ SEZIONE PRINCIPALE */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    📝 Note Tecniche e Dettagli
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Aggiungi informazioni utili per personalizzare il preventivo in base alle esigenze del cliente.
                </p>
            </div>

            {/* ⭐ GRUPPO NOTE TECNICHE */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🔧 Note tecniche
                </h3>

                {/* NOTE TECNICHE */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Note Tecniche
                    </label>
                    <textarea
                        value={formData.noteTecniche}
                        onChange={(e) => updateField("noteTecniche", e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 shadow-sm h-28
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Es. Parete in cartongesso, necessaria staffa rinforzata..."
                    />
                </div>
            </div>

            {/* ⭐ GRUPPO RICHIESTE CLIENTE */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🙋 Richieste del cliente
                </h3>

                {/* RICHIESTE CLIENTE */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Richieste del Cliente
                    </label>
                    <textarea
                        value={formData.richiesteCliente}
                        onChange={(e) => updateField("richiesteCliente", e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 shadow-sm h-28
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Es. Installazione entro 48 ore, preferenza per lato sinistro..."
                    />
                </div>
            </div>

            {/* ⭐ GRUPPO URGENZA */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    ⏱️ Livello di urgenza
                </h3>

                {/* URGENZA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Livello di Urgenza
                    </label>
                    <select
                        value={formData.urgenza}
                        onChange={(e) => updateField("urgenza", e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        <option value="">Seleziona...</option>
                        <option value="bassa">Bassa</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="immediata">Immediata</option>
                    </select>
                </div>
            </div>

        </div>
    );
}