import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // ⭐ FUNZIONE DI ERRORE
        const fail = (msg: string) =>
            NextResponse.json({ error: msg }, { status: 400 });

        // ⭐ VALIDAZIONE LATO SERVER — STEP 1
        if (!body.tipoIntervento) return fail("Tipo intervento mancante.");
        if (!body.marcaModello) return fail("Modello mancante.");

        if (!body.potenza || Number(body.potenza) <= 0)
            return fail("Potenza non valida.");

        if (!body.tipologiaAmbiente)
            return fail("Ambiente mancante.");

        if (!body.metratura || Number(body.metratura) <= 0)
            return fail("Metratura non valida.");

        // ⭐ STEP 2
        if (!body.distanza || Number(body.distanza) <= 0)
            return fail("Distanza non valida.");

        if (!body.altezza || Number(body.altezza) <= 0)
            return fail("Altezza non valida.");

        if (!body.posizioneEsterna)
            return fail("Posizione esterna mancante.");

        if (!body.tipoMuro)
            return fail("Tipo muro mancante.");

        // ⭐ STEP 4
        if (body.costoMateriali === undefined || Number(body.costoMateriali) < 0)
            return fail("Costo materiali non valido.");

        if (body.costoManodopera === undefined || Number(body.costoManodopera) < 0)
            return fail("Costo manodopera non valido.");

        if (body.costoExtra !== "" && Number(body.costoExtra) < 0)
            return fail("Costo extra non valido.");

        if (body.sconti !== "" && Number(body.sconti) < 0)
            return fail("Sconti non validi.");

        // ⭐ STEP 6
        if (!body.azienda) return fail("Nome azienda mancante.");
        if (!body.tecnico) return fail("Nome tecnico mancante.");

        if (!body.telefono) return fail("Telefono mancante.");
        if (!/^[0-9+\s]+$/.test(body.telefono))
            return fail("Telefono non valido.");

        if (!body.email) return fail("Email mancante.");
        if (!/\S+@\S+\.\S+/.test(body.email))
            return fail("Email non valida.");

        if (!body.piva) return fail("Partita IVA mancante.");
        if (!/^\d{11}$/.test(body.piva.replace(/\s|-/g, "")))
            return fail("Partita IVA non valida.");

        // ⭐ SE TUTTO È OK → PROSEGUI CON LA GENERAZIONE

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
- Materiali: ${costoMateriali || ""}
- Manodopera: ${costoManodopera || ""}
- Extra: ${costoExtra || ""}
- Sconti: ${sconti || ""}

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

1. **Intestazione aziendale**
   Inserisci i dati dell’installatore in modo ordinato.

2. **Titolo del preventivo**
   Basato su tipo intervento + modello.

3. **Introduzione**
   Breve testo professionale che introduce il preventivo.

4. **Descrizione tecnica dell’intervento**
   - Riformula i dati tecnici in modo professionale.
   - Descrivi ambiente, metratura, modello, potenza.
   - Spiega posizione delle unità e distanza.
   - Includi lavori extra, note e richieste cliente.
   - Non ripetere i dati in forma grezza: riformula.

5. **Materiali inclusi**
   Elenco puntato dei materiali standard + quelli impliciti dai lavori extra.

6. **Tempi di installazione**
   Stima realistica basata sulla complessità.

7. **Costi dettagliati**
   Usa SOLO i valori forniti:
   - Materiali
   - Manodopera
   - Extra
   - Sconti
   Calcola il totale finale.

8. **Totale finale**
   Evidenzia il totale.

9. **Clausole e condizioni**
   Inserisci condizioni standard:
   - validità preventivo
   - possibili variazioni dopo sopralluogo
   - modalità pagamento
   - garanzia

10. **Firma e contatti**
    Nome tecnico + telefono + email.

### REGOLE
- Non inventare prezzi o dati tecnici.
- Non copiare i dati: riformula sempre.
- Mantieni tono professionale, tecnico e chiaro.
- Output pronto per PDF.

Genera ora il preventivo.
        `;

        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
        });

        const data = await aiResponse.json();
        const output = data.choices?.[0]?.message?.content || "Errore nella generazione del preventivo.";

        return NextResponse.json({ output });

    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { output: "Errore interno durante la generazione del preventivo." },
            { status: 500 }
        );
    }
}