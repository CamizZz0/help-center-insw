export default function FaqAccordion({
    faq,
    isOpen,
    onToggle,
}) {
    return (
        <article
            className={`min-w-0 overflow-hidden rounded-xl border bg-white transition ${isOpen
                    ? "border-blue-500 shadow-sm"
                    : "border-slate-200"
                }`}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 p-4 text-left sm:gap-6 sm:p-5"
            >
                <div className="min-w-0 flex-1">
                    <p className="break-words text-xs leading-5 text-blue-600 sm:text-sm">
                        {faq.category?.name} •{" "}
                        {faq.subcategory?.name} •{" "}
                        {faq.topic?.name}
                    </p>

                    <h2 className="mt-1.5 break-words text-sm font-semibold leading-6 text-slate-900 sm:mt-2 sm:text-base">
                        {faq.question}
                    </h2>
                </div>

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                >
                    <path
                        d="m6 9 6 6 6-6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="border-t border-slate-200 px-4 py-4 sm:px-5">
                    <div
                        className="break-words text-sm leading-7 text-slate-600 sm:text-base [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_img]:h-auto [&_img]:max-w-full"
                        dangerouslySetInnerHTML={{
                            __html: faq.answer,
                        }}
                    />
                </div>
            )}
        </article>
    );
}