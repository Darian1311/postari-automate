const KEY = 'pa_token'
const USER_KEY = 'pa_user'

export function saveSession(token, username) {
  sessionStorage.setItem(KEY, token)
  sessionStorage.setItem(USER_KEY, username)
}

export function getToken() {
  return sessionStorage.getItem(KEY)
}

export function getUsername() {
  return sessionStorage.getItem(USER_KEY)
}

export function clearSession() {
  sessionStorage.removeItem(KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function isLoggedIn() {
  return !!getToken()
}
