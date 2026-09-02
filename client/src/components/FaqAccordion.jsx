export default function FaqAccordion({ faq, isOpen, onToggle }) {
    return (
        <article
            className={`overflow-hidden rounded-xl border bg-white transition ${isOpen
                    ? "border-blue-500 shadow-sm"
                    : "border-slate-200"
                }`}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 p-5 text-left"
            >
                <div>
                    <p className="text-sm text-blue-600">
                        {faq.category.name} • {faq.subcategory.name} •{" "}
                        {faq.topic.name}
                    </p>

                    <h2 className="mt-2 font-semibold text-slate-900">
                        {faq.question}
                    </h2>
                </div>

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
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
                <div className="border-t border-slate-200 px-5 py-4">
                    <div
                        className="space-y-3 leading-7 text-slate-600"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                </div>
            )}
        </article>
    );
}