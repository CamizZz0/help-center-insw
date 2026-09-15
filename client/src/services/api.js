const API_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
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

export function getTopics(subcategorySlug, { viewerRole } = {}) {
    // SIMULASI DEMO: hitungan FAQ per topik mengikuti role.
    // TODO(auth): hapus setelah backend memakai sesi/JWT.
    const params = new URLSearchParams();

    if (viewerRole) params.set("viewerRole", viewerRole);

    const query = params.toString();

    return request(
        `/subcategories/${encodeURIComponent(subcategorySlug)}/topics${query ? `?${query}` : ""}`
    );
}

export function getTopicFaqs(
    topicSlug,
    { page = 1, limit = 6, viewerRole } = {}
) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    // SIMULASI DEMO: diteruskan sebagai ?viewerRole= ke API.
    // TODO(auth): hapus setelah backend memakai sesi/JWT.
    if (viewerRole) params.set("viewerRole", viewerRole);

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
    viewerRole,
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

    // SIMULASI DEMO: diteruskan sebagai ?viewerRole= ke API.
    // TODO(auth): hapus setelah backend memakai sesi/JWT.
    if (viewerRole) {
        params.set("viewerRole", viewerRole);
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
            // SIMULASI DEMO — TODO(auth): hapus setelah ada sesi/JWT.
            viewerRole: options.viewerRole,
        })}`,
    );
}

export function submitFaqFeedback(id, payload) {
    return request(`/faqs/${encodeURIComponent(id)}/feedback`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
