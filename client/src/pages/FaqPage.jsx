import { useEffect, useState } from "react";
import {
    useParams,
    useSearchParams,
} from "react-router-dom";

import {
    getFaqs,
    getSubcategories,
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

function extractFaqList(result) {
    const possibleLists = [
        result?.data,
        result?.data?.faqs,
        result?.data?.items,
        result?.faqs,
        result?.items,
    ];

    return (
        possibleLists.find((value) =>
            Array.isArray(value)
        ) ?? []
    );
}

export default function FaqPage() {
    const { categorySlug } = useParams();
    const [searchParams] = useSearchParams();
    const topicSlug = searchParams.get("topic") ?? "";

    return (
        <CategoryFaqContent
            key={JSON.stringify([categorySlug, topicSlug])}
            categorySlug={categorySlug}
        />
    );
}

function CategoryFaqContent({ categorySlug }) {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const topicSlug = searchParams.get("topic");

    const [faqs, setFaqs] = useState([]);
    const [meta, setMeta] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [openFaqId, setOpenFaqId] =
        useState(null);

    const [
        selectedSubcategorySlug,
        setSelectedSubcategorySlug,
    ] = useState("");

    const [
        selectedTopicName,
        setSelectedTopicName,
    ] = useState("");

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] = useState("");

    const [categoryName, setCategoryName] = useState("");

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
        setSelectedTopicName(topic.name);

        setSearchParams({
            topic: topic.slug,
        });

        setPage(1);
        setOpenFaqId(null);
        setSearchInput("");
        setSearch("");
    }

    /*
     * Debounce pencarian selama 400 ms.
     */
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
            setOpenFaqId(null);
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    /*
     * Mengambil data FAQ.
     */
    useEffect(() => {
        let ignoreResult = false;

        async function loadFaqs() {
            try {
                setLoading(true);
                setError("");
                setMeta(null);

                const categoryResult = await getSubcategories(categorySlug);

                if (ignoreResult) return;

                const category = categoryResult?.data?.category;

                if (!category || category.slug !== categorySlug) {
                    throw new Error("Kategori FAQ tidak ditemukan.");
                }

                setCategoryName(category.name);

                let result;

                if (search) {
                    result = await getFaqs({
                        search,
                        category: categorySlug,
                        page,
                        limit: 6,
                    });
                } else if (topicSlug) {
                    result = await getTopicFaqs(
                        topicSlug,
                        {
                            page,
                            limit: 6,
                        }
                    );
                } else {
                    result = await getFaqs({
                        category: categorySlug,
                        page,
                        limit: 6,
                    });
                }

                if (ignoreResult) {
                    return;
                }

                const faqList =
                    extractFaqList(result);

                if (
                    topicSlug && !search &&
                    result?.data?.category?.slug !== categorySlug
                ) {
                    throw new Error("Topik FAQ tidak ditemukan dalam kategori ini.");
                }

                setFaqs(faqList);
                setMeta(result?.meta ?? null);

                if (topicSlug && !search) {
                    const activeSubcategorySlug =
                        result?.data?.subcategory?.slug ??
                        faqList[0]?.subcategory?.slug ??
                        "";

                    setSelectedSubcategorySlug(
                        activeSubcategorySlug
                    );
                }

                if (topicSlug && !search) {
                    setSelectedTopicName(result?.data?.topic?.name ?? "");
                }
            } catch (err) {
                if (!ignoreResult) {
                    setError(
                        err.message ||
                        "Gagal mengambil data FAQ."
                    );
                }
            } finally {
                if (!ignoreResult) {
                    setLoading(false);
                }
            }
        }

        loadFaqs();

        return () => {
            ignoreResult = true;
        };
    }, [
        categorySlug,
        page,
        search,
        topicSlug,
    ]);

    return (
        <>
            <Header />

            <Breadcrumb
                categoryName={categoryName || "Kategori FAQ"}
            />

            <CategoryHero
                categoryName={categoryName || "Kategori FAQ"}
            />

            <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
                        <div className="min-w-0">
                            <SearchBar
                                value={searchInput}
                                onChange={
                                    setSearchInput
                                }
                                onClear={() =>
                                    setSearchInput("")
                                }
                                placeholder={categoryName
                                    ? `Cari pertanyaan ${categoryName}...`
                                    : "Cari pertanyaan dalam kategori ini..."}
                            />

                            <div className="mt-4">
                                <FaqSidebar
                                    categorySlug={
                                        categorySlug
                                    }
                                    selectedTopicSlug={
                                        topicSlug
                                    }
                                    selectedSubcategorySlug={
                                        selectedSubcategorySlug
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
                                    : selectedTopicName ||
                                    (categoryName ? `FAQ ${categoryName}` : "FAQ Kategori")}
                            </h1>

                            <p className="mt-2 text-sm text-slate-600 sm:text-base">
                                {search
                                    ? `${meta?.totalItems ??
                                    0
                                    } hasil untuk “${search}”`
                                    : `Total FAQ: ${meta?.totalItems ??
                                    0
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
                            ) : faqs.length ===
                                0 ? (
                                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-center sm:mt-8 sm:p-8">
                                    <h2 className="font-semibold text-slate-900">
                                        FAQ tidak
                                        ditemukan
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-600 sm:text-base">
                                        Coba pilih topik
                                        atau kata kunci
                                        lain.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                                    {faqs.map(
                                        (faq) => (
                                            <FaqAccordion
                                                key={
                                                    faq.id
                                                }
                                                faq={
                                                    faq
                                                }
                                                isOpen={
                                                    openFaqId ===
                                                    faq.id
                                                }
                                                onToggle={() =>
                                                    handleToggle(
                                                        faq.id
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}

                            {!loading && meta && (
                                <Pagination
                                    currentPage={
                                        meta.page
                                    }
                                    totalPages={
                                        meta.totalPages
                                    }
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
