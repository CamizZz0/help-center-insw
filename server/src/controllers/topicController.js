import { and, asc, count, eq } from "drizzle-orm";
import { db } from "../config/db.js";
import {
    faqTopics,
    faqs,
} from "../models/schema.js";

export async function getFaqsByTopic(req, res) {
    try {
        const { topicSlug } = req.params;

        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 6);

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 50
        ) {
            return res.status(400).json({
                success: false,
                message: "Parameter pagination tidak valid",
                errors: [
                    {
                        field: "page",
                        message: "Page harus berupa bilangan bulat minimal 1",
                    },
                    {
                        field: "limit",
                        message: "Limit harus bernilai antara 1 sampai 50",
                    },
                ],
            });
        }

        const [topic] = await db
            .select({
                id: faqTopics.id,
                name: faqTopics.name,
                slug: faqTopics.slug,
                description: faqTopics.description,
            })
            .from(faqTopics)
            .where(
                and(
                    eq(faqTopics.slug, topicSlug),
                    eq(faqTopics.isActive, true),
                ),
            )
            .limit(1);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topik FAQ tidak ditemukan",
            });
        }

        const filter = and(
            eq(faqs.topicId, topic.id),
            eq(faqs.isPublished, true),
        );

        const [{ totalItems }] = await db
            .select({
                totalItems: count(),
            })
            .from(faqs)
            .where(filter);

        const offset = (page - 1) * limit;
        const totalPages = Math.ceil(totalItems / limit);

        const faqData = await db
            .select({
                id: faqs.id,
                question: faqs.question,
                answer: faqs.answer,
                isPopular: faqs.isPopular,
                sortOrder: faqs.sortOrder,
            })
            .from(faqs)
            .where(filter)
            .orderBy(asc(faqs.sortOrder))
            .limit(limit)
            .offset(offset);

        return res.status(200).json({
            success: true,
            message: "FAQ berhasil diambil",
            data: {
                topic,
                faqs: faqData,
            },
            meta: {
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    } catch (error) {
        console.error("Gagal mengambil FAQ:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil FAQ",
        });
    }
}