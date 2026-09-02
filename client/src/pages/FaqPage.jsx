import { useEffect, useState } from "react";
import { getFaqs } from "../services/api";

export default function FaqPage() {
    const [faqs, setFaqs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadFaqs() {
            try {
                setLoading(true);

                const result = await getFaqs({
                    page: 1,
                    limit: 6,
                });

                setFaqs(result.data);
                setMeta(result.meta);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadFaqs();
    }, []);

    if (loading) {
        return <p className="p-8">Memuat FAQ...</p>;
    }

    if (error) {
        return <p className="p-8 text-red-600">{error}</p>;
    }

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <h1 className="text-3xl font-bold text-slate-900">
                FAQ PIB
            </h1>

            <p className="mt-2 text-slate-600">
                Total FAQ: {meta?.totalItems ?? 0}
            </p>

            <div className="mt-8 space-y-4">
                {faqs.map((faq) => (
                    <article
                        key={faq.id}
                        className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                        <p className="text-sm text-blue-600">
                            {faq.category.name} • {faq.subcategory.name} •{" "}
                            {faq.topic.name}
                        </p>

                        <h2 className="mt-2 font-semibold text-slate-900">
                            {faq.question}
                        </h2>
                    </article>
                ))}
            </div>
        </main>
    );
}