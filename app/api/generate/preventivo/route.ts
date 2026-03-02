import { NextRequest, NextResponse } from "next/server";

// usa la stessa cache globale
type DocEntry = { output: string; createdAt: number; expiresAt: number };

const gg = globalThis as unknown as { __zelvio_docs__?: Map<string, DocEntry> };
gg.__zelvio_docs__ ??= new Map();
const DOCS = gg.__zelvio_docs__!;

function cleanupDocs() {
    const now = Date.now();
    for (const [k, v] of DOCS.entries()) {
        if (now > v.expiresAt) DOCS.delete(k);
    }
}

export async function GET(req: NextRequest) {
    cleanupDocs();

    const id = req.nextUrl.searchParams.get("id")?.trim();

    if (!id) {
        return NextResponse.json(
            { error: "Parametro id mancante." },
            { status: 400 }
        );
    }

    const entry = DOCS.get(id);

    if (!entry) {
        return NextResponse.json(
            { error: "Preventivo non trovato o scaduto. Rigenera dal wizard." },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { output: entry.output },
        { status: 200 }
    );
}