const BASE_URL = import.meta.env.VITE_API_BASE_URL

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    throw new Error('Request failed')
  }
  if (res.status === 204) {
    return null as unknown as T
  }
  return res.json() as Promise<T>
}

export function login(email: string, password: string) {
  return request<{ token: string; user: any }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export default { request, login }
