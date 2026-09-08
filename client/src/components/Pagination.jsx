export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (!totalPages || totalPages <= 1) {
        return null;
    }

    const startPage = Math.max(
        1,
        Math.min(currentPage - 2, totalPages - 4)
    );

    const endPage = Math.min(
        totalPages,
        startPage + 4
    );

    const visiblePages = Array.from(
        {
            length: endPage - startPage + 1,
        },
        (_, index) => startPage + index
    );

    return (
        <nav
            aria-label="Pagination FAQ"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                    onPageChange(currentPage - 1)
                }
                className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            >
                <span className="sm:hidden">‹</span>
                <span className="hidden sm:inline">
                    Sebelumnya
                </span>
            </button>

            {visiblePages.map((pageNumber) => (
                <button
                    type="button"
                    key={pageNumber}
                    onClick={() =>
                        onPageChange(pageNumber)
                    }
                    aria-current={
                        currentPage === pageNumber
                            ? "page"
                            : undefined
                    }
                    aria-label={`Halaman ${pageNumber}`}
                    className={`h-10 min-w-10 rounded-lg border px-3 text-sm transition ${currentPage === pageNumber
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
                onClick={() =>
                    onPageChange(currentPage + 1)
                }
                className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            >
                <span className="sm:hidden">›</span>
                <span className="hidden sm:inline">
                    Selanjutnya
                </span>
            </button>
        </nav>
    );
}