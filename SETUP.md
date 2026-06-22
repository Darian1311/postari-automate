# Setup Postări Automate

## 1. Facebook — Page Access Token

1. Mergi la https://developers.facebook.com → creează App
2. Adaugă produsul "Facebook Login for Business"
3. Mergi la Graph API Explorer → selectează pagina ta → generează token
4. Permisiuni necesare: `pages_manage_posts`, `pages_read_engagement`
5. Extinde tokenul la long-lived (60 zile): folosește Graph API Explorer
6. Salvează: PAGE_ID și PAGE_ACCESS_TOKEN

## 2. Anthropic API Key

1. Mergi la https://console.anthropic.com
2. API Keys → Create Key
3. Salvează key-ul (apare o singură dată)

## 3. Backend — Deploy pe Render

1. Pune folderul `backend/` pe GitHub (repo separat sau subfolder)
2. Render.com → New Web Service → conectează repo
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables:
   - `ANTHROPIC_API_KEY` = key-ul tău
   - `FACEBOOK_PAGE_ID` = ID-ul paginii
   - `FACEBOOK_PAGE_ACCESS_TOKEN` = tokenul de acces
6. Copiază URL-ul serviciului (ex: https://postari-automate-api.onrender.com)

## 4. Frontend — Deploy pe Vercel

1. Pune folderul `frontend/` pe GitHub
2. Vercel.com → New Project → conectează repo
3. Environment Variables:
   - `VITE_API_URL` = URL-ul de la Render (pasul 3.6)
4. Deploy

## 5. Test local

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # completează cu valorile reale
uvicorn main:app --reload

# Frontend (alt terminal)
cd frontend
npm install
cp .env.example .env.local  # pune URL-ul backend local
npm run dev
```
