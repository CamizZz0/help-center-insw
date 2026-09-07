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
            className="mx-auto mt-8 flex max-w-2xl overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
        >
            <input
                type="search"
                value={keyword}
                onChange={(event) =>
                    setKeyword(event.target.value)
                }
                placeholder="Cari pertanyaan atau bantuan..."
                className="min-w-0 flex-1 px-5 py-4 text-slate-900 outline-none"
            />

            <button
                type="submit"
                aria-label="Cari FAQ"
                className="flex w-16 items-center justify-center border-l border-slate-300 text-[#062E6F] transition hover:bg-blue-50"
            >
                <Search size={23} />
            </button>
        </form>
    );
}