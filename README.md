
# Collinalitics Monorepo (Django + React)

This repo contains a Django backend and a Vite + React frontend with:
- Services app (Admin + DRF API)
- Portfolio app (simple `Project` model)
- React pages: Home, Services (list & detail with case studies), Portfolio, Blog, About, Contact
- SEO tags via `react-helmet-async`

## Quick start

### 1) Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # create admin user
python manage.py loaddata services/fixtures/services.json  # optional seed
python manage.py runserver  # http://localhost:8000
```

Open http://localhost:8000/admin, edit a **Service**, and add **Related projects**.

### 2) Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173 (proxied to backend /api)
```

## API
- `GET /api/services/` — list services
- `GET /api/services/<slug>/` — service detail (features + projects)
- `GET /api/projects/` — list projects
- `GET /api/projects/<slug>/` — project detail

## SEO
SEO is implemented in `src/pages/Home.jsx` and `src/pages/Services.jsx` using `react-helmet-async`.
Update `src/config/seo.js` with your production domain.

## Deploy notes
- Set `DJANGO_SECRET_KEY` and `DJANGO_ALLOWED_HOSTS` in environment.
- For production, set `VITE_SITE_URL` in your frontend env and serve static build.
- Ensure CORS settings match your deployment (we allow all in dev).
