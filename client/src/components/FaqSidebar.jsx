import { useEffect, useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    SlidersHorizontal,
} from "lucide-react";

import {
    getCategories,
    getSubcategories,
    getTopics,
} from "../services/api";

function extractList(result, key) {
    if (Array.isArray(result?.data)) {
        return result.data;
    }

    if (Array.isArray(result?.data?.[key])) {
        return result.data[key];
    }

    return [];
}

function formatSlug(slug = "") {
    return slug
        .split("-")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}

export default function FaqSidebar({
    categorySlug,
    selectedSubcategorySlug,
    selectedTopicSlug,
    onSelectTopic,
}) {
    const [categoryName, setCategoryName] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [topics, setTopics] = useState([]);

    const [openSubcategorySlug, setOpenSubcategorySlug] =
        useState(null);

    const [isMobileOpen, setIsMobileOpen] =
        useState(false);

    const [loading, setLoading] = useState(true);
    const [loadingTopics, setLoadingTopics] =
        useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCategorySidebar() {
            try {
                setLoading(true);
                setError("");
                setSubcategories([]);
                setTopics([]);
                setOpenSubcategorySlug(null);
                setIsMobileOpen(false);

                const [categoryResult, subcategoryResult] =
                    await Promise.all([
                        getCategories(),
                        getSubcategories(categorySlug),
                    ]);

                const categoryList = extractList(
                    categoryResult,
                    "categories"
                );

                const subcategoryList = extractList(
                    subcategoryResult,
                    "subcategories"
                );

                const activeCategory = categoryList.find(
                    (category) =>
                        category.slug === categorySlug
                );

                setCategoryName(
                    activeCategory?.name ??
                    formatSlug(categorySlug)
                );

                setSubcategories(subcategoryList);
            } catch (err) {
                setError(
                    err.message ||
                    "Gagal mengambil subkategori."
                );
            } finally {
                setLoading(false);
            }
        }

        if (categorySlug) {
            loadCategorySidebar();
        }
    }, [categorySlug]);

    useEffect(() => {
        if (
            !selectedSubcategorySlug ||
            subcategories.length === 0
        ) {
            return;
        }

        const subcategoryExists = subcategories.some(
            (subcategory) =>
                subcategory.slug ===
                selectedSubcategorySlug
        );

        if (!subcategoryExists) {
            return;
        }

        let ignoreResult = false;

        async function openSelectedSubcategory() {
            try {
                setLoadingTopics(true);
                setError("");
                setOpenSubcategorySlug(
                    selectedSubcategorySlug
                );

                const result = await getTopics(
                    selectedSubcategorySlug
                );

                if (!ignoreResult) {
                    setTopics(
                        extractList(result, "topics")
                    );
                }
            } catch (err) {
                if (!ignoreResult) {
                    setError(
                        err.message ||
                        "Gagal mengambil topik."
                    );
                }
            } finally {
                if (!ignoreResult) {
                    setLoadingTopics(false);
                }
            }
        }

        openSelectedSubcategory();

        return () => {
            ignoreResult = true;
        };
    }, [selectedSubcategorySlug, subcategories]);

    async function handleSubcategoryClick(subcategory) {
        if (
            openSubcategorySlug === subcategory.slug
        ) {
            setOpenSubcategorySlug(null);
            setTopics([]);
            return;
        }

        try {
            setLoadingTopics(true);
            setError("");
            setTopics([]);
            setOpenSubcategorySlug(subcategory.slug);

            const result = await getTopics(
                subcategory.slug
            );

            setTopics(extractList(result, "topics"));
        } catch (err) {
            setError(
                err.message || "Gagal mengambil topik."
            );
        } finally {
            setLoadingTopics(false);
        }
    }

    function handleTopicClick(topic) {
        onSelectTopic(topic);
        setIsMobileOpen(false);
    }

    return (
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <SlidersHorizontal
                        size={19}
                        className="shrink-0 text-blue-600"
                    />

                    <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                        {categoryName || "Kategori FAQ"}
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setIsMobileOpen(
                            (current) => !current
                        )
                    }
                    aria-expanded={isMobileOpen}
                    aria-label={
                        isMobileOpen
                            ? "Tutup kategori FAQ"
                            : "Buka kategori FAQ"
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
                >
                    <ChevronDown
                        size={19}
                        className={`transition-transform ${isMobileOpen
                            ? "rotate-180"
                            : ""
                            }`}
                    />
                </button>
            </div>

            <div
                className={`mt-4 ${isMobileOpen ? "block" : "hidden"
                    } lg:block`}
            >
                {loading ? (
                    <p className="text-sm text-slate-500">
                        Memuat subkategori...
                    </p>
                ) : subcategories.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        Belum ada subkategori.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {subcategories.map(
                            (subcategory) => {
                                const isOpen =
                                    openSubcategorySlug ===
                                    subcategory.slug;

                                return (
                                    <div
                                        key={subcategory.id}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSubcategoryClick(
                                                    subcategory
                                                )
                                            }
                                            className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${isOpen
                                                ? "bg-blue-50 font-semibold text-blue-700"
                                                : "font-medium text-slate-700 hover:bg-slate-50"
                                                }`}
                                        >
                                            <span className="min-w-0 break-words">
                                                {
                                                    subcategory.name
                                                }
                                            </span>

                                            {isOpen ? (
                                                <ChevronDown
                                                    size={17}
                                                    className="shrink-0"
                                                />
                                            ) : (
                                                <ChevronRight
                                                    size={17}
                                                    className="shrink-0"
                                                />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="ml-3 mt-1 space-y-1 border-l border-slate-200 py-2 pl-3">
                                                {loadingTopics ? (
                                                    <p className="px-3 py-2 text-xs text-slate-500">
                                                        Memuat
                                                        topik...
                                                    </p>
                                                ) : topics.length ===
                                                    0 ? (
                                                    <p className="px-3 py-2 text-xs text-slate-500">
                                                        Belum ada
                                                        topik.
                                                    </p>
                                                ) : (
                                                    topics.map(
                                                        (
                                                            topic
                                                        ) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    topic.id
                                                                }
                                                                onClick={() =>
                                                                    handleTopicClick(
                                                                        topic
                                                                    )
                                                                }
                                                                className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${selectedTopicSlug ===
                                                                    topic.slug
                                                                    ? "bg-blue-600 font-medium text-white"
                                                                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                                                    }`}
                                                            >
                                                                {
                                                                    topic.name
                                                                }
                                                            </button>
                                                        )
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

                {error && (
                    <p className="mt-3 break-words rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>
        </aside>
    );
}
