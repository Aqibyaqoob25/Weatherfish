const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function signup(
  username: string,
  email: string,
  password: string,
  hobbies: string[]
) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, hobbies }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(usernameOrEmail: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username_or_email: usernameOrEmail, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function saveToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) {
    throw new Error("NOT_AUTHENTICATED");
  }
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("access_token");
      throw new Error("NOT_AUTHENTICATED");
    }
    throw new Error(await res.text());
  }
  return res.json();
}

export async function updateCurrentUser(data: Record<string, unknown>) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.warn(
      "Logout API call failed, but proceeding with client-side logout"
    );
  }
  localStorage.removeItem("access_token");
}

export async function deleteCurrentUser() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
