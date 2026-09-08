import { Search, X } from "lucide-react";

export default function SearchBar({
    value,
    onChange,
    onClear,
    placeholder = "Cari pertanyaan...",
}) {
    return (
        <div className="relative w-full">
            <Search
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                type="search"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                aria-label={placeholder}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:text-base"
            />

            {value && (
                <button
                    type="button"
                    onClick={onClear}
                    aria-label="Hapus pencarian"
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}