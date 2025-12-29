
const BASE = '/api';

export async function fetchServices() {
  const res = await fetch(`${BASE}/services/`);
  if (!res.ok) throw new Error('Failed to load services');
  const data = await res.json();
  // handle paginated as well
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export async function fetchService(slug) {
  const res = await fetch(`${BASE}/services/${slug}/`);
  if (!res.ok) throw new Error('Failed to load service');
  return res.json();
}
