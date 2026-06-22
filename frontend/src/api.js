import { getToken, clearSession } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse(res) {
  if (res.status === 401) {
    clearSession()
    window.location.reload()
    throw new Error('Sesiune expirată. Te rugăm să te autentifici din nou.')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Eroare ${res.status}`)
  }
  return res.json()
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse(res)
}

export async function generatePromotie({ produs, pret, discount, magazine, perioada, imagine }) {
  const form = new FormData()
  form.append('produs', produs)
  form.append('pret', pret)
  form.append('discount', discount)
  form.append('magazine', JSON.stringify(magazine))
  if (perioada) form.append('perioada', perioada)
  form.append('imagine', imagine)

  const res = await fetch(`${BASE_URL}/api/generate/promotie`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  })
  return handleResponse(res)
}

export async function generateAngajare({ post, magazine, cerinte }) {
  const form = new FormData()
  form.append('post', post)
  form.append('magazine', JSON.stringify(magazine))
  if (cerinte) form.append('cerinte', cerinte)

  const res = await fetch(`${BASE_URL}/api/generate/angajare`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  })
  return handleResponse(res)
}

export async function publishPost({ text, image_base64 }) {
  const res = await fetch(`${BASE_URL}/api/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ text, image_base64 }),
  })
  return handleResponse(res)
}
