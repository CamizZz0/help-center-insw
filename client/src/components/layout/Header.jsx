import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function getMenuPath(item) {
        if (item === "Beranda" || item === "Pusat Bantuan") {
            return "/";
        }

        return "#";
    }

    return (
        <header>
            {/* Top bar */}
            <div className="bg-[#062E6F] text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 text-xs sm:justify-end sm:gap-3 sm:px-6 sm:text-sm">
                    <div className="flex items-center gap-2">
                        <Phone size={15} aria-hidden="true" />
                        <span>150-679</span>
                    </div>

                    <span className="hidden h-4 w-px bg-white/40 sm:block" />

                    <a
                        href="tel:150679"
                        className="hidden underline sm:block"
                    >
                        Contact Center
                    </a>

                    <span className="hidden h-4 w-px bg-white/40 md:block" />

                    <div className="hidden items-center gap-2 md:flex">
                        <button type="button">ID</button>
                        <span>|</span>
                        <button type="button">EN</button>
                    </div>

                    <button
                        type="button"
                        className="rounded-lg bg-[#FDB913] px-4 py-2 font-semibold text-[#062E6F] transition hover:bg-yellow-300 sm:ml-3"
                    >
                        LOGIN
                    </button>
                </div>
            </div>

            {/* Navbar */}
            <nav className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:py-5">
                    <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="shrink-0 text-xl font-bold text-[#062E6F]"
                    >
                        INSW
                    </Link>

                    {/* Menu desktop */}
                    <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
                        {menuItems.map((item) => (
                            <Link
                                key={item}
                                to={getMenuPath(item)}
                                className={`whitespace-nowrap text-sm font-semibold transition ${item === "Pusat Bantuan"
                                        ? "text-blue-600"
                                        : "text-[#062E6F] hover:text-blue-600"
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Tombol hamburger */}
                    <button
                        type="button"
                        aria-label={
                            isMenuOpen
                                ? "Tutup menu navigasi"
                                : "Buka menu navigasi"
                        }
                        aria-expanded={isMenuOpen}
                        onClick={() =>
                            setIsMenuOpen((current) => !current)
                        }
                        className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-[#062E6F] transition hover:bg-blue-50 lg:hidden"
                    >
                        {isMenuOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>
                </div>

                {/* Menu mobile */}
                {isMenuOpen && (
                    <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
                        <div className="mx-auto flex max-w-7xl flex-col gap-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item}
                                    to={getMenuPath(item)}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${item === "Pusat Bantuan"
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-[#062E6F] hover:bg-slate-50"
                                        }`}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}