import { asc, eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { categories } from "../models/schema.js";

export async function getAllCategories(req, res) {
    try {
        const data = await db
            .select()
            .from(categories)
            .where(eq(categories.isActive, true))
            .orderBy(asc(categories.sortOrder));

        res.status(200).json({
            success: true,
            message: "Kategori berhasil diambil",
            data,
        });
    } catch (error) {
        console.error("Gagal mengambil kategori:", error);

        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil kategori",
        });
    }
}