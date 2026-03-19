import { z } from "zod";

export const WizardSchema = z.object({
    tipoIntervento: z.string().min(1),
    marcaModello: z.string().min(1),
    potenza: z.coerce.number().positive(),
    tipologiaAmbiente: z.string().min(1),
    metratura: z.coerce.number().positive(),

    distanza: z.coerce.number().nonnegative(),
    altezza: z.coerce.number().nonnegative(),

    posizioneEsterna: z.string().min(1),
    tipoMuro: z.string().min(1),

    lavoriExtra: z.array(z.string()).optional(),

    materialiRighe: z
        .array(
            z.object({
                descrizione: z.string().min(1, "Inserisci la descrizione del materiale."),
                prezzo: z.preprocess(
                    (val) => {
                        if (typeof val === "string") {
                            const t = val.trim().replace(",", ".");
                            if (t.length === 0) return undefined;
                            return Number(t);
                        }
                        return val;
                    },
                    z.number().finite().nonnegative("Il prezzo non può essere negativo.")
                ),
            })
        )
        .min(1, "Inserisci almeno una riga di materiale."),
    costoManodopera: z.coerce.number().nonnegative(),
    costoExtra: z.coerce.number().nonnegative(),
    sconti: z.coerce.number().nonnegative(),

    noteTecniche: z.string().optional(),
    richiesteCliente: z.string().optional(),
    clienteNome: z.string().min(1),
    clienteIndirizzo: z.string().min(1),

    tempiInstallazione: z.string().optional(), // ✅ AGGIUNTO

    tecnico: z.string().min(1),
    telefono: z.string().min(1),
    email: z.string().email(),

    azienda: z.string().min(1),
    indirizzoAzienda: z.string().min(1, "Inserisci l'indirizzo dell'azienda."),
    piva: z.string().min(1),
});