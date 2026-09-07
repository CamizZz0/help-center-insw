import { useEffect, useState } from "react";
import { getCategories } from "../services/api";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CategoryCard from "../components/CategoryCard";

function extractCategories(result) {
    if (Array.isArray(result?.data)) {
        return result.data;
    }

    if (Array.isArray(result?.data?.categories)) {
        return result.data.categories;
    }

    return [];
}

export default function LandingPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoading(true);
                setError("");

                const result = await getCategories();
                setCategories(extractCategories(result));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);

    return (
        <>
            <Header />

            <section className="bg-[#EFF7FF]">
                <div className="mx-auto max-w-7xl px-6 py-20 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
                        Pusat Bantuan
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                        Temukan jawaban, panduan, dan informasi
                        penggunaan layanan INSW.
                    </p>
                </div>
            </section>

            <main className="bg-slate-50 px-6 py-16">
                <section className="mx-auto max-w-7xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Pilih Kategori FAQ
                        </h2>

                        <p className="mt-3 text-slate-600">
                            Pilih kategori yang sesuai dengan informasi
                            yang sedang Anda cari.
                        </p>
                    </div>

                    {loading ? (
                        <p className="mt-10 text-center text-slate-500">
                            Memuat kategori...
                        </p>
                    ) : error ? (
                        <p className="mt-10 text-center text-red-600">
                            {error}
                        </p>
                    ) : (
                        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {categories.map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    );
}