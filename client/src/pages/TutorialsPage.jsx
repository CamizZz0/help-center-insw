import { useEffect, useState } from "react";

import { getTutorials } from "../services/api";

import Header from "../components/layout/Header";
import Breadcrumb from "../components/layout/Breadcrumb";
import Footer from "../components/layout/Footer";
import TutorialCard from "../components/TutorialCard";
import Pagination from "../components/Pagination";

export default function TutorialsPage() {
    const [tutorials, setTutorials] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTutorials() {
            try {
                setLoading(true);
                setError("");

                const result = await getTutorials({
                    page,
                    limit: 6,
                });

                setTutorials(
                    Array.isArray(result?.data)
                        ? result.data
                        : []
                );

                setMeta(result?.meta ?? null);
            } catch (err) {
                setError(
                    err.message ||
                    "Gagal mengambil data tutorial."
                );
            } finally {
                setLoading(false);
            }
        }

        loadTutorials();
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

            <Breadcrumb categoryName="Tutorial INSW" />

            <section className="bg-[#F0F8FF] px-4 py-12 text-center sm:px-6 sm:py-16">
                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                    Tutorial INSW
                </h1>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-lg sm:leading-8">
                    Ikuti tutorial visual untuk memahami
                    penggunaan fitur dan layanan pada Portal INSW.
                </p>
            </section>

            <main className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 sm:py-16">
                <section className="mx-auto max-w-7xl">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Daftar Tutorial
                        </h2>

                        <p className="mt-2 text-sm text-slate-600 sm:text-base">
                            Total tutorial:{" "}
                            {meta?.totalItems ?? 0}
                        </p>
                    </div>

                    {loading ? (
                        <div className="mt-8 rounded-xl bg-white p-5 text-sm text-slate-600 sm:mt-10 sm:p-8 sm:text-base">
                            Memuat tutorial...
                        </div>
                    ) : error ? (
                        <div className="mt-8 rounded-xl bg-red-50 p-5 text-sm text-red-600 sm:mt-10 sm:p-8 sm:text-base">
                            {error}
                        </div>
                    ) : tutorials.length === 0 ? (
                        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-center sm:mt-10 sm:p-10">
                            <h2 className="font-semibold text-slate-900">
                                Tutorial belum tersedia
                            </h2>

                            <p className="mt-2 text-sm text-slate-600 sm:text-base">
                                Silakan kembali lagi nanti.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 grid items-stretch gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {tutorials.map((tutorial) => (
                                <TutorialCard
                                    key={tutorial.id}
                                    tutorial={tutorial}
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