
// frontend/src/api/projects.js
const BASE = '/api';

export async function fetchProjects() {
  const res = await fetch(`${BASE}/projects/`);
  if (!res.ok) throw new Error('Failed to load projects');
  const data = await res.json();
  // Support both paginated and flat responses
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export async function fetchProject(slug) {
  const res = await fetch(`${BASE}/projects/${slug}/`);
  if (!res.ok) throw new Error('Failed to load project');
  return res.json();
}
