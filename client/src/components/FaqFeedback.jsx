import ContentFeedback from "./ContentFeedback";

/*
 * Feedback khusus FAQ.
 *
 * Implementasinya ada di ContentFeedback supaya FAQ, panduan, dan
 * tutorial memakai blok yang sama; komponen ini hanya mengunci jenis
 * kontennya agar pemanggil lama (FaqAccordion) tidak perlu berubah.
 */
export default function FaqFeedback({ faqId, viewerRole = "guest" }) {
    return (
        <ContentFeedback
            contentType="faq"
            contentId={faqId}
            subject="jawaban"
            viewerRole={viewerRole}
            className="mt-5"
        />
    );
}
