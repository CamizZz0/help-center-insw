import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-[#062E6F] text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
                <div>
                    <h2 className="text-xl font-bold">
                        Indonesia National Single Window
                    </h2>

                    <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100">
                        Pusat informasi, panduan, dan layanan bantuan
                        penggunaan sistem INSW.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold">
                        Pusat Bantuan
                    </h2>

                    <div className="mt-4 flex flex-col gap-3 text-sm text-blue-100">
                        <Link to="/" className="hover:text-white">
                            Beranda Pusat Bantuan
                        </Link>

                        <Link
                            to="/faq/impor-kepabeanan"
                            className="hover:text-white"
                        >
                            FAQ
                        </Link>

                        <a href="#" className="hover:text-white">
                            Panduan & Tutorial
                        </a>
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold">
                        Hubungi Kami
                    </h2>

                    <div className="mt-4 space-y-3 text-sm text-blue-100">
                        <p>Contact Center: 150-679</p>
                        <p>Email: info@insw.go.id</p>
                        <p>Senin–Jumat, 08.00–17.00 WIB</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/20">
                <div className="mx-auto max-w-7xl px-6 py-5 text-center text-sm text-blue-100">
                    © {new Date().getFullYear()} Lembaga National
                    Single Window. Hak cipta dilindungi.
                </div>
            </div>
        </footer>
    );
}