export default async function Page({ params }: any) {
    return (
        <div style={{ padding: 40 }}>
            <h1>DocId ricevuto:</h1>
            <pre>{params.docId}</pre>
        </div>
    );
}