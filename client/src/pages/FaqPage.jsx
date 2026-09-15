import { useEffect, useRef, useState } from "react";
import {
    useParams,
    useSearchParams,
} from "react-router-dom";

import { Lock } from "lucide-react";

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
import RoleSimulator from "../components/RoleSimulator";
import Toast from "../components/Toast";
import RestrictedModal from "../components/RestrictedModal";

import {
    normalizeViewerRole,
    roleToastMessage,
    useViewerRole,
} from "../utils/viewerRole";

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

    // SIMULASI DEMO (bukan login). TODO(auth): ganti dengan sesi pengguna.
    const [viewerRole, setViewerRole] = useViewerRole();

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

    // Metadata demo dari backend: item terkunci (tanpa jawaban) + hitungan
    // visibilitas. TODO(auth): tetap tampilkan pola ini setelah login resmi.
    const [locked, setLocked] = useState([]);
    const [visibilityCounts, setVisibilityCounts] = useState(null);

    const [modalFaq, setModalFaq] = useState(null);
    const [toast, setToast] = useState({ key: 0, message: "" });

    // Muat awal vs refresh ganti role: refresh tidak menampilkan skeleton
    // agar scroll tetap pada posisi semula.
    const firstLoadRef = useRef(true);
    const prevRoleRef = useRef(viewerRole);

    function handleRoleChange(nextRole) {
        const normalized = normalizeViewerRole(nextRole);

        if (normalized === prevRoleRef.current) return;

        const unlocked =
            visibilityCounts?.authenticated ?? 0;

        prevRoleRef.current = normalized;
        setViewerRole(normalized);
        setToast((current) => ({
            key: current.key + 1,
            message: roleToastMessage(normalized, unlocked),
        }));
    }

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
                // Hanya muat awal yang memakai skeleton; ganti role
                // memperbarui diam-diam agar scroll tidak lompat.
                if (firstLoadRef.current) {
                    setLoading(true);
                }

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
                        limit: 10,
                        viewerRole,
                    });
                } else if (topicSlug) {
                    result = await getTopicFaqs(
                        topicSlug,
                        {
                            page,
                            limit: 10,
                            viewerRole,
                        }
                    );
                } else {
                    result = await getFaqs({
                        category: categorySlug,
                        page,
                        limit: 10,
                        viewerRole,
                    });
                }

                if (ignoreResult) {
                    return;
                }

                const faqList =
                    // JANGAN saring di sini: item non-visible tetap dirender
                    // sebagai kartu terkunci/"tidak tersedia" oleh
                    // FaqAccordion (gate SIMULASI). Backend sudah memfilter
                    // via ?viewerRole=; gate ini lapisan kedua.
                    // TODO(auth): andalkan filter backend saja.
                    extractFaqList(result);

                if (
                    topicSlug && !search &&
                    result?.data?.category?.slug !== categorySlug
                ) {
                    throw new Error("Topik FAQ tidak ditemukan dalam kategori ini.");
                }

                setFaqs(faqList);
                setMeta(result?.meta ?? null);

                // `locked` ada di result.data (mode topik) atau top-level
                // (mode kategori). Berisi metadata TANPA jawaban.
                setLocked(
                    Array.isArray(result?.data?.locked)
                        ? result.data.locked
                        : Array.isArray(result?.locked)
                            ? result.locked
                            : []
                );

                setVisibilityCounts(
                    result?.meta?.visibilityCounts ?? null
                );

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
                    firstLoadRef.current = false;
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
        viewerRole,
    ]);

    // Card terkunci untuk Guest: hanya item authenticated yang published.
    // Item draft disembunyikan total dari Guest (bukan sekadar dikunci).
    const guestLocked = locked.filter(
        (item) => item.visibility === "authenticated" && !item.isDraft
    );

    return (
        <>
            <Header />

            <RoleSimulator viewerRole={viewerRole} onChange={handleRoleChange} />

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
                                    viewerRole={viewerRole}
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
                                    : viewerRole === "guest" && guestLocked.length > 0
                                            ? `${meta?.totalItems ?? faqs.length} FAQ tersedia • + ${guestLocked.length} FAQ tambahan untuk pengguna terdaftar`
                                            : `${meta?.totalItems ?? faqs.length} FAQ tersedia`}
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
                                <>
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
                                                    viewerRole={viewerRole}
                                                />
                                            )
                                        )}
                                    </div>

                                    {!loading &&
                                        !error &&
                                        !search &&
                                        viewerRole === "guest" &&
                                        guestLocked.length > 0 && (
                                            <section
                                                aria-label="FAQ khusus pengguna terdaftar"
                                                className="mt-8 rounded-2xl border border-violet-200 bg-violet-50/60 p-4 sm:p-6"
                                            >
                                                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                                                    FAQ khusus pengguna terdaftar
                                                </h2>

                                                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                                                    Tersedia {guestLocked.length} jawaban tambahan
                                                    untuk pengguna yang sudah masuk.
                                                </p>

                                                <div className="mt-4 space-y-3">
                                                    {guestLocked.map((item) => (
                                                        <article
                                                            key={item.id}
                                                            className="rounded-xl border border-violet-200 bg-white p-4 sm:p-5"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <Lock
                                                                    size={20}
                                                                    aria-hidden="true"
                                                                    className="mt-0.5 shrink-0 text-[#062E6F]"
                                                                />

                                                                <div className="min-w-0 flex-1">
                                                                    <h3 className="break-words text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                                                                        {item.question}
                                                                    </h3>

                                                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                                                        {item.teaser}
                                                                    </p>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setModalFaq(item)}
                                                                        className="mt-3 rounded-xl bg-[#062E6F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                                                                    >
                                                                        Masuk untuk membaca
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                </>
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

            <RestrictedModal
                open={Boolean(modalFaq)}
                faq={modalFaq}
                onClose={() => setModalFaq(null)}
            />

            <Toast toastKey={toast.key} message={toast.message} />
        </>
    );
}
