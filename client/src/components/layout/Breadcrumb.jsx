import { Link } from "react-router-dom";

export default function Breadcrumb({ categoryName }) {
    return (
        <div className="bg-slate-100">
            <nav className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-4 text-sm">
                <Link
                    to="/"
                    className="text-blue-600 hover:underline"
                >
                    Beranda
                </Link>

                <span className="text-slate-400">›</span>

                <Link
                    to="/"
                    className="text-blue-600 hover:underline"
                >
                    Pusat Bantuan
                </Link>

                <span className="text-slate-400">›</span>

                <span className="font-medium text-slate-700">
                    {categoryName}
                </span>
            </nav>
        </div>
    );
}