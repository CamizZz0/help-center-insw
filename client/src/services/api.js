const API_URL = import.meta.env.VITE_API_URL;

export async function getFaqs({
    search = "",
    page = 1,
    limit = 6,
} = {}) {
    const params = new URLSearchParams({
        search,
        page: String(page),
        limit: String(limit),
    });

    const response = await fetch(`${API_URL}/faqs?${params}`);

    if (!response.ok) {
        throw new Error("Gagal mengambil data FAQ");
    }

    return response.json();
}