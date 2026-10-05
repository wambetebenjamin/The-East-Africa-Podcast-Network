/**
 * Vercel KV access via its REST API (KV_REST_API_URL + KV_REST_API_TOKEN).
 * Falls back to an in-process store when KV is not configured (local/demo),
 * so every API route works out of the box.
 */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
export const kvConfigured = Boolean(KV_URL && KV_TOKEN);

const memory = new Map<string, string>();

export async function kvGet<T>(key: string): Promise<T | null> {
  if (!kvConfigured) {
    const raw = memory.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  try {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result: string | null };
    if (json.result == null) return null;
    const parsed = JSON.parse(json.result);
    return (parsed as T) ?? null;
  } catch {
    return null;
  }
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  if (!kvConfigured) {
    memory.set(key, JSON.stringify(value));
    return;
  }
  try {
    await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.stringify(value)),
    });
  } catch {
    /* network failure — caller proceeds */
  }
}

export async function kvList(prefix: string): Promise<string[]> {
  if (!kvConfigured) {
    return [...memory.keys()].filter((k) => k.startsWith(prefix));
  }
  try {
    const res = await fetch(`${KV_URL}/keys/${encodeURIComponent(prefix)}*`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { result: string[] };
    return json.result ?? [];
  } catch {
    return [];
  }
}
