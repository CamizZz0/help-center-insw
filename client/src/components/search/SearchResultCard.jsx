import {
    ChevronRight,
    CircleHelp,
    FileText,
    PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import VideoModal from "../VideoModal";

const TYPE_DETAILS = {
    faq: {
        label: "FAQ",
        icon: CircleHelp,
        className: "bg-slate-200 text-slate-700",
    },
    guide: {
        label: "Panduan",
        icon: FileText,
        className: "bg-blue-100 text-blue-700",
    },
    tutorial: {
        label: "Tutorial",
        icon: PlayCircle,
        className: "bg-indigo-100 text-indigo-700",
    },
};

function stripHtml(html = "") {
    const documentValue =
        new DOMParser().parseFromString(
            html,
            "text/html",
        );

    return documentValue.body.textContent ?? "";
}

function HighlightText({
    text = "",
}) {
    return (
        <>
            {String(text ?? "")}
        </>
    );
}

function ResultBreadcrumb({
    items,
    query,
}) {
    const visibleItems =
        items.filter(Boolean);

    return (
        <div className="mt-5 flex flex-wrap items-center gap-1 text-xs text-slate-400">
            {visibleItems.map(
                (item, index) => (
                    <span
                        key={`${item}-${index}`}
                        className="inline-flex items-center gap-1"
                    >
                        <span>
                            <HighlightText
                                text={item}
                                query={query}
                            />
                        </span>

                        {index <
                            visibleItems.length -
                                1 && (
                            <ChevronRight
                                size={12}
                                aria-hidden="true"
                            />
                        )}
                    </span>
                ),
            )}
        </div>
    );
}

function TypeBadge({ type }) {
    const details =
        TYPE_DETAILS[type] ??
        TYPE_DETAILS.faq;

    const Icon = details.icon;

    return (
        <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${details.className}`}
        >
            <Icon
                size={14}
                aria-hidden="true"
            />

            {details.label}
        </span>
    );
}

export default function SearchResultCard({
    item,
    query,
    isOpen = false,
    onToggle,
}) {
    const [videoOpen, setVideoOpen] = useState(false);
    const type = item.resultType;

    const cardClass =
        "rounded-xl border border-slate-300 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm sm:p-6";

    if (type === "faq") {
        const answerSummary =
            stripHtml(item.answer);

        return (
            <article className={cardClass}>
                <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                        <p className="text-sm text-slate-600">
                            <HighlightText
                                text={
                                    item.topic
                                        ?.name ??
                                    item
                                        .subcategory
                                        ?.name ??
                                    "FAQ"
                                }
                                query={query}
                            />
                        </p>

                        <h2 className="mt-2 font-semibold leading-6 text-slate-900">
                            <HighlightText
                                text={
                                    item.question
                                }
                                query={query}
                            />
                        </h2>
                    </div>

                    <TypeBadge type="faq" />
                </div>

                {!isOpen && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-700">
                        <HighlightText
                            text={answerSummary}
                            query={query}
                        />
                    </p>
                )}

                {isOpen && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                        <div
                            className="break-words text-sm leading-7 text-slate-700 [&_a]:break-all [&_a]:text-blue-700 [&_a]:underline [&_img]:h-auto [&_img]:max-w-full"
                            dangerouslySetInnerHTML={{
                                __html:
                                    item.answer,
                            }}
                        />
                    </div>
                )}

                <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={onToggle}
                    className="mt-3 text-sm font-semibold text-blue-700 hover:underline"
                >
                    {isOpen
                        ? "Tutup jawaban"
                        : "Lihat jawaban"}
                </button>

                <ResultBreadcrumb
                    query={query}
                    items={[
                        "Beranda",
                        "Pusat Bantuan",
                        item.category?.name,
                        item.subcategory
                            ?.name,
                        item.topic?.name,
                    ]}
                />
            </article>
        );
    }

    if (type === "guide") {
        return (
            <article className={cardClass}>
                <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                        <p className="text-sm text-slate-600">
                            <HighlightText
                                text="Panduan INSW"
                                query={query}
                            />
                        </p>

                        <h2 className="mt-2 font-semibold leading-6 text-slate-900">
                            <HighlightText
                                text={item.title}
                                query={query}
                            />
                        </h2>
                    </div>

                    <TypeBadge type="guide" />
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-700">
                    <HighlightText
                        text={
                            item.description ??
                            "Dokumen panduan penggunaan layanan INSW."
                        }
                        query={query}
                    />
                </p>

                <Link
                    to={`/panduan/${encodeURIComponent(item.slug)}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline"
                >
                    Lihat detail panduan
                </Link>

                <ResultBreadcrumb
                    query={query}
                    items={[
                        "Beranda",
                        "Pusat Bantuan",
                        "Panduan",
                    ]}
                />
            </article>
        );
    }

    return (
        <>
            <article className={cardClass}>
                <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-[#062E6F]">
                        <PlayCircle
                            size={28}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-5">
                            <div className="min-w-0">
                                <p className="text-sm text-slate-600">
                                    <HighlightText
                                        text="Tutorial INSW"
                                        query={query}
                                    />
                                </p>

                                <h2 className="mt-2 font-semibold leading-6 text-slate-900">
                                    <HighlightText
                                        text={
                                            item.title
                                        }
                                        query={query}
                                    />
                                </h2>
                            </div>

                            <TypeBadge type="tutorial" />
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-700">
                            <HighlightText
                                text={
                                    item.description ??
                                    "Video tutorial penggunaan layanan INSW."
                                }
                                query={query}
                            />
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setVideoOpen(true)}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline"
                            >
                                Tonton tutorial

                                <PlayCircle
                                    size={15}
                                    aria-hidden="true"
                                />
                            </button>
                            <span className="text-slate-300">|</span>
                            <Link
                                to={`/tutorial/${encodeURIComponent(item.slug)}`}
                                className="text-sm font-semibold text-slate-600 hover:text-blue-700 hover:underline"
                            >
                                Lihat detail
                            </Link>
                        </div>

                        <ResultBreadcrumb
                            query={query}
                            items={[
                                "Beranda",
                                "Pusat Bantuan",
                                "Tutorial",
                            ]}
                        />
                    </div>
                </div>
            </article>

            <VideoModal
                open={videoOpen}
                onClose={() => setVideoOpen(false)}
                videoUrl={item.videoUrl}
                title={item.title}
            />
        </>
    );
}
