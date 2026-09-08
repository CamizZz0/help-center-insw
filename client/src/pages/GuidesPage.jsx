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

                setGuides(result.data);
                setMeta(result.meta);
            } catch (err) {
                setError(err.message);
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

            <section className="bg-[#F0F8FF] px-6 py-16 text-center">
                <h1 className="text-4xl font-bold text-slate-900">
                    Panduan INSW
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Pelajari penggunaan layanan INSW melalui
                    panduan tertulis yang tersusun langkah demi
                    langkah.
                </p>
            </section>

            <main className="min-h-screen bg-[#F8FAFC] px-6 py-16">
                <section className="mx-auto max-w-7xl">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Daftar Panduan
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Total panduan: {meta?.totalItems ?? 0}
                        </p>
                    </div>

                    {loading ? (
                        <div className="mt-10 rounded-xl bg-white p-8 text-slate-600">
                            Memuat panduan...
                        </div>
                    ) : error ? (
                        <div className="mt-10 rounded-xl bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    ) : guides.length === 0 ? (
                        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-10 text-center">
                            <h2 className="font-semibold text-slate-900">
                                Panduan belum tersedia
                            </h2>

                            <p className="mt-2 text-slate-600">
                                Silakan kembali lagi nanti.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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