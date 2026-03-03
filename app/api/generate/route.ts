import { NextRequest, NextResponse } from "next/server";
import { WizardSchema } from "@/lib/wizardSchema";
import { createClient } from "@supabase/supabase-js";

/* ================= SUPABASE ================= */

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* ================= CONFIG ================= */

const PAYLOAD_MAX_CHARS = 20_000;
const OPENAI_TIMEOUT_MS = 25_000;

const RL_WINDOW_MS = 60_000;
const RL_MAX_REQ = 10;
const DOC_TTL_MS = 30 * 60 * 1000;

/* ================= RATE LIMIT ================= */

type RLEntry = { count: number; resetAt: number };
const g = globalThis as unknown as { __zelvio_rl__?: Map<string, RLEntry> };
g.__zelvio_rl__ ??= new Map();
const RL = g.__zelvio_rl__!;

function getIp(req: NextRequest) {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

function rateLimit(ip: string) {
    const now = Date.now();
    const entry = RL.get(ip);

    if (!entry || now > entry.resetAt) {
        RL.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS });
        return { ok: true, remaining: RL_MAX_REQ - 1, resetAt: now + RL_WINDOW_MS };
    }

    if (entry.count >= RL_MAX_REQ) {
        return { ok: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count += 1;
    RL.set(ip, entry);

    return { ok: true, remaining: RL_MAX_REQ - entry.count, resetAt: entry.resetAt };
}

function jsonError(message: string, status: number) {
    return NextResponse.json(
        { error: message },
        {
            status,
            headers: {
                "content-type": "application/json",
                "cache-control": "no-store",
            },
        }
    );
}

function toMoneyNumber(v: unknown) {
    const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
}

/* ================= MAIN ================= */

export async function POST(req: NextRequest) {
    const requestId = req.headers.get("x-request-id") || crypto.randomUUID();

    const ip = getIp(req);
    const limited = rateLimit(ip);

    if (!limited.ok) {
        return jsonError("Troppi tentativi. Riprova tra poco.", 429);
    }

    try {
        const raw = await req.text();

        if (raw.length > PAYLOAD_MAX_CHARS) {
            return jsonError("Dati troppo lunghi.", 413);
        }

        let body: unknown;
        try {
            body = JSON.parse(raw);
        } catch {
            return jsonError("JSON non valido.", 400);
        }

        const parsed = WizardSchema.safeParse(body);
        if (!parsed.success) {
            return jsonError("Dati non validi.", 400);
        }

        const {
            tipoIntervento,
            marcaModello,
            potenza,
            tipologiaAmbiente,
            metratura,
            distanza,
            altezza,
            posizioneEsterna,
            tipoMuro,
            lavoriExtra,
            costoMateriali,
            costoManodopera,
            costoExtra,
            sconti,
            noteTecniche,
            richiesteCliente,
            urgenza,
            tecnico,
            telefono,
            email,
        } = parsed.data;

        const total =
            toMoneyNumber(costoMateriali) +
            toMoneyNumber(costoManodopera) +
            toMoneyNumber(costoExtra) -
            toMoneyNumber(sconti);

        /* ================= PROMPT ================= */

        const prompt = `
        Sei un tecnico professionista specializzato in installazione di climatizzatori, pompe di calore e caldaie.
        
        Il tuo compito è generare un preventivo tecnico completo, dettagliato, chiaro e professionale
        basato esclusivamente sui dati forniti.
        
        Non inventare nulla.
        Non aggiungere prezzi.
        Non modificare i numeri.
        Riformula sempre in modo tecnico e professionale.
        
        ⚠️ IMPORTANTISSIMO:
        - Restituisci SOLO JSON valido.
        - Nessun testo fuori dal JSON.
        - Nessun Markdown.
        - Nessun simbolo come ###, **, --- o simili.
        
        STRUTTURA OBBLIGATORIA:
        
        {
          "intestazione": {
            "azienda": string,
            "tecnico": string,
            "telefono": string,
            "email": string,
            "piva": string
          },
          "titolo": string,
          "introduzione": string,
          "descrizioneTecnica": string,
          "materiali": string[],
          "tempiInstallazione": string,
          "costi": {
            "materiali": number,
            "manodopera": number,
            "extra": number,
            "sconti": number,
            "totale": number
          },
          "clausole": string[],
          "firma": string
        }
        
        DATI UTENTE:
        
        Tipo intervento: ${tipoIntervento}
        Marca e modello: ${marcaModello}
        Potenza: ${potenza}
        Ambiente: ${tipologiaAmbiente}
        Metratura: ${metratura}
        
        Distanza interna-esterna: ${distanza}
        Altezza installazione: ${altezza}
        Posizione unità esterna: ${posizioneEsterna}
        Tipo muro: ${tipoMuro}
        
        Lavori extra: ${Array.isArray(lavoriExtra) && lavoriExtra.length
                ? lavoriExtra.join(", ")
                : "nessuno"
            }
        
        Costi:
        Materiali: ${toMoneyNumber(costoMateriali)}
        Manodopera: ${toMoneyNumber(costoManodopera)}
        Extra: ${toMoneyNumber(costoExtra)}
        Sconti: ${toMoneyNumber(sconti)}
        Totale: ${total}
        
        Note tecniche: ${noteTecniche || "nessuna"}
        Richieste cliente: ${richiesteCliente || "nessuna"}
        Urgenza: ${urgenza || "non specificata"}
        
        Installatore:
        Azienda: ${parsed.data.azienda}
        Tecnico: ${tecnico}
        Telefono: ${telefono}
        Email: ${email}
        P.IVA: ${parsed.data.piva}
        
        REGOLE DI GENERAZIONE:
        
        - La descrizione tecnica deve essere approfondita e professionale.
        - Riformula tutti i dati, non copiarli in forma grezza.
        - Spiega logica tecnica e modalità di installazione.
        - I materiali devono includere almeno 5 voci realistiche.
        - Le clausole massimo 6 punti.
        - Il totale deve essere esattamente quello fornito.
        - Il campo firma deve essere:
          "Tecnico responsabile: ${tecnico} – Tel: ${telefono} – Email: ${email}"
        
        Genera ora il JSON.
        `.trim();

        if (!process.env.OPENAI_API_KEY) {
            return jsonError("Configurazione server mancante.", 500);
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

        let aiResponse: Response;

        try {
            aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.2,
                }),
                signal: controller.signal,
            });
        } catch {
            clearTimeout(timeout);
            return jsonError("Errore di rete durante la generazione.", 502);
        } finally {
            clearTimeout(timeout);
        }

        if (!aiResponse.ok) {
            return jsonError("Errore AI temporaneo.", 502);
        }

        const data = await aiResponse.json();
        const rawOutput = data?.choices?.[0]?.message?.content?.trim() || "";

        let documentJson;

        try {
            documentJson = JSON.parse(rawOutput);
        } catch {
            return jsonError("Errore nel formato del documento generato.", 502);
        }

        /* ================= SAVE TO DB ================= */

        const docId = crypto.randomUUID().slice(0, 8);
        const expiresAt = new Date(Date.now() + DOC_TTL_MS).toISOString();

        const { error: insertError } = await supabase
            .from("preventivi")
            .insert({
                doc_id: docId,
                contenuto: JSON.stringify(documentJson),
                expires_at: expiresAt,
            });

        if (insertError) {
            console.error("Errore salvataggio DB:", insertError);
            return jsonError("Errore nel salvataggio del preventivo.", 500);
        }

        return NextResponse.json(
            { document: documentJson, docId },
            { status: 200 }
        );
    } catch (error) {
        console.error("API ERROR", error);
        return NextResponse.json(
            { error: "Errore interno." },
            { status: 500 }
        );
    }
}