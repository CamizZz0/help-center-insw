import "dotenv/config";
import { db, pool } from "../config/db.js";
import { categories } from "../models/schema.js";

const categoryData = [
    {
        name: "Impor & Kepabeanan",
        slug: "impor-kepabeanan",
        description: "Informasi terkait proses impor dan kepabeanan.",
        icon: "package-import",
        sortOrder: 1,
    },
    {
        name: "Ekspor",
        slug: "ekspor",
        description: "Informasi terkait proses dan dokumen ekspor.",
        icon: "package-export",
        sortOrder: 2,
    },
    {
        name: "Registrasi",
        slug: "registrasi",
        description: "Informasi registrasi dan pengelolaan akun INSW.",
        icon: "user-round-plus",
        sortOrder: 3,
    },
    {
        name: "Portal NSW",
        slug: "portal-nsw",
        description: "Informasi penggunaan layanan dan fitur Portal NSW.",
        icon: "globe",
        sortOrder: 4,
    },
];

async function seed() {
    try {
        await db
            .insert(categories)
            .values(categoryData)
            .onConflictDoNothing({
                target: categories.slug,
            });

        console.log("Seed kategori berhasil.");
    } catch (error) {
        console.error("Seed kategori gagal:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

seed();