"use client";

import Stepper from "./ui/Stepper";
import { steps } from "./ui/steps";

interface Step6Props {
    formData: any;
    updateField: (field: string, value: string) => void;
    errors: any;
    validateField?: (field: string, value: string) => void;
}

export default function Step6({ formData, updateField, errors, validateField }: Step6Props) {
    return (
        <div className="space-y-8">

            {/* ⭐ STEPPER */}
            <Stepper steps={steps} currentStep={6} />

            {/* ⭐ SEZIONE PRINCIPALE */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    🏢 Dati Aziendali
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Inserisci le informazioni dell’azienda e del tecnico responsabile.
                </p>
            </div>

            {/* ⭐ GRUPPO DATI AZIENDA */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🧾 Informazioni aziendali
                </h3>

                {/* NOME AZIENDA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Nome Azienda
                    </label>
                    <input
                        type="text"
                        value={formData.azienda}
                        onChange={(e) => updateField("azienda", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.azienda ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. ClimaService SRL"
                    />
                    {errors.azienda && (
                        <p className="text-red-600 text-sm">{errors.azienda}</p>
                    )}
                </div>

                {/* PARTITA IVA */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Partita IVA
                    </label>
                    <input
                        type="text"
                        value={formData.piva}
                        onChange={(e) => updateField("piva", e.target.value)}
                        onBlur={(e) => validateField?.("piva", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.piva ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 01234567890"
                    />
                    {errors.piva && (
                        <p className="text-red-600 text-sm">{errors.piva}</p>
                    )}
                </div>
            </div>

            {/* ⭐ GRUPPO TECNICO RESPONSABILE */}
            <div className="space-y-6 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    👨‍🔧 Tecnico responsabile
                </h3>

                {/* TECNICO RESPONSABILE */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Tecnico Responsabile
                    </label>
                    <input
                        type="text"
                        value={formData.tecnico}
                        onChange={(e) => updateField("tecnico", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.tecnico ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. Mario Rossi"
                    />
                    {errors.tecnico && (
                        <p className="text-red-600 text-sm">{errors.tecnico}</p>
                    )}
                </div>

                {/* TELEFONO */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Telefono
                    </label>
                    <input
                        type="text"
                        value={formData.telefono}
                        onChange={(e) => updateField("telefono", e.target.value)}
                        onBlur={(e) => validateField?.("telefono", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.telefono ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. 333 1234567"
                    />
                    {errors.telefono && (
                        <p className="text-red-600 text-sm">{errors.telefono}</p>
                    )}
                </div>

                {/* EMAIL */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        onBlur={(e) => validateField?.("email", e.target.value)}
                        className={`w-full p-3 rounded-lg border shadow-sm transition 
              ${errors.email ? "border-red-500" : "border-gray-300"}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Es. info@climaservice.it"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm">{errors.email}</p>
                    )}
                </div>
            </div>

        </div>
    );
}