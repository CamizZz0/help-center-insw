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
            className="mx-auto mt-[14px] flex h-[51px] w-full max-w-[589px] overflow-hidden rounded-[12px] border border-black bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
        >
            <input
                type="search"
                value={keyword}
                onChange={(event) =>
                    setKeyword(event.target.value)
                }
                placeholder="Cari pertanyaan atau bantuan..."
                className="min-w-0 flex-1 px-3 text-base text-black outline-none placeholder:text-black/40 md:text-[20px]"
            />

            <button
                type="submit"
                aria-label="Cari FAQ"
                className="flex w-[51px] shrink-0 items-center justify-center text-[#02275D] transition hover:bg-blue-50"
            >
                <Search size={23} />
            </button>
        </form>
    );
}