import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { submitFaqFeedback } from "../services/api";

export default function FaqFeedback({ faqId, viewerRole = "guest" }) {
    const [choice, setChoice] = useState("");
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    async function submit(isHelpful) {
        try {
            setStatus("submitting");
            setError("");

            await submitFaqFeedback(faqId, {
                isHelpful,
                reason: isHelpful ? "" : reason,
                viewerRole,
            });

            setStatus("submitted");
        } catch (submissionError) {
            setStatus("idle");
            setError(submissionError.message ?? "Feedback belum dapat dikirim.");
        }
    }

    if (status === "submitted") {
        return (
            <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                Terima kasih, feedback Anda sudah kami terima.
            </div>
        );
    }

    return (
        <section className="mt-5 border-t border-slate-200 pt-5" aria-label="Feedback FAQ">
            <p className="text-sm font-semibold text-slate-800">
                Apakah jawaban ini membantu?
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    disabled={status === "submitting"}
                    onClick={() => submit(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-[#062E6F] disabled:cursor-wait disabled:opacity-60"
                >
                    <ThumbsUp size={16} aria-hidden="true" />
                    Ya
                </button>

                <button
                    type="button"
                    disabled={status === "submitting"}
                    onClick={() => setChoice("no")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-[#062E6F] disabled:cursor-wait disabled:opacity-60"
                >
                    <ThumbsDown size={16} aria-hidden="true" />
                    Tidak
                </button>
            </div>

            {choice === "no" && (
                <div className="mt-4">
                    <label htmlFor={`feedback-reason-${faqId}`} className="text-sm font-medium text-slate-700">
                        Apa yang perlu diperbaiki? <span className="text-slate-400">(opsional)</span>
                    </label>

                    <textarea
                        id={`feedback-reason-${faqId}`}
                        value={reason}
                        maxLength={1000}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Tulis masukan Anda..."
                        className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                        type="button"
                        disabled={status === "submitting"}
                        onClick={() => submit(false)}
                        className="mt-3 rounded-xl bg-[#062E6F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
                    >
                        Kirim feedback
                    </button>
                </div>
            )}

            {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        </section>
    );
}
