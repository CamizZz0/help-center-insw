import { useEffect, useState } from "react";

import { getGuides } from "../services/api";

import Header from "../components/layout/Header";
import Breadcrumb from "../components/layout/Breadcrumb";
import Footer from "../components/layout/Footer";
import GuideCard from "../components/GuideCard";
import Pagination from "../components/Pagination";

export default function GuidesPage() {
    const [guides, setGuides] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadGuides() {
            try {
                setLoading(true);
                setError("");

                const result = await getGuides({
                    page,
                    limit: 6,
                });

                setGuides(
                    Array.isArray(result?.data)
                        ? result.data
                        : []
                );

                setMeta(result?.meta ?? null);
            } catch (err) {
                setError(
                    err.message ||
                    "Gagal mengambil data panduan."
                );
            } finally {
                setLoading(false);
            }
        }

        loadGuides();
    }, [page]);

    function handlePageChange(nextPage) {
        setPage(nextPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <>
            <Header />

            <Breadcrumb categoryName="Panduan INSW" />

            <section className="bg-[#F0F8FF] px-4 py-12 text-center sm:px-6 sm:py-16">
                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                    Panduan INSW
                </h1>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-lg sm:leading-8">
                    Pelajari penggunaan layanan INSW melalui
                    panduan tertulis yang tersusun langkah demi
                    langkah.
                </p>
            </section>

            <main className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 sm:py-16">
                <section className="mx-auto max-w-7xl">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Daftar Panduan
                        </h2>

                        <p className="mt-2 text-sm text-slate-600 sm:text-base">
                            Total panduan:{" "}
                            {meta?.totalItems ?? 0}
                        </p>
                    </div>

                    {loading ? (
                        <div className="mt-8 rounded-xl bg-white p-5 text-sm text-slate-600 sm:mt-10 sm:p-8 sm:text-base">
                            Memuat panduan...
                        </div>
                    ) : error ? (
                        <div className="mt-8 rounded-xl bg-red-50 p-5 text-sm text-red-600 sm:mt-10 sm:p-8 sm:text-base">
                            {error}
                        </div>
                    ) : guides.length === 0 ? (
                        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-center sm:mt-10 sm:p-10">
                            <h2 className="font-semibold text-slate-900">
                                Panduan belum tersedia
                            </h2>

                            <p className="mt-2 text-sm text-slate-600 sm:text-base">
                                Silakan kembali lagi nanti.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 grid items-stretch gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {guides.map((guide) => (
                                <GuideCard
                                    key={guide.id}
                                    guide={guide}
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
            </main>

            <Footer />
        </>
    );
}