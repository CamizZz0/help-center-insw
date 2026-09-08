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
    popular,
    page = 1,
    limit = 6,
} = {}) {
    const params = new URLSearchParams({
        search,
        page: String(page),
        limit: String(limit),
    });

    if (typeof popular === "boolean") {
        params.set("popular", String(popular));
    }

    return request(`/faqs?${params}`);
}

export function getGuides({
    page = 1,
    limit = 6,
    category = "",
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (category) {
        params.set("category", category);
    }

    return request(`/guides?${params}`);
}

export function getGuideBySlug(slug) {
    return request(
        `/guides/${encodeURIComponent(slug)}`
    );
}

export function getTutorials({
    page = 1,
    limit = 6,
    category = "",
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (category) {
        params.set("category", category);
    }

    return request(`/tutorials?${params}`);
}

export function getTutorialBySlug(slug) {
    return request(
        `/tutorials/${encodeURIComponent(slug)}`
    );
}