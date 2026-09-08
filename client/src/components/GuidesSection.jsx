import {
    ArrowRight,
    BookOpen,
    PlayCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

const guideItems = [
    {
        title: "Panduan Pengguna",
        description:
            "Pelajari penggunaan layanan INSW melalui dokumen panduan yang tersedia.",
        action: "Lihat Panduan",
        icon: BookOpen,
        href: "/panduan",
    },
    {
        title: "Video Tutorial",
        description:
            "Ikuti tutorial penggunaan layanan INSW melalui panduan berbentuk video.",
        action: "Lihat Tutorial",
        icon: PlayCircle,
        href: "/tutorial",
    },
];

export default function GuidesSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">
                    Panduan & Tutorial
                </h2>

                <p className="mt-3 text-slate-600">
                    Pelajari cara menggunakan layanan INSW melalui
                    panduan dan tutorial yang tersedia.
                </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
                {guideItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <article
                            key={item.title}
                            className="group rounded-2xl bg-slate-100 p-8 transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                <Icon size={28} strokeWidth={1.8} />
                            </div>

                            <h3 className="mt-6 text-xl font-bold text-slate-900">
                                {item.title}
                            </h3>

                            <p className="mt-3 leading-7 text-slate-600">
                                {item.description}
                            </p>

                            {item.href ? (
                                <Link
                                    to={item.href}
                                    className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600"
                                >
                                    {item.action}

                                    <ArrowRight
                                        size={18}
                                        className="transition group-hover:translate-x-1"
                                    />
                                </Link>
                            ) : (
                                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-slate-400">
                                    {item.action}

                                    <ArrowRight size={18} />
                                </span>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}