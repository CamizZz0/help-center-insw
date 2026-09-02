export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (totalPages <= 1) return null;

    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    return (
        <nav
            aria-label="Pagination FAQ"
            className="mt-8 flex items-center justify-center gap-2"
        >
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
                Sebelumnya
            </button>

            {pages.map((pageNumber) => (
                <button
                    type="button"
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    aria-current={
                        currentPage === pageNumber ? "page" : undefined
                    }
                    className={`h-10 min-w-10 rounded-lg border px-3 text-sm ${currentPage === pageNumber
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                >
                    {pageNumber}
                </button>
            ))}

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
                Selanjutnya
            </button>
        </nav>
    );
}