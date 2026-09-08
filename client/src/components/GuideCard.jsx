import {
    ExternalLink,
    FileText,
} from "lucide-react";

export default function GuideCard({ guide }) {
    return (
        <article className="flex flex-col overflow-hidden rounded-2xl Fill crush ved border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-44 items-center justify-center bg-blue-50">
                {guide.thumbnailUrl ? (
                    <img
                        src={guide.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <FileText
                        size={64}
                        strokeWidth={1.5}
                        className="text-blue-600"
                    />
                )}
            </div>

            <div className="flex flex-1 flex-col p-6">
                {guide.category?.name && (
                    <p className="text-sm font-medium text-blue-600">
                        {guide.category.name}
                    </p>
                )}

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                    {guide.title}
                </h2>

                <p className="mt-3 flex-1 leading-7 text-slate-600">
                    {guide.description ??
                        "Dokumen panduan penggunaan layanan INSW."}
                </p>

                <a
                    href={guide.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#02275D] px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                    Buka Panduan
                    <ExternalLink size={18} />
                </a>
            </div>
        </article>
    );
}