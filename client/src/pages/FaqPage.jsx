import { useEffect, useState } from "react";
import { getFaqs } from "../services/api";
import FaqAccordion from "../components/FaqAccordion";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";

export default function FaqPage() {
    const [faqs, setFaqs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [openFaqId, setOpenFaqId] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    function handleToggle(faqId) {
        setOpenFaqId((currentId) =>
            currentId === faqId ? null : faqId
        );
    }

    function handlePageChange(nextPage) {
        setPage(nextPage);
        setOpenFaqId(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
            setOpenFaqId(null);
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    useEffect(() => {
        async function loadFaqs() {
            try {
                setLoading(true);
                setError("");

                const result = await getFaqs({
                    search,
                    page,
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
    }, [page, search]);

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

            <SearchBar
                value={searchInput}
                onChange={setSearchInput}
                onClear={() => setSearchInput("")}
            />

            {faqs.length === 0 ? (
                <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <h2 className="font-semibold text-slate-900">
                        FAQ tidak ditemukan
                    </h2>
                    <p className="mt-2 text-slate-600">
                        Coba gunakan kata kunci yang berbeda.
                    </p>
                </div>
            ) : (
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
            )}

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

            {meta && (
                <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </main>
    );
}