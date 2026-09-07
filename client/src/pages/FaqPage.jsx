import { useEffect, useState } from "react";
import {
    getFaqs,
    getTopicFaqs,
} from "../services/api";

import FaqAccordion from "../components/FaqAccordion";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import FaqSidebar from "../components/FaqSidebar";
import { useParams } from "react-router-dom";

export default function FaqPage() {
    const [faqs, setFaqs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [openFaqId, setOpenFaqId] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const { categorySlug } = useParams();

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

    function handleSelectTopic(topic) {
        setSelectedTopic(topic);
        setPage(1);
        setOpenFaqId(null);
        setSearchInput("");
        setSearch("");
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

                let result;

                if (search) {
                    result = await getFaqs({
                        search,
                        page,
                        limit: 6,
                    });
                } else if (selectedTopic) {
                    result = await getTopicFaqs(selectedTopic.slug, {
                        page,
                        limit: 6,
                    });
                } else {
                    result = await getFaqs({
                        page,
                        limit: 6,
                    });
                }

                setFaqs(result.data);
                setMeta(result.meta);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadFaqs();
    }, [page, search, selectedTopic?.slug]);

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
                    <div>
                        <SearchBar
                            value={searchInput}
                            onChange={setSearchInput}
                            onClear={() => setSearchInput("")}
                        />

                        <div className="mt-4">
                            <FaqSidebar
                                categorySlug={categorySlug}
                                selectedTopicSlug={selectedTopic?.slug}
                                onSelectTopic={handleSelectTopic}
                            />
                        </div>
                    </div>

                    <section>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {search
                                ? "Hasil Pencarian"
                                : selectedTopic?.name ?? "Semua FAQ"}
                        </h1>

                        <p className="mt-2 text-slate-600">
                            {search
                                ? `${meta?.totalItems ?? 0} hasil untuk “${search}”`
                                : `Total FAQ: ${meta?.totalItems ?? 0}`}
                        </p>

                        {loading ? (
                            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8">
                                <p className="text-slate-600">
                                    Memuat FAQ...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8">
                                <p className="text-red-600">{error}</p>
                            </div>
                        ) : faqs.length === 0 ? (
                            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
                                <h2 className="font-semibold text-slate-900">
                                    FAQ tidak ditemukan
                                </h2>

                                <p className="mt-2 text-slate-600">
                                    Coba pilih topik atau kata kunci lain.
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

                        {!loading && meta && (
                            <Pagination
                                currentPage={meta.page}
                                totalPages={meta.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}