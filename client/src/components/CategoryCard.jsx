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

export default function CategoryCard({ category }) {
    const Icon =
        CATEGORY_ICONS[category.slug] ?? LayoutGrid;

    return (
        <Link
            to={`/faq/${category.slug}`}
            className="group flex min-h-32 items-center gap-5 rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon size={26} strokeWidth={1.8} />
            </div>

            <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                    {category.name}
                </h3>

                {category.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {category.description}
                    </p>
                )}
            </div>

            <ArrowRight
                size={20}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
            />
        </Link>
    );
}