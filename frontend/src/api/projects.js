
// frontend/src/api/projects.js

// --- API base (inline) ---
const isProd = import.meta.env.MODE === 'production';
const API_BASE = isProd
  ? import.meta.env.VITE_API_BASE_URL     // e.g., https://collinalitics-backend-cj2b.onrender.com/api
  : '/api';                               // dev proxy for localhost:8000

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    ...options,
  });
  let bodyText = '';
  try { bodyText = await res.clone().text(); } catch {}
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${bodyText || res.statusText}`);
  return res.json();
}

// Normalize paginated or flat DRF responses
function toList(data) {
  return Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
}

/**
 * Fetch a single project by slug.
 * Strategy:
 * 1) Try detail-by-slug: /api/portfolio/projects/<slug>/ (requires lookup_field='slug')
 * 2) Try filtered list: /api/portfolio/projects/?slug=<slug>
 * 3) Fallback: full list and find by slug
 */
export async function fetchProject(slug) {
  const safeSlug = encodeURIComponent(slug);

  // 1) detail-by-slug
  try {
    const detailUrl = `${API_BASE}/portfolio/projects/${safeSlug}/`;
    const detail = await fetchJson(detailUrl);
    return detail;
  } catch (err) {
    const msg = String(err.message);
    if (!msg.includes('(404)') && !msg.includes('(405)')) {
      throw err; // real error
    }
    // else continue to fallback attempts
  }

  // 2) filtered list
  try {
    const filteredUrl = `${API_BASE}/portfolio/projects/?slug=${safeSlug}`;
    const filtered = await fetchJson(filteredUrl);
    const list = toList(filtered);
    const found = list.find(p => p.slug === slug);
    if (found) return found;
  } catch {}

  // 3) full list
  const listUrl = `${API_BASE}/portfolio/projects/`;
  const all = await fetchJson(listUrl);
  const list = toList(all);
  const match = list.find(p => p.slug === slug);
  if (match) return match;

  throw new Error('Project not found');
}

/**
 * Fetch projects page (supports DRF pagination).
 * Returns { list, count, next, previous }.
 */
export async function fetchProjectsPage(params = {}) {
  const qs = new URLSearchParams(params);
  const url = `${API_BASE}/portfolio/projects/${qs.toString() ? `?${qs}` : ''}`;
  const data = await fetchJson(url);
  if (Array.isArray(data)) {
    return { list: data, count: data.length, next: null, previous: null };
  }
  return {
    list: Array.isArray(data?.results) ? data.results : [],
    count: typeof data?.count === 'number' ? data.count : 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  };
}

/**
 * Convenience alias to match your existing import:
 * Returns just the list of projects.
 */
export async function fetchProjects(params = {}) {
  const { list } = await fetchProjectsPage(params);
  return list;
}
