import { VIEWER_ROLES, VIEWER_ROLE_LABELS } from "../utils/viewerRole";

/**
 * Switch simulasi role pembaca untuk presentasi/demo.
 * BUKAN login — hanya mengganti filter tampilan FAQ.
 * TODO(auth): hapus komponen ini setelah autentikasi resmi tersedia dan
 * ganti dengan role dari sesi pengguna yang terautentikasi.
 */
export default function RoleSimulator({ viewerRole, onChange }) {
    return (
        <div className="bg-white">
            <div
                role="group"
                aria-label="Simulasi role pembaca (demo)"
                className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-3 sm:px-6 lg:px-8"
            >
                <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                    DEMO — simulasi akses, bukan login
                </span>

                <span className="hidden text-xs text-slate-500 sm:inline">
                    Pilih mode pembaca:
                </span>

                {VIEWER_ROLES.map((role) => {
                    const active = viewerRole === role;
                    return (
                        <button
                            key={role}
                            type="button"
                            onClick={() => onChange?.(role)}
                            aria-pressed={active}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                                active
                                    ? "bg-[#062E6F] text-white"
                                    : "border border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-700"
                            }`}
                        >
                            {VIEWER_ROLE_LABELS[role]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
