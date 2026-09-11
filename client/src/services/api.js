const API_URL = import.meta.env.VITE_API_URL;

async function request(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message ?? "Gagal mengambil data dari server");
    }

    return result;
}

function createQuery(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
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
    category = "",
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

    if (category) {
        params.set("category", category);
    }

    return request(`/faqs?${params}`);
}

export function getGuides({
    page = 1,
    limit = 6,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

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
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    return request(`/tutorials?${params}`);
}

export function getTutorialBySlug(slug) {
    return request(
        `/tutorials/${encodeURIComponent(slug)}`
    );
}

export function searchHelpCenter(
    query,
    options = {},
) {
    return request(
        `/search${createQuery({
            q: query,
            page: options.page ?? 1,
            limit: options.limit ?? 6,
        })}`,
    );
}
