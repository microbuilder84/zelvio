"use client";

import { useState, useEffect } from "react";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Step3 from "../components/Step3";
import Step4 from "../components/Step4";
import Step5 from "../components/Step5";
import Step6 from "../components/Step6";
import Step7 from "../components/Step7";

// HEROICONS
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
    extra: [],
    costoMateriali: "",
    costoManodopera: "",
    costoExtra: "",
    sconti: "",
    noteTecniche: "",
    richiesteCliente: "",
    urgenza: "",
    azienda: "",
    tecnico: "",
    telefono: "",
    email: "",
    piva: "",
  });

  // AUTOSAVE — LOAD
  useEffect(() => {
    const saved = localStorage.getItem("wizard_data");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch { }
    }
  }, []);

  // AUTOSAVE — SAVE
  const updateField = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("wizard_data", JSON.stringify(updated));
      return updated;
    });
  };

  // VALIDAZIONI
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    // STEP 1
    if (step === 1) {
      if (!formData.intervento)
        newErrors.intervento = "Seleziona il tipo di intervento.";
      if (!formData.modello)
        newErrors.modello = "Inserisci il modello del climatizzatore.";
      if (!formData.potenza)
        newErrors.potenza = "Inserisci la potenza.";
      else if (Number(formData.potenza) <= 0)
        newErrors.potenza = "La potenza deve essere maggiore di 0.";
      if (!formData.ambiente)
        newErrors.ambiente = "Seleziona l'ambiente.";
      if (!formData.metratura)
        newErrors.metratura = "Inserisci la metratura.";
      else if (Number(formData.metratura) <= 0)
        newErrors.metratura = "La metratura deve essere maggiore di 0.";
    }

    // STEP 2
    if (step === 2) {
      if (!formData.distanza)
        newErrors.distanza = "Inserisci la distanza.";
      else if (Number(formData.distanza) <= 0)
        newErrors.distanza = "La distanza deve essere maggiore di 0.";
      if (!formData.altezza)
        newErrors.altezza = "Inserisci l'altezza.";
      else if (Number(formData.altezza) <= 0)
        newErrors.altezza = "L'altezza deve essere maggiore di 0.";
      if (!formData.posizioneEsterna)
        newErrors.posizioneEsterna = "Seleziona la posizione esterna.";
      if (!formData.tipoMuro)
        newErrors.tipoMuro = "Seleziona il tipo di muro.";
    }

    // STEP 4
    if (step === 4) {
      if (formData.costoMateriali === "")
        newErrors.costoMateriali = "Inserisci il costo materiali.";
      else if (Number(formData.costoMateriali) < 0)
        newErrors.costoMateriali = "Il valore non può essere negativo.";
      if (formData.costoManodopera === "")
        newErrors.costoManodopera = "Inserisci il costo manodopera.";
      else if (Number(formData.costoManodopera) < 0)
        newErrors.costoManodopera = "Il valore non può essere negativo.";
      if (formData.costoExtra !== "" && Number(formData.costoExtra) < 0)
        newErrors.costoExtra = "Il valore non può essere negativo.";
      if (formData.sconti !== "" && Number(formData.sconti) < 0)
        newErrors.sconti = "Il valore non può essere negativo.";
    }

    // STEP 6
    if (step === 6) {
      if (!formData.azienda)
        newErrors.azienda = "Inserisci il nome dell'azienda.";
      if (!formData.tecnico)
        newErrors.tecnico = "Inserisci il nome del tecnico responsabile.";
      if (!formData.telefono)
        newErrors.telefono = "Inserisci un numero di telefono.";
      else if (!/^[0-9+\s]+$/.test(formData.telefono))
        newErrors.telefono = "Formato telefono non valido.";
      if (!formData.email)
        newErrors.email = "Inserisci un indirizzo email.";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Formato email non valido.";
      if (!formData.piva)
        newErrors.piva = "Inserisci la Partita IVA.";
      else if (!/^\d{11}$/.test(formData.piva.replace(/\s|-/g, "")))
        newErrors.piva = "La Partita IVA deve contenere 11 cifre.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // VALIDAZIONE LIVE
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    const clearError = () => {
      delete newErrors[field];
      setErrors(newErrors);
    };
    const setError = (msg: string) => {
      newErrors[field] = msg;
      setErrors(newErrors);
    };

    switch (field) {
      case "potenza":
      case "metratura":
      case "distanza":
      case "altezza":
      case "costoMateriali":
      case "costoManodopera":
        if (!value) return;
        if (Number(value) <= 0) return setError("Il valore deve essere maggiore di 0.");
        return clearError();

      case "costoExtra":
      case "sconti":
        if (value === "") return clearError();
        if (Number(value) < 0) return setError("Il valore non può essere negativo.");
        return clearError();

      case "telefono":
        if (!value) return;
        if (!/^[0-9+\s]+$/.test(value)) return setError("Formato telefono non valido.");
        return clearError();

      case "email":
        if (!value) return;
        if (!/\S+@\S+\.\S+/.test(value)) return setError("Formato email non valido.");
        return clearError();

      case "piva":
        if (!value) return;
        if (!/^\d{11}$/.test(value.replace(/\s|-/g, "")))
          return setError("La Partita IVA deve contenere 11 cifre.");
        return clearError();
    }
  };

  // NAVIGAZIONE
  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleGenerate = async () => {
    try {
      const payload = {
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
        azienda: formData.azienda,
        tecnico: formData.tecnico,
        telefono: formData.telefono,
        email: formData.email,
        piva: formData.piva,
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      localStorage.setItem("preventivo_output", data.output);
      window.location.href = "/preventivo";
    } catch (err) {
      console.error("Errore durante la generazione:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-6 py-14">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10 w-full max-w-2xl">

        {/* HEADER STEP */}
        <div className="mb-8 pb-5 border-b border-gray-200">
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            Step {currentStep} di {steps.length}
          </span>

          <div className="flex items-center gap-3 mt-2">
            {current?.icon && (
              <current.icon className="h-7 w-7 text-blue-600" />
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {current?.label}
            </h2>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP WRAPPER */}
        <div className="relative bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100">
          <div key={currentStep} className="fade">
            {currentStep === 1 && (
              <Step1 formData={formData} updateField={updateField} errors={errors} validateField={validateField} />
            )}
            {currentStep === 2 && (
              <Step2 formData={formData} updateField={updateField} errors={errors} validateField={validateField} />
            )}
            {currentStep === 3 && (
              <Step3 formData={formData} updateField={updateField} />
            )}
            {currentStep === 4 && (
              <Step4 formData={formData} updateField={updateField} errors={errors} validateField={validateField} />
            )}
            {currentStep === 5 && (
              <Step5 formData={formData} updateField={updateField} />
            )}
            {currentStep === 6 && (
              <Step6 formData={formData} updateField={updateField} errors={errors} validateField={validateField} />
            )}
            {currentStep === 7 && (
              <Step7 formData={formData} onGenerate={handleGenerate} />
            )}
          </div>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
            >
              Indietro
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 7 ? (
            <button
              onClick={nextStep}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
            >
              Avanti
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}