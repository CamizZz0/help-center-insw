import {
    ExternalLink,
    PlayCircle,
} from "lucide-react";

export default function TutorialCard({ tutorial }) {
    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
            <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-200">
                {tutorial.thumbnailUrl ? (
                    <img
                        src={tutorial.thumbnailUrl}
                        alt={`Thumbnail ${tutorial.title}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <PlayCircle
                        size={64}
                        strokeWidth={1.5}
                        className="text-blue-600"
                    />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-blue-700 shadow-md">
                        <PlayCircle size={36} />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
                {tutorial.category?.name && (
                    <p className="text-sm font-medium text-blue-600">
                        {tutorial.category.name}
                    </p>
                )}

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                    {tutorial.title}
                </h2>

                <p className="mt-3 flex-1 leading-7 text-slate-600">
                    {tutorial.description ??
                        "Video tutorial penggunaan layanan INSW."}
                </p>

                <a
                    href={tutorial.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#02275D] px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                    Tonton Tutorial
                    <ExternalLink size={18} />
                </a>
            </div>
        </article>
    );
}