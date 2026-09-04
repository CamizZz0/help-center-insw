const API_URL = import.meta.env.VITE_API_URL;

async function request(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error("Gagal mengambil data dari server");
    }

    return response.json();
}

export function getCategories() {
    return request("/categories");
}

export function getSubcategories(categorySlug) {
    return request(
        `/categories/${encodeURIComponent(categorySlug)}/subcategories`
    );
}

export function getTopics(subcategorySlug) {
    return request(
        `/subcategories/${encodeURIComponent(subcategorySlug)}/topics`
    );
}

export function getTopicFaqs(
    topicSlug,
    { page = 1, limit = 6 } = {}
) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    return request(
        `/topics/${encodeURIComponent(topicSlug)}/faqs?${params}`
    );
}

export function getFaqs({
    search = "",
    page = 1,
    limit = 6,
} = {}) {
    const params = new URLSearchParams({
        search,
        page: String(page),
        limit: String(limit),
    });

    return request(`/faqs?${params}`);
}