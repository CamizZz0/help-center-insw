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

export default function FaqSidebar({
    selectedTopicSlug,
    onSelectTopic,
}) {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [topics, setTopics] = useState([]);

    const [openCategorySlug, setOpenCategorySlug] =
        useState(null);

    const [openSubcategorySlug, setOpenSubcategorySlug] =
        useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoading(true);
                setError("");

                const result = await getCategories();
                setCategories(extractList(result, "categories"));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);

    async function handleCategoryClick(category) {
        if (openCategorySlug === category.slug) {
            setOpenCategorySlug(null);
            setOpenSubcategorySlug(null);
            setSubcategories([]);
            setTopics([]);
            return;
        }

        try {
            setLoading(true);
            setError("");

            setOpenCategorySlug(category.slug);
            setOpenSubcategorySlug(null);
            setSubcategories([]);
            setTopics([]);

            const result = await getSubcategories(category.slug);

            setSubcategories(
                extractList(result, "subcategories")
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubcategoryClick(subcategory) {
        if (openSubcategorySlug === subcategory.slug) {
            setOpenSubcategorySlug(null);
            setTopics([]);
            return;
        }

        try {
            setLoading(true);
            setError("");

            setOpenSubcategorySlug(subcategory.slug);
            setTopics([]);

            const result = await getTopics(subcategory.slug);

            setTopics(extractList(result, "topics"));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-4 font-bold text-slate-900">
                Kategori FAQ
            </h2>

            <div className="space-y-2">
                {categories.map((category) => {
                    const isCategoryOpen =
                        openCategorySlug === category.slug;

                    return (
                        <div key={category.id}>
                            <button
                                type="button"
                                onClick={() =>
                                    handleCategoryClick(category)
                                }
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left font-semibold ${isCategoryOpen
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-800 hover:bg-slate-50"
                                    }`}
                            >
                                <span>{category.name}</span>
                                <span>{isCategoryOpen ? "⌃" : "⌄"}</span>
                            </button>

                            {isCategoryOpen && (
                                <div className="ml-3 mt-2 border-l border-slate-200 pl-3">
                                    {loading &&
                                        subcategories.length === 0 ? (
                                        <p className="px-3 py-2 text-sm text-slate-500">
                                            Memuat subkategori...
                                        </p>
                                    ) : subcategories.length === 0 ? (
                                        <p className="px-3 py-2 text-sm text-slate-500">
                                            Belum ada subkategori
                                        </p>
                                    ) : (
                                        subcategories.map((subcategory) => {
                                            const isSubcategoryOpen =
                                                openSubcategorySlug ===
                                                subcategory.slug;

                                            return (
                                                <div key={subcategory.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSubcategoryClick(
                                                                subcategory
                                                            )
                                                        }
                                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${isSubcategoryOpen
                                                                ? "bg-blue-50 font-semibold text-blue-700"
                                                                : "text-slate-700 hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        <span>
                                                            {subcategory.name}
                                                        </span>

                                                        <span>
                                                            {isSubcategoryOpen
                                                                ? "⌃"
                                                                : "›"}
                                                        </span>
                                                    </button>

                                                    {isSubcategoryOpen && (
                                                        <div className="ml-4 space-y-1 py-2">
                                                            {loading &&
                                                                topics.length === 0 ? (
                                                                <p className="px-3 py-2 text-xs text-slate-500">
                                                                    Memuat topik...
                                                                </p>
                                                            ) : topics.length === 0 ? (
                                                                <p className="px-3 py-2 text-xs text-slate-500">
                                                                    Belum ada topik
                                                                </p>
                                                            ) : (
                                                                topics.map((topic) => (
                                                                    <button
                                                                        type="button"
                                                                        key={topic.id}
                                                                        onClick={() =>
                                                                            onSelectTopic(topic)
                                                                        }
                                                                        className={`block w-full rounded-md px-3 py-2 text-left text-sm ${selectedTopicSlug ===
                                                                                topic.slug
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
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {error && (
                <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}
        </aside>
    );
}