import { useEffect, useState } from "react";
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
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
}

export default function FaqSidebar({
    categorySlug,
    selectedTopicSlug,
    onSelectTopic,
}) {
    const [categoryName, setCategoryName] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [topics, setTopics] = useState([]);

    const [openSubcategorySlug, setOpenSubcategorySlug] =
        useState(null);

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
                    (category) => category.slug === categorySlug
                );

                setCategoryName(
                    activeCategory?.name ?? formatSlug(categorySlug)
                );

                setSubcategories(subcategoryList);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (categorySlug) {
            loadCategorySidebar();
        }
    }, [categorySlug]);

    async function handleSubcategoryClick(subcategory) {
        if (openSubcategorySlug === subcategory.slug) {
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
            setError(err.message);
        } finally {
            setLoadingTopics(false);
        }
    }

    return (
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
                {categoryName || "Kategori FAQ"}
            </h2>

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
                    {subcategories.map((subcategory) => {
                        const isOpen =
                            openSubcategorySlug === subcategory.slug;

                        return (
                            <div key={subcategory.id}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSubcategoryClick(subcategory)
                                    }
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm ${isOpen
                                            ? "bg-blue-50 font-semibold text-blue-700"
                                            : "font-medium text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    <span>{subcategory.name}</span>
                                    <span>{isOpen ? "⌃" : "›"}</span>
                                </button>

                                {isOpen && (
                                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 py-2 pl-3">
                                        {loadingTopics ? (
                                            <p className="px-3 py-2 text-xs text-slate-500">
                                                Memuat topik...
                                            </p>
                                        ) : topics.length === 0 ? (
                                            <p className="px-3 py-2 text-xs text-slate-500">
                                                Belum ada topik.
                                            </p>
                                        ) : (
                                            topics.map((topic) => (
                                                <button
                                                    type="button"
                                                    key={topic.id}
                                                    onClick={() =>
                                                        onSelectTopic(topic)
                                                    }
                                                    className={`block w-full rounded-md px-3 py-2 text-left text-sm ${selectedTopicSlug === topic.slug
                                                            ? "bg-blue-600 font-medium text-white"
                                                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                                        }`}
                                                >
                                                    {topic.name}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {error && (
                <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}
        </aside>
    );
}