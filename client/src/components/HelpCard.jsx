export default function HelpCard() {
    return (
        <section className="rounded-xl border border-blue-300 bg-blue-100 px-6 py-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                    Masih Butuh Bantuan?
                </h2>

                <p className="mt-2 text-slate-600">
                    Hubungi Contact Center INSW untuk mendapatkan
                    bantuan lebih lanjut.
                </p>
            </div>

            <a
                href="tel:150679"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#062E6F] px-6 py-3 font-medium text-white transition hover:bg-blue-800 md:mt-0"
            >
                <span aria-hidden="true">☎</span>
                Hubungi Kami
            </a>
        </section>
    );
}