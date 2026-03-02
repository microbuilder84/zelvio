import { NextRequest, NextResponse } from "next/server";
import { WizardSchema } from "@/lib/wizardSchema";

/* ================= CONFIG ================= */

const PAYLOAD_MAX_CHARS = 20_000;
const OPENAI_TIMEOUT_MS = 25_000;

const RL_WINDOW_MS = 60_000;
const RL_MAX_REQ = 10;

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

function jsonError(message: string, status: number, extraHeaders?: Record<string, string>) {
    return NextResponse.json(
        { error: message },
        {
            status,
            headers: {
                "content-type": "application/json",
                "cache-control": "no-store",
                ...(extraHeaders ?? {}),
            },
        }
    );
}

/* ================= DOC CACHE ================= */

type DocEntry = {
    document: any;
    createdAt: number;
    expiresAt: number;
};

const DOC_TTL_MS = 30 * 60 * 1000;

const gg = globalThis as unknown as { __zelvio_docs__?: Map<string, DocEntry> };
gg.__zelvio_docs__ ??= new Map();
const DOCS = gg.__zelvio_docs__!;

function cleanupDocs() {
    const now = Date.now();
    for (const [k, v] of DOCS.entries()) {
        if (now > v.expiresAt) DOCS.delete(k);
    }
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
        return jsonError("Troppi tentativi. Riprova tra poco.", 429, {
            "x-request-id": requestId,
            "x-ratelimit-reset": String(limited.resetAt),
            "x-ratelimit-remaining": "0",
        });
    }

    try {
        const raw = await req.text();

        if (raw.length > PAYLOAD_MAX_CHARS) {
            return jsonError("Dati troppo lunghi.", 413, {
                "x-request-id": requestId,
            });
        }

        let body: unknown;
        try {
            body = JSON.parse(raw);
        } catch {
            return jsonError("JSON non valido.", 400, {
                "x-request-id": requestId,
            });
        }

        const parsed = WizardSchema.safeParse(body);
        if (!parsed.success) {
            return jsonError("Dati non validi.", 400, {
                "x-request-id": requestId,
            });
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

        /* ================= PROMPT JSON STRICT ================= */

        const prompt = `
Genera un PREVENTIVO professionale in formato JSON valido.

NON usare Markdown.
NON usare testo fuori dal JSON.
Restituisci SOLO JSON valido.

Struttura OBBLIGATORIA:

{
  "titolo": string,
  "introduzione": string,
  "descrizioneTecnica": string,
  "materiali": string[],
  "tempiEsecuzione": string,
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

DATI:

Tipo intervento: ${tipoIntervento}
Marca e modello: ${marcaModello}
Potenza: ${potenza}
Ambiente: ${tipologiaAmbiente}
Metratura: ${metratura} m²
Distanza: ${distanza} m
Altezza: ${altezza} m
Posizione esterna: ${posizioneEsterna}
Tipo muro: ${tipoMuro}
Lavori extra: ${Array.isArray(lavoriExtra) && lavoriExtra.length
                ? lavoriExtra.join(", ")
                : "nessuno"
            }
Note tecniche: ${noteTecniche || "nessuna"}
Richieste cliente: ${richiesteCliente || "nessuna"}
Urgenza: ${urgenza || "non specificata"}

COSTI:
Materiali: ${toMoneyNumber(costoMateriali)}
Manodopera: ${toMoneyNumber(costoManodopera)}
Extra: ${toMoneyNumber(costoExtra)}
Sconti: ${toMoneyNumber(sconti)}
Totale: ${total}

Regole:
- Non inventare numeri diversi.
- Usa il totale fornito.
- Clausole massimo 6.
- Materiali minimo 4 voci.
- Firma formato: "Tecnico responsabile: ${tecnico} – Tel: ${telefono} – Email: ${email}"
`.trim();

        if (!process.env.OPENAI_API_KEY) {
            return jsonError("Configurazione server mancante.", 500, {
                "x-request-id": requestId,
            });
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
        const rawOutput =
            data?.choices?.[0]?.message?.content?.trim() || "";

        let documentJson;

        try {
            documentJson = JSON.parse(rawOutput);
        } catch {
            return jsonError("Errore nel formato del documento generato.", 502);
        }

        cleanupDocs();
        const docId = crypto.randomUUID().slice(0, 8);

        DOCS.set(docId, {
            document: documentJson,
            createdAt: Date.now(),
            expiresAt: Date.now() + DOC_TTL_MS,
        });

        return NextResponse.json(
            { document: documentJson, docId },
            {
                status: 200,
                headers: {
                    "cache-control": "no-store",
                    "x-request-id": requestId,
                    "x-doc-ttl-ms": String(DOC_TTL_MS),
                },
            }
        );
    } catch (error) {
        console.error("API ERROR", error);
        return NextResponse.json(
            { error: "Errore interno." },
            { status: 500, headers: { "cache-control": "no-store" } }
        );
    }
}