import { NextRequest, NextResponse } from "next/server";

/* stessa cache globale usata in /api/generate */
type DocEntry = {
    document: any;
    createdAt: number;
    expiresAt: number;
};

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
    const requestId = req.headers.get("x-request-id") || crypto.randomUUID();

    cleanupDocs();

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

    const entry = DOCS.get(id);

    if (!entry) {
        return NextResponse.json(
            { error: "Preventivo non trovato o scaduto. Rigenera dal wizard." },
            {
                status: 404,
                headers: {
                    "cache-control": "no-store",
                    "x-request-id": requestId,
                },
            }
        );
    }

    return NextResponse.json(
        { document: entry.document },
        {
            status: 200,
            headers: {
                "cache-control": "no-store",
                "x-request-id": requestId,
                "x-doc-expires-at": String(entry.expiresAt),
            },
        }
    );
}