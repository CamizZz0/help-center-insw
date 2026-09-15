import { useEffect, useState } from "react";
import { Phone, Star } from "lucide-react";

import { getFaqs } from "../services/api";
import { filterFaqsForViewer } from "../utils/viewerRole";
import FaqAccordion from "./FaqAccordion";

export default function PopularFaqSection({ viewerRole = "guest" }) {
    const [faqs, setFaqs] = useState([]);
    const [openFaqId, setOpenFaqId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPopularFaqs() {
            try {
                setLoading(true);
                setError("");

                const result = await getFaqs({
                    popular: true,
                    page: 1,
                    limit: 3,
                    // SIMULASI DEMO — TODO(auth): hapus setelah backend pakai sesi/JWT.
                    viewerRole,
                });

                // Pertahanan berlapis di frontend (simulasi): saring lagi
                // sesuai role. Bukan pengaman — backend wajib memfilter.
                setFaqs(filterFaqsForViewer(result.data, viewerRole));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadPopularFaqs();
    }, [viewerRole]);

    function handleToggle(faqId) {
        setOpenFaqId((currentId) =>
            currentId === faqId ? null : faqId
        );
    }

    return (
        <section className="bg-[#EFF7FF] px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10">
                    <Star
                        className="shrink-0 text-yellow-500"
                        fill="currentColor"
                        size={26}
                    />

                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        FAQ Populer
                    </h2>
                </div>

                <div className="grid items-stretch gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
                    <div className="min-w-0 space-y-4">
                        {loading ? (
                            <div className="rounded-xl bg-white p-5 text-sm text-slate-600 sm:p-8 sm:text-base">
                                Memuat FAQ populer...
                            </div>
                        ) : error ? (
                            <div className="rounded-xl bg-red-50 p-5 text-sm text-red-600 sm:p-8 sm:text-base">
                                {error}
                            </div>
                        ) : faqs.length === 0 ? (
                            <div className="rounded-xl bg-white p-5 text-sm text-slate-600 sm:p-8 sm:text-base">
                                Belum ada FAQ populer.
                            </div>
                        ) : (
                            faqs.map((faq) => (
                                <FaqAccordion
                                    key={faq.id}
                                    faq={faq}
                                    isOpen={openFaqId === faq.id}
                                    onToggle={() =>
                                        handleToggle(faq.id)
                                    }
                                    viewerRole={viewerRole}
                                />
                            ))
                        )}
                    </div>

                    <aside className="flex flex-col justify-between rounded-2xl bg-[#062E6F] p-5 text-white sm:p-8">
                        <div>
                            <h3 className="text-xl font-bold sm:text-2xl">
                                Masih Butuh Bantuan?
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-blue-100 sm:mt-4 sm:text-base sm:leading-7">
                                Hubungi Contact Center INSW untuk
                                mendapatkan bantuan lebih lanjut.
                            </p>
                        </div>

                        <a
                            href="tel:150679"
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-900 transition hover:bg-yellow-300 sm:mt-8"
                        >
                            <Phone size={20} />
                            Hubungi Kami
                        </a>
                    </aside>
                </div>
            </div>
        </section>
    );
}
