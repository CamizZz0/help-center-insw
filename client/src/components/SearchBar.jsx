export default function SearchBar({ value, onChange, onClear }) {
    return (
        <div className="relative mt-6 max-w-xl">
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Cari pertanyaan seputar impor"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {value && (
                <button
                    type="button"
                    onClick={onClear}
                    aria-label="Hapus pencarian"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-500"
                >
                    ×
                </button>
            )}
        </div>
    );
}