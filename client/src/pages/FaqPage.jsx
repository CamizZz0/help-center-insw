import { useEffect, useState } from "react";
import { getFaqs } from "../services/api";
import FaqAccordion from "../components/FaqAccordion";

export default function FaqPage() {
    const [faqs, setFaqs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [openFaqId, setOpenFaqId] = useState(null);

    function handleToggle(faqId) {
        setOpenFaqId((currentId) =>
            currentId === faqId ? null : faqId
        );
    }

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
                    <FaqAccordion
                        key={faq.id}
                        faq={faq}
                        isOpen={openFaqId === faq.id}
                        onToggle={() => handleToggle(faq.id)}
                    />
                ))}
            </div>
        </main>
    );
}