import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * Toast notifikasi kecil untuk demo simulasi role.
 * TODO(auth): toast boleh dipertahankan, tetapi pemicunya harus berasal dari
 * sesi login sungguhan, bukan dari switch simulasi.
 */
export default function Toast({ toastKey, message, durationMs = 3200 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!message) return undefined;

        setVisible(true);
        const hideId = setTimeout(() => setVisible(false), durationMs);

        return () => clearTimeout(hideId);
    }, [toastKey, message, durationMs]);

    if (!message || !visible) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
        >
            <div className="flex items-start gap-2.5 rounded-xl bg-[#062E6F] px-4 py-3 text-white shadow-xl">
                <CheckCircle2 size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-300" />

                <p className="text-sm font-medium leading-6">{message}</p>
            </div>
        </div>
    );
}
