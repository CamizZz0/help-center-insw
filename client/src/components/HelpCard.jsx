import { Phone } from "lucide-react";

export default function HelpCard() {
    return (
        <section className="rounded-xl border border-blue-300 bg-blue-100 p-5 sm:p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Masih Butuh Bantuan?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                    Hubungi Contact Center INSW untuk mendapatkan
                    bantuan lebih lanjut.
                </p>
            </div>

            <a
                href="tel:150679"
                className="mt-5 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#062E6F] px-6 py-3 font-medium text-white transition hover:bg-blue-800 md:mt-0 md:w-auto"
            >
                <Phone size={19} />
                Hubungi Kami
            </a>
        </section>
    );
}