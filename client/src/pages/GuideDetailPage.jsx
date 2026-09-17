import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { getGuideBySlug } from "../services/api";
import ContentFeedback from "../components/ContentFeedback";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Breadcrumb from "../components/layout/Breadcrumb";

export default function GuideDetailPage() {
    const { slug } = useParams();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadGuide() {
            try {
                setLoading(true);
                setError("");
                const result = await getGuideBySlug(slug);
                setGuide(result?.data ?? null);
            } catch (err) {
                setError(err.message || "Gagal memuat panduan.");
            } finally {
                setLoading(false);
            }
        }
        if (slug) loadGuide();
    }, [slug]);

    return (
        <>
            <Header />
            <Breadcrumb categoryName={guide?.title ?? "Panduan"} />

            <main className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-12">
                <div className="mx-auto max-w-4xl">
                    <Link
                        to="/panduan"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke daftar panduan
                    </Link>

                    {loading ? (
                        <div className="mt-8 rounded-xl bg-white p-6 text-sm text-slate-600 sm:p-8">
                            Memuat panduan...
                        </div>
                    ) : error ? (
                        <div className="mt-8 rounded-xl bg-red-50 p-6 text-sm text-red-600 sm:p-8">
                            {error}
                        </div>
                    ) : !guide ? (
                        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-center sm:p-10">
                            <h2 className="font-semibold text-slate-900">Panduan tidak ditemukan</h2>
                            <p className="mt-2 text-sm text-slate-600">Slug tidak valid atau panduan belum dipublikasikan.</p>
                        </div>
                    ) : (
                        <article className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex aspect-video items-center justify-center bg-blue-50">
                                <FileText size={64} strokeWidth={1.5} className="text-blue-600" />
                            </div>
                            <div className="p-6 sm:p-8">
                                <h1 className="text-2xl font-bold leading-8 text-slate-900 sm:text-3xl">
                                    {guide.title}
                                </h1>
                                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                                    {guide.description ?? "Dokumen panduan penggunaan layanan INSW."}
                                </p>
                                <a
                                    href={guide.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#02275D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                >
                                    Buka Panduan
                                    <ExternalLink size={18} />
                                </a>

                                <ContentFeedback
                                    contentType="guide"
                                    contentId={guide.id}
                                    subject="panduan"
                                    className="mt-8"
                                />
                            </div>
                        </article>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
