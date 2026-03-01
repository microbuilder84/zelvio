import { z } from "zod";

const positiveNumber = z.coerce.number().gt(0);
const nonNegativeNumber = z.coerce.number().min(0);

const telefonoRegex = /^[0-9+\s]+$/;
const pivaRegex = /^\d{11}$/;

export const WizardSchema = z.object({
    // STEP 1
    tipoIntervento: z.string().min(1),
    marcaModello: z.string().min(1),
    potenza: positiveNumber,
    tipologiaAmbiente: z.string().min(1),
    metratura: positiveNumber,

    // STEP 2
    distanza: positiveNumber,
    altezza: positiveNumber,
    posizioneEsterna: z.string().min(1),
    tipoMuro: z.string().min(1),

    // STEP 3
    lavoriExtra: z.array(z.string()).optional().default([]),

    // STEP 4
    costoMateriali: nonNegativeNumber,
    costoManodopera: nonNegativeNumber,
    costoExtra: z.coerce.number().min(0).optional().default(0),
    sconti: z.coerce.number().min(0).optional().default(0),

    // STEP 5
    noteTecniche: z.string().max(1500).optional().default(""),
    richiesteCliente: z.string().max(1500).optional().default(""),
    urgenza: z.string().optional().default(""),

    // STEP 6
    azienda: z.string().min(1),
    tecnico: z.string().min(1),
    telefono: z.string().regex(telefonoRegex),
    email: z.string().email(),
    piva: z
        .string()
        .transform((v) => v.replace(/\s|-/g, ""))
        .refine((v) => pivaRegex.test(v), {
            message: "Partita IVA non valida",
        }),
});

export type WizardData = z.infer<typeof WizardSchema>;