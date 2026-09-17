import {
    PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import VideoModal from "./VideoModal";

export default function TutorialCard({ tutorial }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="relative aspect-video w-full overflow-hidden bg-slate-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    aria-label={`Putar video ${tutorial.title}`}
                >
                    {tutorial.thumbnailUrl && (
                        <img
                            src={tutorial.thumbnailUrl}
                            alt={`Thumbnail ${tutorial.title}`}
                            loading="lazy"
                            className="h-full w-full object-cover"
                        />
                    )}

                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-blue-700 shadow-md sm:h-16 sm:w-16">
                            <PlayCircle
                                size={32}
                                className="sm:h-9 sm:w-9"
                            />
                        </span>
                    </span>
                </button>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <Link
                    to={`/tutorial/${encodeURIComponent(tutorial.slug)}`}
                    className="break-words text-lg font-bold leading-7 text-slate-900 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-xl"
                >
                    {tutorial.title}
                </Link>

                <p className="mt-3 flex-1 break-words text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {tutorial.description ??
                        "Video tutorial penggunaan layanan INSW."}
                </p>

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#02275D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:mt-6 sm:text-base"
                >
                    Tonton Tutorial
                    <PlayCircle
                        size={18}
                        className="shrink-0"
                    />
                </button>
            </div>
            </article>

            <VideoModal
                open={open}
                onClose={() => setOpen(false)}
                videoUrl={tutorial.videoUrl}
                title={tutorial.title}
                feedbackTutorialId={tutorial.id}
            />
        </>
    );
}
