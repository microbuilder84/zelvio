import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
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

    await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: 'Scrivi SOLO questo JSON: { "test": "ok" }',
          },
        ],
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: "Errore OpenAI", details: err },
        { status: 500 }
      );
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

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

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase
      .from("preventivi")
      .insert({
        doc_id: crypto.randomUUID().slice(0, 8),
        contenuto: JSON.stringify(parsed),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      });

    if (error) {
      return NextResponse.json(
        { error: "Errore salvataggio DB", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ saved: true, parsed });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Errore interno", details: err?.message },
      { status: 500 }
    );
  }
}