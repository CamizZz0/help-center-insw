export default function CategoryHero({ categoryName }) {
    return (
        <section className="bg-[#EFF7FF]">
            <div className="mx-auto max-w-7xl px-6 py-16 text-center">
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                    {categoryName}
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Temukan informasi dan jawaban seputar layanan{" "}
                    {categoryName}.
                </p>
            </div>
        </section>
    );
}