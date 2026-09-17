import { useEffect } from "react";
import { X } from "lucide-react";

import ContentFeedback from "./ContentFeedback";

function getYoutubeEmbedUrl(videoUrl) {
    if (!videoUrl) return null;
    try {
        const url = new URL(videoUrl);
        const host = url.hostname.replace(/^www\./, "");
        let videoId = null;

        if (host === "youtu.be") {
            videoId = url.pathname.slice(1).split("/")[0];
        } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
            if (url.pathname === "/watch") {
                videoId = url.searchParams.get("v");
            } else if (url.pathname.startsWith("/embed/")) {
                videoId = url.pathname.split("/")[2];
            } else if (url.pathname.startsWith("/shorts/")) {
                videoId = url.pathname.split("/")[2];
            }
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
        return null;
    } catch {
        return null;
    }
}

/*
 * `feedbackTutorialId` diisi bila feedback tutorial ingin ditampilkan di
 * dalam modal, mis. saat video dibuka langsung dari daftar tutorial.
 * Halaman detail tidak mengirimkannya karena di sana feedback sudah ada.
 */
export default function VideoModal({
    open,
    onClose,
    videoUrl,
    title,
    feedbackTutorialId = null,
}) {
    const embedUrl = getYoutubeEmbedUrl(videoUrl);

    useEffect(() => {
        if (!open) return;
        function onKeyDown(e) {
            if (e.key === "Escape") onClose();
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
            aria-label={title ?? "Pemutar video"}
        >
            <button
                type="button"
                aria-label="Tutup video"
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-black shadow-2xl">
                <div className="flex items-center justify-between gap-4 bg-slate-900 px-4 py-3 sm:px-5">
                    <h2 className="min-w-0 truncate text-sm font-semibold text-white sm:text-base">
                        {title ?? "Tutorial Video"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="relative aspect-video w-full bg-black">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={title ?? "Video tutorial"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full border-0"
                        />
                    ) : videoUrl ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                            <p className="text-sm text-slate-300">
                                Format video tidak dapat diputar di modal. Buka di tab baru.
                            </p>
                            <a
                                href={videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                            >
                                Buka video
                            </a>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center p-6 text-sm text-slate-400">
                            URL video tidak tersedia.
                        </div>
                    )}
                </div>

                {Number.isSafeInteger(feedbackTutorialId) && (
                    <div className="overflow-y-auto border-t border-white/10 bg-slate-950 px-4 py-4 sm:px-5">
                        <ContentFeedback
                            contentType="tutorial"
                            contentId={feedbackTutorialId}
                            subject="tutorial"
                            tone="dark"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
