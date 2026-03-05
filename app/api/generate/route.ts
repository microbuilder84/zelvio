import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { WizardSchema } from "@/lib/wizardSchema";

function toMoneyNumber(v: unknown) {
  const n =
    typeof v === "number"
      ? v
      : Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export async function POST(req: NextRequest) {
  try {
    /* ================= ENV CHECK ================= */

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY mancante" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Configurazione Supabase mancante" },
        { status: 500 }
      );
    }

    /* ================= VALIDAZIONE INPUT ================= */

    const body = await req.json();
    const parsedInput = WizardSchema.safeParse(body);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          error: "Input non valido",
          details: parsedInput.error.flatten(),
        },
        { status: 400 }
      );
    }

    const dataInput = parsedInput.data;

    const totale =
      toMoneyNumber(dataInput.costoMateriali) +
      toMoneyNumber(dataInput.costoManodopera) +
      toMoneyNumber(dataInput.costoExtra) -
      toMoneyNumber(dataInput.sconti);

    /* ================= PROMPT ================= */

    const prompt = `
Sei un tecnico professionista specializzato in installazione di climatizzatori, pompe di calore e caldaie.

Genera un preventivo tecnico completo, dettagliato e professionale
basato esclusivamente sui dati forniti.

Regole:
- Non inventare nulla.
- Non modificare i numeri.
- Non aggiungere costi.
- Restituisci SOLO JSON valido.
- Nessun markdown.
- Nessun testo fuori dal JSON.

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

DATI:

Tipo intervento: ${dataInput.tipoIntervento}
Marca e modello: ${dataInput.marcaModello}
Potenza: ${dataInput.potenza}
Ambiente: ${dataInput.tipologiaAmbiente}
Metratura: ${dataInput.metratura}

Distanza: ${dataInput.distanza}
Altezza: ${dataInput.altezza}
Posizione esterna: ${dataInput.posizioneEsterna}
Tipo muro: ${dataInput.tipoMuro}

Lavori extra: ${Array.isArray(dataInput.lavoriExtra) && dataInput.lavoriExtra.length
        ? dataInput.lavoriExtra.join(", ")
        : "nessuno"
      }

Costi:
Materiali: ${toMoneyNumber(dataInput.costoMateriali)}
Manodopera: ${toMoneyNumber(dataInput.costoManodopera)}
Extra: ${toMoneyNumber(dataInput.costoExtra)}
Sconti: ${toMoneyNumber(dataInput.sconti)}
Totale: ${totale}

Note: ${dataInput.noteTecniche || "nessuna"}
Richieste cliente: ${dataInput.richiesteCliente || "nessuna"}
Urgenza: ${dataInput.urgenza || "non specificata"}

Installatore:
Azienda: ${dataInput.azienda}
Tecnico: ${dataInput.tecnico}
Telefono: ${dataInput.telefono}
Email: ${dataInput.email}
P.IVA: ${dataInput.piva}

Il totale deve essere esattamente ${totale}

Il campo firma deve essere:
"Tecnico responsabile: ${dataInput.tecnico} – Tel: ${dataInput.telefono} – Email: ${dataInput.email}"
`.trim();

    /* ================= OPENAI CALL ================= */

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Rispondi esclusivamente con JSON valido. Nessun testo fuori dal JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: "Errore OpenAI", details: err },
        { status: 500 }
      );
    }

    const aiData = await response.json();
    const raw = aiData.choices?.[0]?.message?.content || "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "JSON non trovato", raw },
        { status: 500 }
      );
    }

    let parsed;

    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Parsing fallito", raw },
        { status: 500 }
      );
    }

    /* ================= SUPABASE SAVE ================= */

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const docId = crypto.randomUUID().slice(0, 8);

    const { error } = await supabase
      .from("preventivi")
      .insert({
        doc_id: docId,
        contenuto: JSON.stringify(parsed),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      });

    if (error) {
      return NextResponse.json(
        { error: "Errore salvataggio DB", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      saved: true,
      docId,
      document: parsed,
    });
  } catch (error) {
    console.error("Errore in /api/generate:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}