import { NextRequest, NextResponse } from "next/server";
import { WizardSchema } from "@/lib/wizardSchema";

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

// ============ DOC CACHE (best-effort in-memory) ============
type DocEntry = { output: string; createdAt: number; expiresAt: number };
const DOC_TTL_MS = 30 * 60 * 1000; // 30 minuti

const gg = globalThis as unknown as { __zelvio_docs__?: Map<string, DocEntry> };
gg.__zelvio_docs__ ??= new Map();
const DOCS = gg.__zelvio_docs__!;

function cleanupDocs() {
    const now = Date.now();
    for (const [k, v] of DOCS.entries()) {
        if (now > v.expiresAt) DOCS.delete(k);
    }
}

// Defensive: remove accidental markdown if model ignores instructions (rare, but happens)
function stripMarkdownArtifacts(text: string) {
    return text
        // headings like ### Title
        .replace(/^\s{0,3}#{1,6}\s+/gm, "")
        // horizontal rules like --- or ***
        .replace(/^\s*([-*_])\1\1+\s*$/gm, "")
        // bold/italic markers
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/_(.*?)_/g, "$1")
        // backticks
        .replace(/`{1,3}/g, "")
        .trim();
}

/**
 * Priority #2 hardening:
 * If the model repeats a company header block (azienda + contatti/piva) at the top,
 * remove that duplicated block so the PDF looks clean.
 */
function removeDuplicateCompanyHeader(text: string, azienda: string) {
    const a = (azienda || "").trim();
    if (!a) return text;

    const lines = text.split("\n");
    const maxScan = Math.min(lines.length, 24);
    const head = lines.slice(0, maxScan).join("\n");

    const hasCompany = head.toLowerCase().includes(a.toLowerCase());
    const hasContacts =
        /p\.?\s*iva|partita\s*iva/i.test(head) ||
        /tel|telefono/i.test(head) ||
        /email/i.test(head);

    // Only intervene when we are confident it's a duplicated header
    if (!(hasCompany && hasContacts)) return text;

    // If output follows our template, it should have a "TITOLO" section.
    const idxTitolo = lines.findIndex((l) => l.trim().toUpperCase() === "TITOLO");
    if (idxTitolo >= 0) return lines.slice(idxTitolo).join("\n").trim();

    // Fallback: drop everything up to the first blank line block
    for (let i = 0; i < maxScan; i++) {
        if (lines[i].trim() === "") {
            return lines.slice(i + 1).join("\n").trim();
        }
    }

    return text.trim();
}

// ============ MAIN ============
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
        // ---- Read as text first to cap payload ----
        const raw = await req.text();

        if (raw.length > PAYLOAD_MAX_CHARS) {
            return jsonError("Dati troppo lunghi. Riduci note e richieste.", 413, {
                "x-request-id": requestId,
                "x-ratelimit-remaining": String(limited.remaining),
            });
        }

        let body: unknown;
        try {
            body = JSON.parse(raw);
        } catch {
            return jsonError("JSON non valido.", 400, {
                "x-request-id": requestId,
                "x-ratelimit-remaining": String(limited.remaining),
            });
        }

        // ============ ZOD VALIDATION (single source of truth) ============
        const parsed = WizardSchema.safeParse(body);
        if (!parsed.success) {
            return jsonError("Dati non validi. Controlla i campi inseriti.", 400, {
                "x-request-id": requestId,
                "x-ratelimit-remaining": String(limited.remaining),
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
            azienda,
            tecnico,
            telefono,
            email,
            piva,
        } = parsed.data;

        // ============ PROMPT BUILD (PDF-ready, NO markdown, no duplicate header) ============
        const total =
            Number(costoMateriali) + Number(costoManodopera) + Number(costoExtra) - Number(sconti);

        const prompt = `
Sei un tecnico installatore professionista (climatizzatori / pompe di calore / caldaie).
Devi redigere un PREVENTIVO per il cliente basandoti ESCLUSIVAMENTE sui dati forniti. Non inventare nulla.

IMPORTANTE (OBBLIGATORIO):
- Non usare Markdown. Vietati: "#", "##", "###", "**", "__", "---", backticks.
- Non usare titoli in stile Markdown.
- Non ripetere i dati dell’azienda/tecnico come intestazione: quelli sono già stampati nel documento.
- Scrivi in italiano, tono professionale e chiaro, pronto da consegnare al cliente.
- Usa testo normale. Per liste usa solo "-" o "•".

DATI INTERVENTO (da riformulare, non copiare):
- Tipo intervento: ${tipoIntervento}
- Marca e modello: ${marcaModello}
- Potenza: ${potenza}
- Ambiente: ${tipologiaAmbiente}
- Metratura: ${metratura} m²

DATI INSTALLAZIONE:
- Distanza interna-esterna: ${distanza} m
- Altezza installazione: ${altezza} m
- Posizione unità esterna: ${posizioneEsterna}
- Tipo muro: ${tipoMuro}
- Lavori extra: ${Array.isArray(lavoriExtra) && lavoriExtra.length ? lavoriExtra.join(", ") : "nessuno"}

NOTE:
- Note tecniche: ${noteTecniche ? noteTecniche : "nessuna"}
- Richieste cliente: ${richiesteCliente ? richiesteCliente : "nessuna"}
- Urgenza: ${urgenza ? urgenza : "non specificata"}

COSTI (usa SOLO questi importi, non aggiungere IVA se non specificata):
- Materiali: € ${costoMateriali}
- Manodopera: € ${costoManodopera}
- Extra: € ${costoExtra}
- Sconti: € ${sconti}
- Totale finale già calcolato: € ${total}

OUTPUT: genera ESATTAMENTE la seguente struttura, con le stesse intestazioni testuali (senza simboli strani).
Mantieni le sezioni nell’ordine e separale con una riga vuota.

TITOLO
Scrivi una riga tipo: "Preventivo per ${tipoIntervento} – ${marcaModello}"

INTRODUZIONE
2-4 righe, professionali.

DESCRIZIONE TECNICA DELL’INTERVENTO
Un paragrafo che riformula i dati tecnici (ambiente, metratura, modello, potenza, posa/posizionamento, distanze, lavori extra e note).

MATERIALI INCLUSI
Lista con "-" (minimo 4 voci). Includi materiali standard + eventuali materiali impliciti dai lavori extra, senza inventare marche o quantità non date.

TEMPI DI ESECUZIONE
1-3 righe con una stima realistica in base ai dati (senza inventare sopralluoghi se non necessari; puoi menzionare "previo sopralluogo" solo come condizione generale).

COSTI DETTAGLIATI
Righe separate:
Materiali: € ...
Manodopera: € ...
Extra: € ...
Sconti: € ...
Totale finale: € ${total}
Non ricalcolare il totale: usa il valore fornito.

CLAUSOLE E CONDIZIONI
Lista con "-" (max 6 punti) includendo:
- validità del preventivo (es. 7/15 giorni)
- possibili variazioni dopo sopralluogo/condizioni non previste
- modalità pagamento (es. acconto/saldo o bonifico/contanti) in forma generica
- garanzia intervento/materiali (in forma generica)
- tempi di intervento su conferma

FIRMA E CONTATTI
Una riga finale con: "Tecnico responsabile: ${tecnico} – Tel: ${telefono} – Email: ${email}"

Genera ora il preventivo in testo pulito, senza Markdown.
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
                    temperature: 0.3, // slightly lower = more consistent formatting
                }),
                signal: controller.signal,
            });
        } catch (err: any) {
            clearTimeout(timeout);
            const msg =
                err?.name === "AbortError"
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
            try {
                await aiResponse.json();
            } catch {
                // ignore
            }

            if (aiResponse.status === 401) {
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

            return jsonError("Errore temporaneo nella generazione del preventivo. Riprova.", 502, {
                "x-request-id": requestId,
                "x-ratelimit-remaining": String(limited.remaining),
                "x-upstream-status": String(aiResponse.status),
            });
        }

        const data = await aiResponse.json();
        const rawOutput =
            data?.choices?.[0]?.message?.content?.trim() || "Errore nella generazione del preventivo.";

        // Safety net: strip markdown artifacts if any slipped through
        let output = stripMarkdownArtifacts(rawOutput);

        // Priority #2: remove duplicated company header blocks if model repeats them
        output = removeDuplicateCompanyHeader(output, azienda);

        // ============ DOC CACHE SAVE + docId ============
        cleanupDocs();
        const docId = crypto.randomUUID().slice(0, 8);

        DOCS.set(docId, {
            output,
            createdAt: Date.now(),
            expiresAt: Date.now() + DOC_TTL_MS,
        });

        return NextResponse.json(
            { output, docId },
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
        console.error(`[ZELVIO] API ERROR requestId=${requestId}`, error);
        return NextResponse.json(
            { error: "Errore interno durante la generazione del preventivo." },
            { status: 500, headers: { "x-request-id": requestId } }
        );
    }
}