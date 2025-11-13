// src/lib/api.ts
const BASE_URL = "http://localhost:5001/api/";

export async function getData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`❌ API ${endpoint} lỗi ${res.status}`);
  return res.json();
}

export async function postData<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`❌ POST ${endpoint} lỗi ${res.status}`);
  return res.json();
}

export async function putData<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`❌ PUT ${endpoint} lỗi ${res.status}`);
  return res.json();
}

export async function deleteData(endpoint: string): Promise<void> {
  const res = await fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`❌ DELETE ${endpoint} lỗi ${res.status}`);
}
