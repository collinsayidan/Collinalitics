
const BASE = '/api';

export async function fetchServices() {
  const res = await fetch(`${BASE}/services/`);
  if (!res.ok) throw new Error('Failed to load services');
  return res.json();
}

export async function fetchService(slug) {
  const res = await fetch(`${BASE}/services/${slug}/`);
  if (!res.ok) throw new Error('Failed to load service');
  return res.json();
}
