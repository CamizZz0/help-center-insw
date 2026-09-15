import { useEffect } from "react";
import { Lock, X } from "lucide-react";

/**
 * Modal akses terbatas untuk card FAQ terkunci (SIMULASI demo).
 * Tombol "Masuk" adalah placeholder nonaktif — tidak ada autentikasi.
 * TODO(auth): hubungkan ke halaman login sungguhan setelah tersedia.
 */
export default function RestrictedModal({ open, onClose, faq }) {
    useEffect(() => {
        if (!open) return undefined;

        function onKeyDown(event) {
            if (event.key === "Escape") onClose?.();
        }

        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Akses terbatas"
        >
            <button
                type="button"
                aria-label="Tutup dialog"
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between gap-4 bg-[#062E6F] px-5 py-4">
                    <p className="inline-flex items-center gap-2 text-sm font-bold text-white">
                        <Lock size={17} aria-hidden="true" />
                        Akses terbatas
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-5 sm:px-6">
                    <h2 className="break-words text-base font-bold text-slate-900">
                        {faq?.question ?? "FAQ khusus pengguna terdaftar"}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Jawaban FAQ ini hanya tersedia untuk pengguna yang
                        sudah masuk. Ini demo simulasi — belum ada login
                        sungguhan.
                    </p>

                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Kembali ke FAQ publik
                        </button>

                        <button
                            type="button"
                            disabled
                            title="Demo — login belum tersedia"
                            className="cursor-not-allowed rounded-xl bg-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600"
                        >
                            Masuk
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
