import {
    useEffect,
    useState,
} from "react";

import { Search } from "lucide-react";

import {
    Link,
    useSearchParams,
} from "react-router-dom";

import {
    searchHelpCenter,
} from "../services/api";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Breadcrumb from "../components/layout/Breadcrumb";
import HeroSearch from "../components/HeroSearch";
import Pagination from "../components/Pagination";

import SearchResultCard from "../components/search/SearchResultCard";

const ITEMS_PER_PAGE = 6;

function getValidPage(value) {
    const page = Number(value);

    if (
        !Number.isInteger(page) ||
        page < 1
    ) {
        return 1;
    }

    return page;
}

export default function SearchResultsPage() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const query =
        searchParams
            .get("q")
            ?.trim() ?? "";

    const page = getValidPage(
        searchParams.get("page"),
    );

    const [items, setItems] =
        useState([]);

    const [meta, setMeta] =
        useState(null);

    const [loading, setLoading] =
        useState(Boolean(query));

    const [error, setError] =
        useState("");

    const [openFaqId, setOpenFaqId] =
        useState(null);

    const [refreshKey, setRefreshKey] =
        useState(0);

    useEffect(() => {
        if (!query) {
            return;
        }

        let active = true;

        async function loadResults() {
            try {
                setLoading(true);
                setError("");
                setOpenFaqId(null);

                const result =
                    await searchHelpCenter(
                        query,
                        {
                            page,
                            limit:
                                ITEMS_PER_PAGE,
                        },
                    );

                if (!active) return;

                const resultItems =
                    Array.isArray(
                        result.data
                            ?.results,
                    )
                        ? result.data
                              .results
                        : [
                              ...(
                                  result.data
                                      ?.faqs ??
                                  []
                              ).map(
                                  (
                                      item,
                                  ) => ({
                                      ...item,
                                      resultType:
                                          "faq",
                                  }),
                              ),

                              ...(
                                  result.data
                                      ?.guides ??
                                  []
                              ).map(
                                  (
                                      item,
                                  ) => ({
                                      ...item,
                                      resultType:
                                          "guide",
                                  }),
                              ),

                              ...(
                                  result.data
                                      ?.tutorials ??
                                  []
                              ).map(
                                  (
                                      item,
                                  ) => ({
                                      ...item,
                                      resultType:
                                          "tutorial",
                                  }),
                              ),
                          ];

                setItems(resultItems);
                setMeta(
                    result.meta ??
                        null,
                );
            } catch (err) {
                if (active) {
                    setError(
                        err.message,
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadResults();

        return () => {
            active = false;
        };
    }, [
        query,
        page,
        refreshKey,
    ]);

    function handleToggle(faqId) {
        setOpenFaqId(
            (currentId) =>
                currentId === faqId
                    ? null
                    : faqId,
        );
    }

    function handlePageChange(
        nextPage,
    ) {
        const nextParams =
            new URLSearchParams(
                searchParams,
            );

        nextParams.set("q", query);

        if (nextPage <= 1) {
            nextParams.delete("page");
        } else {
            nextParams.set(
                "page",
                String(nextPage),
            );
        }

        setSearchParams(nextParams);
        setOpenFaqId(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function retry() {
        setError("");
        setLoading(true);

        setRefreshKey(
            (value) => value + 1,
        );
    }

    const visibleMeta = query
        ? meta
        : null;

    const visibleError = query
        ? error
        : "";

    const isLoading = query
        ? loading
        : false;

    const totalItems =
        visibleMeta?.totalItems ?? 0;

    const totalPages =
        visibleMeta?.totalPages ?? 1;

    return (
        <>
            <Header />

            <Breadcrumb
                categoryName="Hasil Pencarian"
            />

            <section className="bg-[#EFF7FF] py-12 sm:py-16">
                <div
                    className="mx-auto w-full px-4 text-center sm:px-6 lg:px-8"
                    style={{
                        maxWidth: "72rem",
                    }}
                >
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Hasil Pencarian
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                        Temukan FAQ,
                        panduan, dan
                        tutorial yang sesuai
                        dengan kebutuhan
                        Anda.
                    </p>

                    <HeroSearch
                        initialValue={query}
                    />
                </div>
            </section>

            <main className="min-h-screen bg-slate-50">
                <div
                    className="mx-auto w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
                    style={{
                        maxWidth: "72rem",
                    }}
                >
                    {isLoading ? (
                        <SearchLoadingSkeleton />
                    ) : visibleError ? (
                        <SearchError
                            error={visibleError}
                            onRetry={retry}
                        />
                    ) : totalItems === 0 ? (
                        <EmptyState
                            query={query}
                        />
                    ) : (
                        <>
                            <div className="mb-7">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Hasil pencarian
                                    untuk “
                                    {query}”
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    {
                                        totalItems
                                    }{" "}
                                    konten
                                    ditemukan
                                </p>
                            </div>

                            <div className="space-y-5">
                                {items.map(
                                    (
                                        item,
                                    ) => (
                                        <SearchResultCard
                                            key={`${item.resultType}-${item.id}`}
                                            item={
                                                item
                                            }
                                            query={
                                                query
                                            }
                                            isOpen={
                                                item.resultType ===
                                                    "faq" &&
                                                openFaqId ===
                                                    item.id
                                            }
                                            onToggle={
                                                item.resultType ===
                                                "faq"
                                                    ? () =>
                                                          handleToggle(
                                                              item.id,
                                                          )
                                                    : undefined
                                            }
                                        />
                                    ),
                                )}
                            </div>

                            <Pagination
                                currentPage={
                                    visibleMeta?.page ??
                                    page
                                }
                                totalPages={Math.max(
                                    totalPages,
                                    1,
                                )}
                                onPageChange={
                                    handlePageChange
                                }
                                alwaysShow
                                ariaLabel="Pagination hasil pencarian"
                            />
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

function SearchError({
    error,
    onRetry,
}) {
    return (
        <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6 sm:p-8"
        >
            <h2 className="text-lg font-semibold text-red-800">
                Pencarian gagal
                dimuat
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-700">
                {error}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
                Coba Lagi
            </button>
        </div>
    );
}

function EmptyState({ query }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Search
                    size={30}
                    aria-hidden="true"
                />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
                Tidak ada hasil
                ditemukan
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Tidak ditemukan FAQ,
                panduan, atau tutorial
                untuk kata kunci “
                {query}”.
                <br />
                Coba gunakan kata kunci
                yang lebih umum.
            </p>

            <Link
                to="/"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#062E6F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
                Kembali ke Beranda
            </Link>
        </div>
    );
}

function SearchLoadingSkeleton() {
    return (
        <div
            className="animate-pulse"
            aria-label="Mencari konten bantuan"
            role="status"
        >
            <div className="mb-7">
                <div className="h-7 w-72 max-w-full rounded bg-slate-200" />
                <div className="mt-3 h-4 w-36 rounded bg-slate-200" />
            </div>

            <div className="space-y-5">
                {[1, 2, 3].map(
                    (item) => (
                        <div
                            key={item}
                            className="rounded-xl border border-slate-200 bg-white p-6"
                        >
                            <div className="h-4 w-32 rounded bg-slate-200" />
                            <div className="mt-4 h-5 w-2/3 rounded bg-slate-200" />
                            <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                            <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
                        </div>
                    ),
                )}
            </div>
        </div>
    );
}
