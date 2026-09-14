import {
    FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function GuideCard({ guide }) {
    return (
        <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
            <Link
                to={`/panduan/${encodeURIComponent(guide.slug)}`}
                className="aspect-video overflow-hidden bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-label={`Lihat detail ${guide.title}`}
            >
                <div className="flex h-full w-full items-center justify-center">
                    <FileText
                        size={56}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="text-blue-600 sm:h-16 sm:w-16"
                    />
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <Link
                    to={`/panduan/${encodeURIComponent(guide.slug)}`}
                    className="break-words text-lg font-bold leading-7 text-slate-900 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-xl"
                >
                    {guide.title}
                </Link>

                <p className="mt-3 flex-1 break-words text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {guide.description ??
                        "Dokumen panduan penggunaan layanan INSW."}
                </p>

                <Link
                    to={`/panduan/${encodeURIComponent(guide.slug)}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#02275D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:mt-6 sm:text-base"
                >
                    Lihat Detail
                </Link>
            </div>
        </article>
    );
}
