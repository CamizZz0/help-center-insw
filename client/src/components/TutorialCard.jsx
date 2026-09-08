import {
    ExternalLink,
    PlayCircle,
} from "lucide-react";

export default function TutorialCard({ tutorial }) {
    return (
        <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
            <div className="relative aspect-video overflow-hidden bg-slate-200">
                {tutorial.thumbnailUrl && (
                    <img
                        src={tutorial.thumbnailUrl}
                        alt={`Thumbnail ${tutorial.title}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-blue-700 shadow-md sm:h-16 sm:w-16">
                        <PlayCircle
                            size={32}
                            className="sm:h-9 sm:w-9"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                {tutorial.category?.name && (
                    <p className="break-words text-xs font-medium text-blue-600 sm:text-sm">
                        {tutorial.category.name}
                    </p>
                )}

                <h2 className="mt-2 break-words text-lg font-bold leading-7 text-slate-900 sm:text-xl">
                    {tutorial.title}
                </h2>

                <p className="mt-3 flex-1 break-words text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {tutorial.description ??
                        "Video tutorial penggunaan layanan INSW."}
                </p>

                <a
                    href={tutorial.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#02275D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:mt-6 sm:text-base"
                >
                    Tonton Tutorial
                    <ExternalLink
                        size={18}
                        className="shrink-0"
                    />
                </a>
            </div>
        </article>
    );
}