import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { submitFeedback } from "../services/api";

/*
 * Blok feedback untuk FAQ, panduan, dan tutorial.
 *
 * Perilaku:
 * - "Ya" langsung terkirim dengan satu klik.
 * - "Tidak" membuka kolom alasan opsional (maksimal 1.000 karakter).
 * - Jenis konten menentukan endpoint yang dipanggil; kunci
 *   viewerRole hanya dikirim untuk FAQ karena hanya FAQ yang masih
 *   memakai simulasi role pembaca.
 */

const SUBJECT = {
    faq: "jawaban",
    guide: "panduan",
    tutorial: "tutorial",
};

const TONE = {
    light: {
        section: "border-t border-slate-200",
        label: "text-slate-800",
        hint: "text-slate-500",
        button: "border-slate-300 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-[#062E6F]",
        textarea:
            "border-slate-300 bg-white text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-100",
        primary: "bg-[#062E6F] text-white hover:bg-blue-800",
        secondary: "border-slate-300 text-slate-700 hover:bg-slate-50",
        success: "bg-emerald-50 text-emerald-800",
        error: "text-red-600",
    },
    dark: {
        section: "border-t border-white/10",
        label: "text-slate-200",
        hint: "text-slate-400",
        button: "border-white/20 text-slate-100 hover:border-white/40 hover:bg-white/10",
        textarea:
            "border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-white/40 focus:ring-white/10",
        primary: "bg-white text-slate-900 hover:bg-slate-100",
        secondary: "border-white/20 text-slate-200 hover:bg-white/10",
        success: "bg-emerald-500/15 text-emerald-200",
        error: "text-rose-300",
    },
};

export default function ContentFeedback({
    contentType = "faq",
    contentId,
    subject,
    viewerRole = "guest",
    tone = "light",
    className = "",
}) {
    const [choice, setChoice] = useState("");
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const style = TONE[tone] ?? TONE.light;
    const kata = subject ?? SUBJECT[contentType] ?? "konten";
    const idAlasan = `feedback-reason-${contentType}-${contentId}`;

    async function submit(isHelpful) {
        try {
            setStatus("submitting");
            setError("");

            await submitFeedback(contentType, contentId, {
                isHelpful,
                reason: isHelpful ? "" : reason,
                // Backend panduan/tutorial tidak memakai viewerRole.
                ...(contentType === "faq" ? { viewerRole } : {}),
            });

            setStatus("submitted");
        } catch (submissionError) {
            setStatus("idle");
            setError(
                submissionError.message ??
                    "Feedback belum dapat dikirim."
            );
        }
    }

    if (status === "submitted") {
        return (
            <div
                className={`rounded-xl px-4 py-3 text-sm font-medium ${style.success} ${className}`}
            >
                Terima kasih, feedback Anda sudah kami terima.
            </div>
        );
    }

    return (
        <section
            className={`pt-5 ${style.section} ${className}`}
            aria-label={`Feedback ${kata}`}
        >
            <p className={`text-sm font-semibold ${style.label}`}>
                Apakah {kata} ini membantu?
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    disabled={status === "submitting"}
                    onClick={() => submit(true)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${style.button}`}
                >
                    <ThumbsUp size={16} aria-hidden="true" />
                    Ya
                </button>

                <button
                    type="button"
                    disabled={status === "submitting"}
                    onClick={() => setChoice("no")}
                    aria-pressed={choice === "no"}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${style.button}`}
                >
                    <ThumbsDown size={16} aria-hidden="true" />
                    Tidak
                </button>
            </div>

            {choice === "no" && (
                <div className="mt-4">
                    <label
                        htmlFor={idAlasan}
                        className={`text-sm font-medium ${style.label}`}
                    >
                        Apa yang perlu diperbaiki?{" "}
                        <span className={style.hint}>(opsional)</span>
                    </label>

                    <textarea
                        id={idAlasan}
                        value={reason}
                        maxLength={1000}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Tulis masukan Anda..."
                        className={`mt-2 min-h-24 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 ${style.textarea}`}
                    />

                    <button
                        type="button"
                        disabled={status === "submitting"}
                        onClick={() => submit(false)}
                        className={`mt-3 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${style.primary}`}
                    >
                        Kirim feedback
                    </button>
                </div>
            )}

            {error && (
                <p role="alert" className={`mt-3 text-sm ${style.error}`}>
                    {error}
                </p>
            )}
        </section>
    );
}
