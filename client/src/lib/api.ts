import { api } from "../shared/routes";

export async function fetchAPI<T = any>(url: string, opts?: RequestInit): Promise<T> {
  const r = await fetch(url, {
    credentials: "include",
    ...opts,
    headers: {
      ...(opts?.headers || {}),
      "Content-Type": "application/json",
    },
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}