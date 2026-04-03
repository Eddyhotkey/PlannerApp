const API_BASE = import.meta.env.VITE_API_BASE

if (!API_BASE) {
  throw new Error('VITE_API_BASE ist nicht gesetzt')
}

async function apiRequest(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (error) {
    throw new Error('Backend nicht erreichbar. Prüfe, ob der PHP-Server läuft.')
  }

  let data = {}

  try {
    data = await response.json()
  } catch {
    throw new Error('Ungültige JSON-Antwort vom Server')
  }

  if (!response.ok) {
    throw new Error(data.message || 'API-Fehler')
  }

  return data
}

export async function fetchEntriesByDate(date) {
  return apiRequest(`/entries.php?date=${date}`)
}

export async function createEntry(payload) {
  return apiRequest('/entry-create.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateEntry(payload) {
  return apiRequest('/entry-update.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deleteEntry(id) {
  return apiRequest('/entry-delete.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

export async function login(payload) {
  return apiRequest('/login.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function logout() {
  return apiRequest('/logout.php', {
    method: 'POST',
  })
}

export async function fetchSession() {
  return apiRequest('/session.php')
}
