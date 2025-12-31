
// frontend/src/api/blog.js
const isProd = import.meta.env.MODE === 'production';
const API_BASE = isProd ? import.meta.env.VITE_API_BASE_URL : '/api';

function extractPageFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const p = u.searchParams.get('page');
    return p ? parseInt(p, 10) || null : null;
  } catch {
    return null;
  }
}

async function j(url) {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    let text = '';
    try { text = await res.text(); } catch {}
    throw new Error(`Blog request failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

const toList = (d) => Array.isArray(d) ? d : (Array.isArray(d?.results) ? d.results : []);

/**
 * Fetch a page of posts (supports DRF pagination).
 * Returns shape: { list, count, next, previous, page, pageSize, totalPages }
 */
export async function fetchPostsPage(params = {}) {
  const qs = new URLSearchParams(params);
  const url = `${API_BASE}/blog/posts/${qs.toString() ? `?${qs}` : ''}`;
  const data = await j(url);

  if (Array.isArray(data)) {
    // Non-paginated array fallback
    const list = data;
    const count = list.length;
    const page = parseInt(params.page || '1', 10) || 1;
    const pageSize = list.length; // unknown; treat full list as one page
    return { list, count, next: null, previous: null, page, pageSize, totalPages: 1 };
  }

  const list = Array.isArray(data?.results) ? data.results : [];
  const count = typeof data?.count === 'number' ? data.count : list.length;
  const next = data?.next ?? null;
  const previous = data?.previous ?? null;

  // Try to infer page and pageSize
  const pageParam = params.page ? parseInt(params.page, 10) || 1 : (previous ? extractPageFromUrl(previous) + 1 : (next ? extractPageFromUrl(next) - 1 : 1));
  const page = pageParam || 1;

  // DRF doesn't include page_size by default, so infer from current results length
  const pageSize = list.length || (typeof data?.page_size === 'number' ? data.page_size : 10);
  const totalPages = Math.max(1, Math.ceil((count || 0) / (pageSize || 10)));

  return { list, count, next, previous, page, pageSize, totalPages };
}

/**
 * Fetch a single post by slug.
 * 1) Try detail: /api/blog/posts/<slug>/
 * 2) Fallback:  /api/blog/posts/?slug=<slug> then find
 */
export async function fetchPost(slug) {
  const s = encodeURIComponent(slug);
  // detail-by-slug first
  try {
    return await j(`${API_BASE}/blog/posts/${s}/`);
  } catch {
    const data = await j(`${API_BASE}/blog/posts/?slug=${s}`);
    return toList(data).find(p => p.slug === slug) ?? null;
  }
}
