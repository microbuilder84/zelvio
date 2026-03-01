import { NextRequest, NextResponse } from "next/server";

// ============ CONFIG (tweak safe) ============
const PAYLOAD_MAX_CHARS = 20_000; // ~20KB
const OPENAI_TIMEOUT_MS = 25_000;

const RL_WINDOW_MS = 60_000; // 1 min
const RL_MAX_REQ = 10; // 10 req/min per IP (best-effort)

// ============ RATE LIMIT (best-effort in-memory) ============
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
        { status, headers: { "content-type": "application/json", ...(extraHeaders ?? {}) } }
    );
}

// ============ MAIN ============
export async function POST(req: NextRequest) {
    const requestId =
        req.headers.get("x-request-id") || crypto.randomUUID();

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
        // ---- Read as text first to cap payload ----
        const raw = await req.text();
        if (raw.length > PAYLOAD_MAX_CHARS) {
            return jsonError("Dati troppo lunghi. Riduci note e richieste.", 413, {
                "x-request-id": requestId,
                "x-ratelimit-remaining": String(limited.remaining),
            });
        }

        let body: any;
        try {
            body = JSON.parse(raw);
        } catch {
            return jsonError("JSON non valido.", 400, {
                "x-request-id": requestId,
                "x-ratelimit-remaining": String(limited.remaining),
            });
        }

        // ⭐ FUNZIONE DI ERRORE (400)
        const fail = (msg: string) =>
            NextResponse.json(
                { error: msg },
                {
                    status: 400,
                    headers: {
                        "x-request-id": requestId,
                        "x-ratelimit-remaining": String(limited.remaining),
                    },
                }
            );

        // ============ SERVER VALIDATION (your logic, unchanged) ============
        // STEP 1
        if (!body.tipoIntervento) return fail("Tipo intervento mancante.");
        if (!body.marcaModello) return fail("Modello mancante.");

        if (!body.potenza || Number(body.potenza) <= 0) return fail("Potenza non valida.");
        if (!body.tipologiaAmbiente) return fail("Ambiente mancante.");
        if (!body.metratura || Number(body.metratura) <= 0) return fail("Metratura non valida.");

        // STEP 2
        if (!body.distanza || Number(body.distanza) <= 0) return fail("Distanza non valida.");
        if (!body.altezza || Number(body.altezza) <= 0) return fail("Altezza non valida.");
        if (!body.posizioneEsterna) return fail("Posizione esterna mancante.");
        if (!body.tipoMuro) return fail("Tipo muro mancante.");

        // STEP 4
        if (body.costoMateriali === undefined || Number(body.costoMateriali) < 0)
            return fail("Costo materiali non valido.");

        if (body.costoManodopera === undefined || Number(body.costoManodopera) < 0)
            return fail("Costo manodopera non valido.");

        if (body.costoExtra !== "" && body.costoExtra !== undefined && Number(body.costoExtra) < 0)
            return fail("Costo extra non valido.");

        if (body.sconti !== "" && body.sconti !== undefined && Number(body.sconti) < 0)
            return fail("Sconti non validi.");

        // STEP 6
        if (!body.azienda) return fail("Nome azienda mancante.");
        if (!body.tecnico) return fail("Nome tecnico mancante.");

        if (!body.telefono) return fail("Telefono mancante.");
        if (!/^[0-9+\s]+$/.test(body.telefono)) return fail("Telefono non valido.");

        if (!body.email) return fail("Email mancante.");
        if (!/\S+@\S+\.\S+/.test(body.email)) return fail("Email non valida.");

        if (!body.piva) return fail("Partita IVA mancante.");
        if (!/^\d{11}$/.test(String(body.piva).replace(/\s|-/g, "")))
            return fail("Partita IVA non valida.");

        // Optional hard caps (ROI: avoids prompt explosion)
        if (typeof body.noteTecniche === "string" && body.noteTecniche.length > 1500)
            return fail("Note tecniche troppo lunghe (max 1500 caratteri).");
        if (typeof body.richiesteCliente === "string" && body.richiesteCliente.length > 1500)
            return fail("Richieste cliente troppo lunghe (max 1500 caratteri).");

        // ============ PROMPT BUILD ============
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
            azienda,
            tecnico,
            telefono,
            email,
            piva,
        } = body;

        const prompt = `
Sei un tecnico professionista specializzato in installazione di climatizzatori, pompe di calore e caldaie.
Il tuo compito è generare un preventivo tecnico completo, chiaro e professionale basato esclusivamente
sui dati forniti. Non inventare nulla. Riformula sempre in modo tecnico e professionale.

### DATI UTENTE
Tipo intervento: ${tipoIntervento || ""}
Marca e modello: ${marcaModello || ""}
Potenza: ${potenza || ""}
Ambiente: ${tipologiaAmbiente || ""}
Metratura: ${metratura || ""}

Distanza interna-esterna: ${distanza || ""}
Altezza installazione: ${altezza || ""}
Posizione unità esterna: ${posizioneEsterna || ""}
Tipo muro: ${tipoMuro || ""}

Lavori extra: ${Array.isArray(lavoriExtra) ? lavoriExtra.join(", ") : (lavoriExtra || "")}

Costi:
- Materiali: ${costoMateriali ?? ""}
- Manodopera: ${costoManodopera ?? ""}
- Extra: ${costoExtra ?? ""}
- Sconti: ${sconti ?? ""}

Note tecniche: ${noteTecniche || ""}
Richieste cliente: ${richiesteCliente || ""}
Urgenza: ${urgenza || ""}

Installatore:
Azienda: ${azienda || ""}
Tecnico: ${tecnico || ""}
Telefono: ${telefono || ""}
Email: ${email || ""}
P.IVA: ${piva || ""}

### OBIETTIVO
Genera un preventivo tecnico professionale seguendo esattamente la struttura seguente.
Il testo deve essere fluido, coerente e pronto per un PDF.

### STRUTTURA
1. Intestazione aziendale
2. Titolo del preventivo
3. Introduzione
4. Descrizione tecnica dell’intervento
5. Materiali inclusi
6. Tempi di installazione
7. Costi dettagliati + totale finale (usa SOLO i valori forniti)
8. Clausole e condizioni
9. Firma e contatti

### REGOLE
- Non inventare prezzi o dati tecnici.
- Non copiare i dati: riformula sempre.
- Mantieni tono professionale, tecnico e chiaro.
- Output pronto per PDF.

Genera ora il preventivo.
    `.trim();

        // ============ OPENAI CALL (timeout + abort) ============
        if (!process.env.OPENAI_API_KEY) {
            return jsonError("Configurazione server mancante (OPENAI_API_KEY).", 500, {
                "x-request-id": requestId,
                "x-ratelimit-remaining": String(limited.remaining),
            });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

        const startedAt = Date.now();

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
                    temperature: 0.4,
                }),
                signal: controller.signal,
            });
        } catch (err: any) {
            clearTimeout(timeout);
            const msg = err?.name === "AbortError"
                ? "Timeout durante la generazione. Riprova tra qualche secondo."
                : "Errore di rete durante la generazione. Riprova.";
            return jsonError(msg, 502, {
                "x-request-id": requestId,
                "x-ratelimit-remaining": String(limited.remaining),
            });
        } finally {
            clearTimeout(timeout);
        }

        const durationMs = Date.now() - startedAt;

        // If OpenAI returns non-OK, map to safe message (no leaking)
        if (!aiResponse.ok) {
            // best-effort parse
            let detail = "";
            try {
                const j = await aiResponse.json();
                detail = j?.error?.message ? String(j.error.message) : "";
            } catch {
                // ignore
            }

            if (aiResponse.status === 401) {
                // misconfig
                return jsonError("Configurazione AI non valida. Contatta il supporto.", 502, {
                    "x-request-id": requestId,
                    "x-ratelimit-remaining": String(limited.remaining),
                });
            }

            if (aiResponse.status === 429) {
                return jsonError("Servizio occupato (troppi tentativi). Riprova tra poco.", 502, {
                    "x-request-id": requestId,
                    "x-ratelimit-remaining": String(limited.remaining),
                });
            }

            // generic upstream failure
            return jsonError(
                "Errore temporaneo nella generazione del preventivo. Riprova.",
                502,
                {
                    "x-request-id": requestId,
                    "x-ratelimit-remaining": String(limited.remaining),
                    "x-upstream-status": String(aiResponse.status),
                    // NOTE: do NOT expose detail to client; keep it out
                }
            );
        }

        const data = await aiResponse.json();
        const output =
            data?.choices?.[0]?.message?.content?.trim() ||
            "Errore nella generazione del preventivo.";

        return NextResponse.json(
            { output },
            {
                status: 200,
                headers: {
                    "x-request-id": requestId,
                    "x-ratelimit-remaining": String(limited.remaining),
                    "x-generate-duration-ms": String(durationMs),
                },
            }
        );
    } catch (error) {
        // no payload logging
        console.error(`[ZELVIO] API ERROR requestId=${requestId}`, error);
        return NextResponse.json(
            { error: "Errore interno durante la generazione del preventivo." },
            { status: 500, headers: { "x-request-id": requestId } }
        );
    }
}