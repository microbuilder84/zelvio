import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        docId: string;
    };
}

export default async function PreventivoPage({ params }: PageProps) {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from("preventivi")
        .select("contenuto")
        .eq("doc_id", params.docId)
        .single();

    if (error || !data) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <h2>Preventivo non disponibile.</h2>
                <a href="/wizard">
                    <button>Nuovo Preventivo</button>
                </a>
            </div>
        );
    }

    const documento = JSON.parse(data.contenuto);

    return (
        <div style={{ padding: 40 }}>
            <h1>{documento.titolo}</h1>
            <pre>{JSON.stringify(documento, null, 2)}</pre>
        </div>
    );
}