import { useEffect, useState } from "react";
import { Phone, Star } from "lucide-react";

import { getFaqs } from "../services/api";
import FaqAccordion from "./FaqAccordion";

export default function PopularFaqSection() {
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
                });

                setFaqs(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadPopularFaqs();
    }, []);

    function handleToggle(faqId) {
        setOpenFaqId((currentId) =>
            currentId === faqId ? null : faqId
        );
    }

    return (
        <section className="bg-[#EFF7FF] px-6 py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex items-center justify-center gap-3">
                    <Star
                        className="text-yellow-500"
                        fill="currentColor"
                        size={28}
                    />

                    <h2 className="text-3xl font-bold text-slate-900">
                        FAQ Populer
                    </h2>
                </div>

                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-4">
                        {loading ? (
                            <div className="rounded-xl bg-white p-8 text-slate-600">
                                Memuat FAQ populer...
                            </div>
                        ) : error ? (
                            <div className="rounded-xl bg-red-50 p-8 text-red-600">
                                {error}
                            </div>
                        ) : faqs.length === 0 ? (
                            <div className="rounded-xl bg-white p-8 text-slate-600">
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
                                />
                            ))
                        )}
                    </div>

                    <aside className="flex flex-col justify-between rounded-2xl bg-[#062E6F] p-8 text-white">
                        <div>
                            <h3 className="text-2xl font-bold">
                                Masih Butuh Bantuan?
                            </h3>

                            <p className="mt-4 leading-7 text-blue-100">
                                Hubungi Contact Center INSW untuk
                                mendapatkan bantuan lebih lanjut.
                            </p>
                        </div>

                        <a
                            href="tel:150679"
                            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-900 hover:bg-yellow-300"
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