import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { WizardSchema } from "@/lib/wizardSchema";

/* ================= UTILS ================= */

function toMoneyNumber(v: unknown) {
  const n =
    typeof v === "number"
      ? v
      : Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/* ================= TEMPI DETERMINISTICI ================= */

function generaTempiStimati(data: any) {
  const metratura = Number(data.metratura);
  const distanza = Number(data.distanza);
  const altezza = Number(data.altezza);

  if (metratura <= 30 && distanza <= 5 && altezza <= 3) {
    return "Installazione prevista in 1 giornata lavorativa.";
  }

  if (metratura <= 60) {
    return "Installazione prevista in 1-2 giornate lavorative.";
  }

  return "Installazione prevista in 2-3 giornate lavorative.";
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

    /* ================= TEMPI FINALI ================= */

    const tempiInstallazioneFinali =
      dataInput.tempiInstallazione &&
        dataInput.tempiInstallazione.trim().length > 0
        ? dataInput.tempiInstallazione.trim()
        : generaTempiStimati(dataInput);

    /* ================= CALCOLO TOTALE ================= */

    const totale =
      toMoneyNumber(dataInput.costoMateriali) +
      toMoneyNumber(dataInput.costoManodopera) +
      toMoneyNumber(dataInput.costoExtra) -
      toMoneyNumber(dataInput.sconti);

    /* ================= PROMPT ================= */

    const prompt = `
Sei un tecnico certificato specializzato in installazione di climatizzatori, pompe di calore e impianti termici.

Redigi un preventivo tecnico altamente professionale, strutturato come farebbe un'impresa certificata con esperienza sul campo.

Regole rigide:
- Non inventare dati.
- Non modificare numeri o importi.
- Non aggiungere costi.
- Usa ESATTAMENTE i tempi di installazione forniti.
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

DATI INTERVENTO:

Tipo intervento: ${dataInput.tipoIntervento}
Marca e modello: ${dataInput.marcaModello}
Potenza: ${dataInput.potenza} BTU
Ambiente: ${dataInput.tipologiaAmbiente}
Metratura: ${dataInput.metratura} m²

Distanza unità interna-esterna: ${dataInput.distanza} m
Altezza installazione: ${dataInput.altezza} m
Posizione unità esterna: ${dataInput.posizioneEsterna}
Tipo muro: ${dataInput.tipoMuro}

Lavori extra: ${Array.isArray(dataInput.lavoriExtra) && dataInput.lavoriExtra.length
        ? dataInput.lavoriExtra.join(", ")
        : "nessuno"
      }

TEMPI DI INSTALLAZIONE (OBBLIGATORI):
${tempiInstallazioneFinali}

COSTI:

Materiali: ${toMoneyNumber(dataInput.costoMateriali)}
Manodopera: ${toMoneyNumber(dataInput.costoManodopera)}
Extra: ${toMoneyNumber(dataInput.costoExtra)}
Sconti: ${toMoneyNumber(dataInput.sconti)}
Totale: ${totale}

INSTALLATORE:

Azienda: ${dataInput.azienda}
Tecnico: ${dataInput.tecnico}
Telefono: ${dataInput.telefono}
Email: ${dataInput.email}
P.IVA: ${dataInput.piva}

Il totale deve essere ESATTAMENTE ${totale}.
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

    /* ================= PARSING ROBUSTO ================= */

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return NextResponse.json(
        { error: "JSON non trovato", raw },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(raw.slice(start, end + 1));
    } catch {
      return NextResponse.json(
        { error: "Parsing fallito", raw },
        { status: 500 }
      );
    }

    if (typeof parsed !== "object") {
      return NextResponse.json(
        { error: "Output AI non valido." },
        { status: 500 }
      );
    }

    /* ================= HARD OVERRIDE CAMPI CRITICI ================= */

    parsed.costi = parsed.costi || {};
    parsed.costi.materiali = toMoneyNumber(dataInput.costoMateriali);
    parsed.costi.manodopera = toMoneyNumber(dataInput.costoManodopera);
    parsed.costi.extra = toMoneyNumber(dataInput.costoExtra);
    parsed.costi.sconti = toMoneyNumber(dataInput.sconti);
    parsed.costi.totale = totale;

    parsed.tempiInstallazione = tempiInstallazioneFinali;

    parsed.clausole = [
      "Il preventivo è valido per 7 giorni.",
      "Eventuali lavori aggiuntivi saranno quotati separatamente previa approvazione.",
      "L'intervento sarà eseguito da personale qualificato con rilascio di dichiarazione di conformità ai sensi del DM 37/08.",
      "La garanzia sui materiali è di 2 anni."
    ];

    /* ================= VALIDAZIONE STRUTTURA ================= */

    if (
      !parsed.intestazione ||
      !parsed.titolo ||
      !parsed.descrizioneTecnica ||
      !parsed.materiali ||
      !parsed.costi
    ) {
      return NextResponse.json(
        { error: "Output AI incompleto o malformato." },
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
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
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