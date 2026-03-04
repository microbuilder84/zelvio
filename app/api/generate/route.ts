import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OPENAI_API_KEY mancante" },
                { status: 500 }
            );
        }

        const body = await req.json();

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
                        content: "Scrivi un JSON con { test: 'ok' }",
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

        // Estrae solo il JSON tra { ... }
        const jsonMatch = raw.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            return NextResponse.json(
                { error: "JSON non trovato nella risposta", raw },
                { status: 500 }
            );
        }

        let parsed;

        try {
            parsed = JSON.parse(jsonMatch[0]);
        } catch {
            return NextResponse.json(
                { error: "Parsing JSON fallito", raw },
                { status: 500 }
            );
        }

        return NextResponse.json({
            parsed,
        });
    }