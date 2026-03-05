import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ================= SUPABASE ================= */

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    const requestId = req.headers.get("x-request-id") || crypto.randomUUID();

    const id = req.nextUrl.searchParams.get("id")?.trim();

    if (!id || id.length < 4 || id.length > 32) {
        return NextResponse.json(
            { error: "Parametro id non valido." },
            {
                status: 400,
                headers: {
                    "cache-control": "no-store",
                    "x-request-id": requestId,
                },
            }
        );
    }

    try {
        /* ================= QUERY DB ================= */

        const { data, error } = await supabase
            .from("preventivi")
            .select("contenuto, expires_at")
            .eq("doc_id", id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: "Preventivo non trovato." },
                {
                    status: 404,
                    headers: {
                        "cache-control": "no-store",
                        "x-request-id": requestId,
                    },
                }
            );
        }

        /* ================= CONTROLLO SCADENZA ================= */

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            return NextResponse.json(
                { error: "Preventivo scaduto." },
                {
                    status: 410,
                    headers: {
                        "cache-control": "no-store",
                        "x-request-id": requestId,
                    },
                }
            );
        }

        /* ================= PARSE JSON ================= */

        let documentJson;

        try {
            documentJson =
                typeof data.contenuto === "string"
                    ? JSON.parse(data.contenuto)
                    : data.contenuto;
        } catch {
            return NextResponse.json(
                { error: "Errore nel formato del documento salvato." },
                {
                    status: 500,
                    headers: {
                        "cache-control": "no-store",
                        "x-request-id": requestId,
                    },
                }
            );
        }

        return NextResponse.json(
            { document: documentJson },
            {
                status: 200,
                headers: {
                    "cache-control": "no-store",
                    "x-request-id": requestId,
                    "x-doc-expires-at": String(data.expires_at ?? ""),
                },
            }
        );
    } catch (err) {
        console.error("Errore lettura preventivo:", err);

        return NextResponse.json(
            { error: "Errore interno." },
            {
                status: 500,
                headers: {
                    "cache-control": "no-store",
                    "x-request-id": requestId,
                },
            }
        );
    }
}