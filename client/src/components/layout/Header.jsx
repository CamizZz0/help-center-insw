import { Link } from "react-router-dom";

const menuItems = [
    "Beranda",
    "Profil",
    "INTR",
    "Informasi Publik",
    "Publikasi",
    "Aplikasi LNSW",
    "Penelusuran",
    "Pusat Bantuan",
    "KNFP",
    "Survei",
];

export default function Header() {
    return (
        <header>
            {/* Top bar */}
            <div className="bg-[#062E6F] text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-6 py-3 text-sm">
                    <span>☎ 150-679</span>
                    <span className="h-4 w-px bg-white/40" />
                    <a href="#" className="underline">
                        Contact Center
                    </a>
                    <span className="h-4 w-px bg-white/40" />
                    <button type="button">ID</button>
                    <span>|</span>
                    <button type="button">EN</button>

                    <button
                        type="button"
                        className="ml-3 rounded-lg bg-yellow-400 px-5 py-2 font-semibold text-slate-900"
                    >
                        LOGIN
                    </button>
                </div>
            </div>

            {/* Navbar */}
            <nav className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-5">
                    <Link
                        to="/"
                        className="shrink-0 text-xl font-bold text-[#062E6F]"
                    >
                        INSW
                    </Link>

                    <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
                        {menuItems.map((item) => (
                            <Link
                                key={item}
                                to={item === "Pusat Bantuan" ? "/" : "#"}
                                className={`whitespace-nowrap text-sm font-semibold transition ${item === "Pusat Bantuan"
                                        ? "text-blue-600"
                                        : "text-[#062E6F] hover:text-blue-600"
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <button
                        type="button"
                        aria-label="Buka menu"
                        className="ml-auto rounded-lg border border-slate-300 p-2 text-[#062E6F] lg:hidden"
                    >
                        ☰
                    </button>
                </div>
            </nav>
        </header>
    );
}