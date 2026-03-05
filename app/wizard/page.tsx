"use client";

import { useEffect, useState } from "react";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Step3 from "../components/Step3";
import Step4 from "../components/Step4";
import Step5 from "../components/Step5";
import Step6 from "../components/Step6";
import Step7 from "../components/Step7";

import {
  WrenchIcon,
  HomeIcon,
  AdjustmentsHorizontalIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, label: "Dati intervento", icon: WrenchIcon },
    { id: 2, label: "Ambiente e metratura", icon: HomeIcon },
    { id: 3, label: "Percorso tubazioni", icon: AdjustmentsHorizontalIcon },
    { id: 4, label: "Costi", icon: CurrencyEuroIcon },
    { id: 5, label: "Note tecniche", icon: DocumentTextIcon },
    { id: 6, label: "Dati azienda", icon: BuildingOfficeIcon },
    { id: 7, label: "Riepilogo", icon: ClipboardDocumentCheckIcon },
  ];

  const current = steps.find((s) => s.id === currentStep);

  const [formData, setFormData] = useState({
    intervento: "",
    modello: "",
    potenza: "",
    ambiente: "",
    metratura: "",
    distanza: "",
    altezza: "",
    posizioneEsterna: "",
    tipoMuro: "",
    extra: [] as string[],
    costoMateriali: "",
    costoManodopera: "",
    costoExtra: "",
    sconti: "",
    noteTecniche: "",
    richiesteCliente: "",
    urgenza: "",
    tempiInstallazione: "",
    azienda: "",
    tecnico: "",
    telefono: "",
    email: "",
    piva: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  /* ================= AUTOSAVE ================= */

  useEffect(() => {
    const saved = localStorage.getItem("wizard_data");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch { }
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem("wizard_data", JSON.stringify(formData));
      } catch { }
    }, 300);

    return () => clearTimeout(t);
  }, [formData]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= VALIDAZIONE STEP ================= */

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.intervento) newErrors.intervento = "Seleziona il tipo di intervento.";
      if (!formData.modello) newErrors.modello = "Inserisci il modello.";
      if (!formData.potenza || Number(formData.potenza) <= 0)
        newErrors.potenza = "Potenza non valida.";
      if (!formData.ambiente) newErrors.ambiente = "Seleziona l'ambiente.";
      if (!formData.metratura || Number(formData.metratura) <= 0)
        newErrors.metratura = "Metratura non valida.";
    }

    if (step === 2) {
      if (!formData.distanza || Number(formData.distanza) <= 0)
        newErrors.distanza = "Distanza non valida.";
      if (!formData.altezza || Number(formData.altezza) <= 0)
        newErrors.altezza = "Altezza non valida.";
      if (!formData.posizioneEsterna)
        newErrors.posizioneEsterna = "Seleziona la posizione esterna.";
      if (!formData.tipoMuro)
        newErrors.tipoMuro = "Seleziona il tipo di muro.";
    }

    if (step === 4) {
      if (formData.costoMateriali === "" || Number(formData.costoMateriali) < 0)
        newErrors.costoMateriali = "Costo materiali non valido.";
      if (formData.costoManodopera === "" || Number(formData.costoManodopera) < 0)
        newErrors.costoManodopera = "Costo manodopera non valido.";
      if (Number(formData.costoExtra) < 0)
        newErrors.costoExtra = "Costo extra non valido.";
      if (Number(formData.sconti) < 0)
        newErrors.sconti = "Sconto non valido.";
    }

    if (step === 6) {
      if (!formData.azienda) newErrors.azienda = "Inserisci il nome azienda.";
      if (!formData.tecnico) newErrors.tecnico = "Inserisci il tecnico.";
      if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email non valida.";
      if (!/^\d{11}$/.test(formData.piva.replace(/\s|-/g, "")))
        newErrors.piva = "Partita IVA non valida.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= NAV ================= */

  const nextStep = () => {
    if (isGenerating) return;
    if (!validateStep(currentStep)) return;
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (isGenerating) return;
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  /* ================= GENERAZIONE ================= */

  const handleGenerate = async (): Promise<boolean> => {
    if (isGenerating) return false;

    const ok =
      validateStep(1) &&
      validateStep(2) &&
      validateStep(4) &&
      validateStep(6);

    if (!ok) {
      setGenerateError("Correggi i campi prima di generare.");
      return false;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoIntervento: formData.intervento,
          marcaModello: formData.modello,
          potenza: formData.potenza,
          tipologiaAmbiente: formData.ambiente,
          metratura: formData.metratura,
          distanza: formData.distanza,
          altezza: formData.altezza,
          posizioneEsterna: formData.posizioneEsterna,
          tipoMuro: formData.tipoMuro,
          lavoriExtra: formData.extra,
          costoMateriali: formData.costoMateriali,
          costoManodopera: formData.costoManodopera,
          costoExtra: formData.costoExtra,
          sconti: formData.sconti,
          noteTecniche: formData.noteTecniche,
          richiesteCliente: formData.richiesteCliente,
          urgenza: formData.urgenza,
          tempiInstallazione: formData.tempiInstallazione,  // ✅ AGGIUNTO
          azienda: formData.azienda,
          tecnico: formData.tecnico,
          telefono: formData.telefono,
          email: formData.email,
          piva: formData.piva,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.docId) {
        setGenerateError(data?.error || "Errore generazione.");
        return false;
      }

      localStorage.setItem("preventivo_doc_id", data.docId);

      window.location.href = `/preventivo?id=${encodeURIComponent(
        data.docId
      )}`;

      return true;
    } catch {
      setGenerateError("Errore di rete.");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

        <div className="mb-6 pb-4 border-b">
          <span className="text-sm text-gray-500">
            Step {currentStep} di {steps.length}
          </span>

          <div className="flex items-center gap-3 mt-2">
            {current?.icon && <current.icon className="h-7 w-7 text-blue-600" />}
            <h2 className="text-2xl font-bold">{current?.label}</h2>
          </div>
        </div>

        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <Step1 formData={formData} updateField={updateField} errors={errors} />
          )}
          {currentStep === 2 && (
            <Step2 formData={formData} updateField={updateField} errors={errors} />
          )}
          {currentStep === 3 && (
            <Step3 formData={formData} updateField={updateField} />
          )}
          {currentStep === 4 && (
            <Step4 formData={formData} updateField={updateField} errors={errors} />
          )}
          {currentStep === 5 && (
            <Step5 formData={formData} updateField={updateField} />
          )}
          {currentStep === 6 && (
            <Step6 formData={formData} updateField={updateField} errors={errors} />
          )}
          {currentStep === 7 && (
            <Step7
              formData={formData}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={generateError}
              onBack={() => setCurrentStep(6)}
              updateField={updateField}
            />
          )}
        </div>

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">
              Indietro
            </button>
          )}

          {currentStep < 7 && (
            <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded">
              Avanti
            </button>
          )}
        </div>
      </div>
    </div>
  );
}