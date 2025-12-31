
// frontend/src/api/services.js
const isProd = import.meta.env.MODE === 'production';
const API_BASE = isProd ? import.meta.env.VITE_API_BASE_URL : '/api';

function extractPageFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const p = u.searchParams.get('page');
    return p ? parseInt(p, 10) || null : null;
  } catch { return null; }
}

async function j(url) {
  const res = await fetch(url, { credentials: 'include', headers: { Accept: 'application/json' } });
  if (!res.ok) {
    let text = ''; try { text = await res.text(); } catch {}
    throw new Error(`Services request failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

const toList = (d) => Array.isArray(d) ? d : (Array.isArray(d?.results) ? d.results : []);

export async function fetchServicesPage(params = {}) {
  const qs = new URLSearchParams(params);
  const url = `${API_BASE}/services/${qs.toString() ? `?${qs}` : ''}`;
  const data = await j(url);

  if (Array.isArray(data)) {
    const list = data, count = list.length;
    const page = parseInt(params.page || '1', 10) || 1;
    const pageSize = list.length;
    return { list, count, next: null, previous: null, page, pageSize, totalPages: 1 };
  }

  const list = toList(data);
  const count = typeof data?.count === 'number' ? data.count : list.length;
  const next = data?.next ?? null;
  const previous = data?.previous ?? null;

  const prevPage = extractPageFromUrl(previous);
  const nextPage = extractPageFromUrl(next);
  const pageParam = params.page ? parseInt(params.page, 10) || 1
    : (prevPage ? prevPage + 1 : (nextPage ? nextPage - 1 : 1));
  const page = pageParam || 1;

  const pageSize = list.length || (typeof data?.page_size === 'number' ? data.page_size : 9);
  const totalPages = Math.max(1, Math.ceil((count || 0) / (pageSize || 9)));

  return { list, count, next, previous, page, pageSize, totalPages };
}

export async function fetchService(slug) {
  const s = encodeURIComponent(slug);
  try {
    return await j(`${API_BASE}/services/${s}/`);
  } catch {
    const { list } = await fetchServicesPage();
    return list.find(x => x.slug === slug) ?? null;
  }
}

export async function fetchRelatedServices({ category, excludeSlug, limit = 3 } = {}) {
  if (!category) return [];
  try {
    const { list } = await fetchServicesPage({ category, page: 1 });
    return list.filter(s => s.slug !== excludeSlug).slice(0, limit);
  } catch {
    const { list } = await fetchServicesPage();
    return list
      .filter(s =>
        (s.slug !== excludeSlug) &&
        (String(s.category || s.category_name || s.category_slug || '').toLowerCase()
          === String(category).toLowerCase())
      )
      .slice(0, limit);
  }
}
