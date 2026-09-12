import {
    BadgeCheck,
    Building,
    ClipboardCheck,
    FileCheck,
    FileText,
    Folder,
    Globe,
    LayoutGrid,
    Monitor,
    Package,
    UserRoundPlus,
} from "lucide-react";

/*
 * Kolom icon lama menyimpan nama ikon dalam kebab-case.
 * Nilai di bawah mencakup seluruh data yang sudah ada
 * beserta pilihan ikon pada form CMS.
 *
 * "package-import", "package-export", dan "monitor-globe"
 * bukan nama ikon lucide yang valid sehingga dipetakan ke
 * ikon terdekat.
 */
const LEGACY_ICONS = {
    "badge-check": BadgeCheck,
    building: Building,
    "clipboard-check": ClipboardCheck,
    "file-check": FileCheck,
    "file-text": FileText,
    folder: Folder,
    globe: Globe,
    "layout-grid": LayoutGrid,
    "monitor-globe": Monitor,
    "package-export": Package,
    "package-import": Package,
    "user-round-plus": UserRoundPlus,
};

/*
 * Menampilkan ikon hasil upload bila tersedia. Bila belum
 * ada, ikon lucide lama dipakai sebagai fallback.
 */
export default function ContentIcon({
    iconUrl,
    iconName,
    alt = "",
    size = 24,
    className = "",
}) {
    if (iconUrl) {
        return (
            <img
                src={iconUrl}
                alt={alt}
                loading="lazy"
                className={`object-contain ${className}`}
            />
        );
    }

    const Icon =
        LEGACY_ICONS[
            String(iconName ?? "")
                .trim()
                .toLowerCase()
        ] ?? LayoutGrid;

    return (
        <Icon
            size={size}
            strokeWidth={1.8}
            aria-hidden="true"
            className={className}
        />
    );
}
