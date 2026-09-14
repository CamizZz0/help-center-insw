import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { getTutorialBySlug } from "../services/api";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Breadcrumb from "../components/layout/Breadcrumb";
import VideoModal from "../components/VideoModal";

export default function TutorialDetailPage() {
    const { slug } = useParams();
    const [tutorial, setTutorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function loadTutorial() {
            try {
                setLoading(true);
                setError("");
                const result = await getTutorialBySlug(slug);
                setTutorial(result?.data ?? null);
            } catch (err) {
                setError(err.message || "Gagal memuat tutorial.");
            } finally {
                setLoading(false);
            }
        }
        if (slug) loadTutorial();
    }, [slug]);

    return (
        <>
            <Header />
            <Breadcrumb categoryName={tutorial?.title ?? "Tutorial"} />

            <main className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-12">
                <div className="mx-auto max-w-4xl">
                    <Link
                        to="/tutorial"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke daftar tutorial
                    </Link>

                    {loading ? (
                        <div className="mt-8 rounded-xl bg-white p-6 text-sm text-slate-600 sm:p-8">
                            Memuat tutorial...
                        </div>
                    ) : error ? (
                        <div className="mt-8 rounded-xl bg-red-50 p-6 text-sm text-red-600 sm:p-8">
                            {error}
                        </div>
                    ) : !tutorial ? (
                        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-center sm:p-10">
                            <h2 className="font-semibold text-slate-900">Tutorial tidak ditemukan</h2>
                            <p className="mt-2 text-sm text-slate-600">Slug tidak valid atau tutorial belum dipublikasikan.</p>
                        </div>
                    ) : (
                        <article className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-slate-900 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label={`Putar video ${tutorial.title}`}
                            >
                                {tutorial.thumbnailUrl ? (
                                    <img
                                        src={tutorial.thumbnailUrl}
                                        alt={`Thumbnail ${tutorial.title}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-800">
                                        <PlayCircle size={64} className="text-white/80" />
                                    </div>
                                )}
                                <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-blue-700 shadow-lg sm:h-20 sm:w-20">
                                        <PlayCircle size={40} className="sm:h-11 sm:w-11" />
                                    </span>
                                </span>
                            </button>

                            <div className="p-6 sm:p-8">
                                <h1 className="text-2xl font-bold leading-8 text-slate-900 sm:text-3xl">
                                    {tutorial.title}
                                </h1>
                                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                                    {tutorial.description ?? "Video tutorial penggunaan layanan INSW."}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#02275D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                >
                                    <PlayCircle size={18} />
                                    Tonton Tutorial
                                </button>
                            </div>
                        </article>
                    )}
                </div>
            </main>

            <Footer />

            {tutorial && (
                <VideoModal
                    open={open}
                    onClose={() => setOpen(false)}
                    videoUrl={tutorial.videoUrl}
                    title={tutorial.title}
                />
            )}
        </>
    );
}
