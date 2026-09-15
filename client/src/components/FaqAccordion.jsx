import { Lock } from "lucide-react";
import {
    canViewerSeeFaq,
    normalizeVisibility,
} from "../utils/viewerRole";
import FaqFeedback from "./FaqFeedback";

/**
 * Accordion FAQ dengan gate visibilitas (SIMULASI frontend).
 *
 * PENTING: gate ini hanyalah simulasi UX — bukan pengaman.
 * TODO(auth): setelah autentikasi resmi tersedia, andalkan filtering
 * backend dan hapus logika simulasi ini.
 *
 * Aturan:
 * - Terlihat (canViewerSeeFaq) → accordion normal.
 * - Guest + FAQ authenticated (published) → "akses terbatas" + CTA nonaktif
 *   "Masuk untuk membaca".
 * - Selain itu (draft) →
 *   "Konten tidak tersedia".
 */
export default function FaqAccordion({
    faq,
    isOpen,
    onToggle,
    viewerRole = "guest",
}) {
    const visibility = normalizeVisibility(faq?.visibility);
    const isPublished = faq?.isPublished ?? faq?.is_published ?? true;

    if (canViewerSeeFaq(faq, viewerRole)) {
        return (
            <article
                className={`min-w-0 overflow-hidden rounded-xl border bg-white transition ${isOpen
                        ? "border-blue-500 shadow-sm"
                        : "border-slate-200"
                    }`}
            >
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left sm:gap-6 sm:p-5"
                >
                    <div className="min-w-0 flex-1">
                        <p className="break-words text-xs leading-5 text-blue-600 sm:text-sm">
                            {faq.category?.name} •{" "}
                            {faq.subcategory?.name} •{" "}
                            {faq.topic?.name}
                        </p>

                        <h2 className="mt-1.5 break-words text-sm font-semibold leading-6 text-slate-900 sm:mt-2 sm:text-base">
                            {faq.question}
                        </h2>

                    </div>

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden="true"
                        className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                    >
                        <path
                            d="m6 9 6 6 6-6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div className="border-t border-slate-200 px-4 py-4 sm:px-5">
                        <div
                            className="break-words text-sm leading-7 text-slate-600 sm:text-base [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_img]:h-auto [&_img]:max-w-full"
                            dangerouslySetInnerHTML={{
                                __html: faq.answer,
                            }}
                        />

                        <FaqFeedback faqId={faq.id} viewerRole={viewerRole} />
                    </div>
                )}
            </article>
        );
    }

    const needsLogin =
        isPublished && visibility === "authenticated" && viewerRole === "guest";

    if (needsLogin) {
        return (
            <article className="min-w-0 overflow-hidden rounded-xl border border-amber-300 bg-amber-50">
                <div className="flex w-full items-start gap-3 p-4 text-left sm:p-5">
                    <Lock
                        size={20}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[#062E6F]"
                    />

                    <div className="min-w-0 flex-1">
                        <h2 className="break-words text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                            {faq.question}
                        </h2>

                        <p className="mt-1.5 text-sm leading-6 text-slate-600">
                            Konten ini hanya untuk pengguna terdaftar.
                            Masuk untuk membaca jawaban lengkap.
                        </p>

                        <button
                            type="button"
                            disabled
                            title="Demo — login belum tersedia"
                            className="mt-3 cursor-not-allowed rounded-xl bg-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600"
                        >
                            Masuk untuk membaca
                        </button>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Konten tidak tersedia
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
                FAQ ini tidak dapat ditampilkan untuk mode pembaca Anda saat
                ini.
            </p>
        </article>
    );
}
