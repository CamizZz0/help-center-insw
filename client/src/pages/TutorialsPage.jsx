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

                setTutorials(result.data);
                setMeta(result.meta);
            } catch (err) {
                setError(err.message);
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

            <section className="bg-[#F0F8FF] px-6 py-16 text-center">
                <h1 className="text-4xl font-bold text-slate-900">
                    Tutorial INSW
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Ikuti tutorial visual untuk memahami
                    penggunaan fitur dan layanan pada Portal INSW.
                </p>
            </section>

            <main className="min-h-screen bg-[#F8FAFC] px-6 py-16">
                <section className="mx-auto max-w-7xl">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Daftar Tutorial
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Total tutorial: {meta?.totalItems ?? 0}
                        </p>
                    </div>

                    {loading ? (
                        <div className="mt-10 rounded-xl bg-white p-8 text-slate-600">
                            Memuat tutorial...
                        </div>
                    ) : error ? (
                        <div className="mt-10 rounded-xl bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    ) : tutorials.length === 0 ? (
                        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-10 text-center">
                            <h2 className="font-semibold text-slate-900">
                                Tutorial belum tersedia
                            </h2>

                            <p className="mt-2 text-slate-600">
                                Silakan kembali lagi nanti.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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