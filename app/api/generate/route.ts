import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY mancante" },
        { status: 500 }
      );
    }

    await req.json(); // leggiamo il body anche se non lo usiamo

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
            content: "Scrivi SOLO questo JSON: { \"test\": \"ok\" }",
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

    return NextResponse.json({ parsed });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Errore interno", details: err?.message },
      { status: 500 }
    );
  }
}
