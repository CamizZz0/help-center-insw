import "dotenv/config";
import fs from "node:fs/promises";
import sanitizeHtml from "sanitize-html";
import { eq } from "drizzle-orm";
import { db, pool } from "../config/db.js";
import {
    subcategories,
    faqTopics,
    faqs,
} from "../models/schema.js";

const filePath = new URL(
    "../data/import/pib.json",
    import.meta.url,
);

const topicNameMapping = {
    "Penjelasan PIB": {
        name: "Pendahuluan PIB",
        slug: "pendahuluan-pib",
    },
    "Tracking PIB": {
        name: "Tracking PIB",
        slug: "tracking-pib",
    },
    "Reject Dokumen": {
        name: "Reject Dokumen",
        slug: "reject-dokumen-pib",
    },
};

function cleanAnswer(html) {
    return sanitizeHtml(html || "", {
        allowedTags: [
            "p",
            "br",
            "strong",
            "b",
            "em",
            "i",
            "ul",
            "ol",
            "li",
            "a",
        ],

        allowedAttributes: {
            a: ["href", "target", "rel"],
        },

        allowedSchemes: ["http", "https", "mailto"],

        transformTags: {
            a: (tagName, attributes) => ({
                tagName,
                attribs: {
                    ...attributes,
                    target: "_blank",
                    rel: "noopener noreferrer",
                },
            }),
        },
    });
}

async function importFaqs() {
    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const payload = JSON.parse(fileContent);

        if (payload.code !== "01" || !Array.isArray(payload.data)) {
            throw new Error("Format response PIB tidak valid.");
        }

        let importedTopics = 0;
        let importedFaqs = 0;

        await db.transaction(async (tx) => {
            for (const sourceSubcategory of payload.data) {
                const [localSubcategory] = await tx
                    .select({
                        id: subcategories.id,
                    })
                    .from(subcategories)
                    .where(eq(subcategories.slug, "pib"))
                    .limit(1);

                if (!localSubcategory) {
                    throw new Error(
                        "Subkategori PIB belum tersedia. Jalankan db:seed dahulu.",
                    );
                }

                await tx
                    .update(subcategories)
                    .set({
                        sourceId: sourceSubcategory.kd_kategori_faq,
                        updatedAt: new Date(),
                    })
                    .where(eq(subcategories.id, localSubcategory.id));

                for (const [topicIndex, sourceTopic] of (
                    sourceSubcategory.subkategori || []
                ).entries()) {
                    const faqList = sourceTopic.listFaq || [];

                    // Topik kosong seperti Analis Point tidak dimasukkan.
                    if (faqList.length === 0) {
                        continue;
                    }

                    const mappedTopic = topicNameMapping[sourceTopic.ur] || {
                        name: sourceTopic.ur,
                        slug: `topik-${sourceTopic.kd_subkategori_faq}`,
                    };

                    const [savedTopic] = await tx
                        .insert(faqTopics)
                        .values({
                            sourceId: sourceTopic.kd_subkategori_faq,
                            subcategoryId: localSubcategory.id,
                            name: mappedTopic.name,
                            slug: mappedTopic.slug,
                            description: `Informasi mengenai ${mappedTopic.name}.`,
                            sortOrder: topicIndex + 1,
                            isActive: true,
                        })
                        .onConflictDoUpdate({
                            target: faqTopics.slug,
                            set: {
                                sourceId: sourceTopic.kd_subkategori_faq,
                                subcategoryId: localSubcategory.id,
                                name: mappedTopic.name,
                                description: `Informasi mengenai ${mappedTopic.name}.`,
                                sortOrder: topicIndex + 1,
                                isActive: true,
                                updatedAt: new Date(),
                            },
                        })
                        .returning({
                            id: faqTopics.id,
                        });

                    importedTopics += 1;

                    for (const [faqIndex, sourceFaq] of faqList.entries()) {
                        const rawAnswer =
                            sourceFaq.jawaban || sourceFaq.ur || "";

                        await tx
                            .insert(faqs)
                            .values({
                                sourceId: sourceFaq.id_pusatbantuan,
                                topicId: savedTopic.id,
                                question: sourceFaq.header.trim(),
                                answer: cleanAnswer(rawAnswer),
                                isPopular: false,
                                sortOrder: faqIndex + 1,
                                isPublished: true,
                            })
                            .onConflictDoUpdate({
                                target: faqs.sourceId,
                                set: {
                                    topicId: savedTopic.id,
                                    question: sourceFaq.header.trim(),
                                    answer: cleanAnswer(rawAnswer),
                                    sortOrder: faqIndex + 1,
                                    isPublished: true,
                                    updatedAt: new Date(),
                                },
                            });

                        importedFaqs += 1;
                    }
                }
            }
        });

        console.log("Import FAQ PIB berhasil.");
        console.log(`Topik diproses: ${importedTopics}`);
        console.log(`FAQ diproses: ${importedFaqs}`);
    } catch (error) {
        console.error("Import FAQ gagal:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

importFaqs();