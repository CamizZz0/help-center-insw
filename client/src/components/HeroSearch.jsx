import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSearch({
    initialValue = "",
}) {
    const [keyword, setKeyword] = useState(initialValue);
    const navigate = useNavigate();

    useEffect(() => {
        setKeyword(initialValue);
    }, [initialValue]);

    function handleSubmit(event) {
        event.preventDefault();

        const query = keyword.trim();

        if (!query) return;

        navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            className="mx-auto mt-6 flex w-full max-w-2xl overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 sm:mt-8"
        >
            <input
                type="search"
                value={keyword}
                onChange={(event) =>
                    setKeyword(event.target.value)
                }
                placeholder="Cari pertanyaan atau bantuan..."
                aria-label="Cari pertanyaan atau bantuan"
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:px-5 sm:py-4 sm:text-base"
            />

            <button
                type="submit"
                aria-label="Cari FAQ"
                className="flex w-14 shrink-0 items-center justify-center border-l border-slate-300 text-[#062E6F] transition hover:bg-blue-50 sm:w-16"
            >
                <Search size={22} />
            </button>
        </form>
    );
}