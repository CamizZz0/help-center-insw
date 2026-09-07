import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getFaqs } from "../services/api";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Breadcrumb from "../components/layout/Breadcrumb";
import HeroSearch from "../components/HeroSearch";
import FaqAccordion from "../components/FaqAccordion";
import Pagination from "../components/Pagination";

export default function SearchResultsPage() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const query = searchParams.get("q")?.trim() ?? "";

    const page = Math.max(
        Number(searchParams.get("page")) || 1,
        1
    );

    const [faqs, setFaqs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [openFaqId, setOpenFaqId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadResults() {
            if (!query) {
                setFaqs([]);
                setMeta(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                setOpenFaqId(null);

                const result = await getFaqs({
                    search: query,
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

        loadResults();
    }, [query, page]);

    function handleToggle(faqId) {
        setOpenFaqId((currentId) =>
            currentId === faqId ? null : faqId
        );
    }

    function handlePageChange(nextPage) {
        setSearchParams({
            q: query,
            page: String(nextPage),
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <>
            <Header />

            <Breadcrumb categoryName="Hasil Pencarian" />

            <section className="bg-[#EFF7FF]">
                <div className="mx-auto max-w-7xl px-6 py-14 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                        Hasil Pencarian
                    </h1>

                    <HeroSearch initialValue={query} />
                </div>
            </section>

            <main className="min-h-screen bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <p className="text-slate-600">
                        {meta?.totalItems ?? 0} hasil untuk{" "}
                        <strong>“{query}”</strong>
                    </p>

                    {loading ? (
                        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8">
                            Memuat hasil pencarian...
                        </div>
                    ) : error ? (
                        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    ) : faqs.length === 0 ? (
                        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-10 text-center">
                            <h2 className="font-semibold text-slate-900">
                                FAQ tidak ditemukan
                            </h2>

                            <p className="mt-2 text-slate-600">
                                Coba gunakan kata kunci yang lebih umum.
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
                </div>
            </main>

            <Footer />
        </>
    );
}