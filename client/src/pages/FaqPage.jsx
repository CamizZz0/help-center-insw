import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getFaqs,
    getTopicFaqs,
} from "../services/api";

import FaqAccordion from "../components/FaqAccordion";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import FaqSidebar from "../components/FaqSidebar";
import HelpCard from "../components/HelpCard";

import Header from "../components/layout/Header";
import Breadcrumb from "../components/layout/Breadcrumb";
import CategoryHero from "../components/layout/CategoryHero";
import Footer from "../components/layout/Footer";

const CATEGORY_NAMES = {
    "impor-kepabeanan": "Impor & Kepabeanan",
    ekspor: "Ekspor",
    "registrasi-akun": "Registrasi & Akun",
    "portal-insw": "Portal INSW",
    "perizinan-rekomendasi": "Perizinan & Rekomendasi",
    "fasilitas-kawasan": "Fasilitas & Kawasan",
    "layanan-lainnya": "Layanan Lainnya",
};

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

    const categoryName =
        CATEGORY_NAMES[categorySlug] ?? "Kategori FAQ";

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
                    result = await getTopicFaqs(
                        selectedTopic.slug,
                        {
                            page,
                            limit: 6,
                        }
                    );
                } else {
                    result = await getFaqs({
                        page,
                        limit: 6,
                    });
                }

                setFaqs(
                    Array.isArray(result?.data)
                        ? result.data
                        : []
                );

                setMeta(result?.meta ?? null);
            } catch (err) {
                setError(
                    err.message || "Gagal mengambil data FAQ."
                );
            } finally {
                setLoading(false);
            }
        }

        loadFaqs();
    }, [page, search, selectedTopic?.slug]);

    return (
        <>
            <Header />

            <Breadcrumb categoryName={categoryName} />

            <CategoryHero categoryName={categoryName} />

            <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
                        <div className="min-w-0">
                            <SearchBar
                                value={searchInput}
                                onChange={setSearchInput}
                                onClear={() =>
                                    setSearchInput("")
                                }
                                placeholder={`Cari pertanyaan ${categoryName}...`}
                            />

                            <div className="mt-4">
                                <FaqSidebar
                                    categorySlug={categorySlug}
                                    selectedTopicSlug={
                                        selectedTopic?.slug
                                    }
                                    onSelectTopic={
                                        handleSelectTopic
                                    }
                                />
                            </div>
                        </div>

                        <section className="min-w-0">
                            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                {search
                                    ? "Hasil Pencarian"
                                    : selectedTopic?.name ??
                                    "Semua FAQ"}
                            </h1>

                            <p className="mt-2 text-sm text-slate-600 sm:text-base">
                                {search
                                    ? `${meta?.totalItems ?? 0
                                    } hasil untuk “${search}”`
                                    : `Total FAQ: ${meta?.totalItems ?? 0
                                    }`}
                            </p>

                            {loading ? (
                                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:mt-8 sm:p-8">
                                    <p className="text-sm text-slate-600 sm:text-base">
                                        Memuat FAQ...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 sm:mt-8 sm:p-8">
                                    <p className="break-words text-sm text-red-600 sm:text-base">
                                        {error}
                                    </p>
                                </div>
                            ) : faqs.length === 0 ? (
                                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-center sm:mt-8 sm:p-8">
                                    <h2 className="font-semibold text-slate-900">
                                        FAQ tidak ditemukan
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-600 sm:text-base">
                                        Coba pilih topik atau kata
                                        kunci lain.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                                    {faqs.map((faq) => (
                                        <FaqAccordion
                                            key={faq.id}
                                            faq={faq}
                                            isOpen={
                                                openFaqId === faq.id
                                            }
                                            onToggle={() =>
                                                handleToggle(faq.id)
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {!loading && meta && (
                                <Pagination
                                    currentPage={meta.page}
                                    totalPages={meta.totalPages}
                                    onPageChange={
                                        handlePageChange
                                    }
                                />
                            )}
                        </section>
                    </div>

                    <div className="mt-8 sm:mt-12">
                        <HelpCard />
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}