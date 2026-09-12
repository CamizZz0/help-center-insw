import { Link } from "react-router-dom";
import {
    ArrowRight,
    Building2,
    FileCheck,
    LayoutGrid,
    Monitor,
    Package,
    Send,
    UserPlus,
} from "lucide-react";

const CATEGORY_ICONS = {
    "impor-kepabeanan": Package,
    ekspor: Send,
    "registrasi-akun": UserPlus,
    "portal-insw": Monitor,
    "perizinan-rekomendasi": FileCheck,
    "fasilitas-kawasan": Building2,
    "layanan-lainnya": LayoutGrid,
};

const DEFAULT_TOPICS = {
    "impor-kepabeanan": "pendahuluan-pib",
};

export default function CategoryCard({ category }) {
    const Icon =
        CATEGORY_ICONS[category.slug] ?? LayoutGrid;

    const defaultTopic =
        DEFAULT_TOPICS[category.slug];

    const destination = defaultTopic
        ? `/faq/${category.slug}?topic=${defaultTopic}`
        : `/faq/${category.slug}`;

    return (
        <Link
            to={destination}
            className="group flex min-h-28 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 sm:min-h-32 sm:gap-5 sm:p-6"
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
                {category.iconUrl ? (
                    <img
                        src={category.iconUrl}
                        alt={`Ikon ${category.name}`}
                        loading="lazy"
                        className="h-6 w-6 object-contain sm:h-[26px] sm:w-[26px]"
                    />
                ) : (
                    <Icon
                        size={24}
                        strokeWidth={1.8}
                        className="sm:h-[26px] sm:w-[26px]"
                    />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                    {category.name}
                </h3>

                {category.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm">
                        {category.description}
                    </p>
                )}
            </div>

            <ArrowRight
                size={20}
                className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
            />
        </Link>
    );
}