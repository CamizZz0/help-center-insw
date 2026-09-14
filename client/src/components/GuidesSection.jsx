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
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Panduan & Tutorial
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                    Pelajari cara menggunakan layanan INSW melalui
                    panduan dan tutorial yang tersedia.
                </p>
            </div>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2">
                {guideItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            to={item.href}
                            className="group flex h-full flex-col rounded-2xl bg-slate-100 p-5 transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 sm:p-8"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm sm:h-14 sm:w-14">
                                <Icon
                                    size={26}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900 sm:mt-6 sm:text-xl">
                                {item.title}
                            </h3>

                            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
                                {item.description}
                            </p>

                            <span className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-600 sm:mt-6">
                                {item.action}

                                <ArrowRight
                                    size={18}
                                    className="transition group-hover:translate-x-1"
                                />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}