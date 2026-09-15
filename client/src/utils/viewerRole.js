import { useCallback, useEffect, useState } from "react";

/**
 * Simulasi role pembaca untuk frontend publik.
 *
 * PENTING: ini HANYALAH simulasi/demo dan BUKAN autentikasi.
 * - Nilai default "guest" (atau `VITE_VIEWER_ROLE` saat development).
 * - Filter di frontend dapat di-bypass pengguna; setelah autentikasi resmi
 *   tersedia, filtering berbasis role WAJIB dipindahkan ke backend
 *   (lihat `viewerRole` di API + TODO(auth)).
 *
 * Cara mengganti role untuk demo:
 * 1. Development switch (komponen RoleSimulator) — tersimpan di localStorage
 *    kunci "insw-viewer-role".
 * 2. Konstanta env: `VITE_VIEWER_ROLE=guest|authenticated` di `.env`.
 * 3. Programmatic: `setViewerRole("authenticated")` dari modul ini.
 */

export const VIEWER_ROLES = ["guest", "authenticated"];

export const VIEWER_ROLE_LABELS = {
    guest: "Guest",
    authenticated: "User login (simulasi)",
};

const STORAGE_KEY = "insw-viewer-role";

function readInitialRole() {
    const fromEnv = String(import.meta.env.VITE_VIEWER_ROLE ?? "")
        .trim()
        .toLowerCase();
    if (VIEWER_ROLES.includes(fromEnv)) return fromEnv;

    try {
        const stored = String(
            localStorage.getItem(STORAGE_KEY) ?? "",
        )
            .trim()
            .toLowerCase();
        if (VIEWER_ROLES.includes(stored)) return stored;
    } catch {
        // localStorage tidak tersedia — abaikan.
    }

    return "guest";
}

export function normalizeViewerRole(value) {
    const normalized = String(value ?? "").trim().toLowerCase();
    return VIEWER_ROLES.includes(normalized) ? normalized : "guest";
}

export function normalizeVisibility(value) {
    const normalized = String(value ?? "").trim().toLowerCase();
    return ["public", "authenticated"].includes(normalized)
        ? normalized
        : "public";
}

/**
 * Aturan tampil (SIMULASI frontend — jangan dianggap pengaman):
 * - guest: published + visibility "public"
 * - authenticated: published + "public"/"authenticated"
 */
export function canViewerSeeFaq(faq, viewerRole = "guest") {
    const role = normalizeViewerRole(viewerRole);
    const visibility = normalizeVisibility(faq?.visibility);
    const isPublished = faq?.isPublished ?? faq?.is_published ?? true;

    if (!isPublished) return false;
    if (role === "authenticated") {
        return visibility === "public" || visibility === "authenticated";
    }
    return visibility === "public";
}

export function filterFaqsForViewer(faqs = [], viewerRole = "guest") {
    if (!Array.isArray(faqs)) return [];
    return faqs.filter((faq) => canViewerSeeFaq(faq, viewerRole));
}

/**
 * Pesan toast saat role demo diganti (SIMULASI — TODO(auth): picu dari
 * sesi login sungguhan setelah tersedia).
 */
export function roleToastMessage(nextRole, unlockedCount = 0) {
    const role = normalizeViewerRole(nextRole);

    if (role === "authenticated" && unlockedCount > 0) {
        return `Akses diperbarui — ${unlockedCount} FAQ tambahan sekarang tersedia.`;
    }

    if (role === "authenticated") {
        return "Mode pengguna terdaftar — menampilkan FAQ public dan khusus pengguna.";
    }

    return "Mode guest — menampilkan FAQ public.";
}

/**
 * Hook React untuk role simulasi. Perubahan tersimpan ke localStorage
 * sehingga mudah didemo tanpa halaman login.
 */
export function useViewerRole() {
    const [viewerRole, setViewerRoleState] = useState(readInitialRole);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, viewerRole);
        } catch {
            // abaikan
        }
    }, [viewerRole]);

    const setViewerRole = useCallback((next) => {
        setViewerRoleState(normalizeViewerRole(next));
    }, []);

    return [viewerRole, setViewerRole];
}
