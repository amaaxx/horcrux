const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function supabaseFetch(endpoint: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase credentials");
  }

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };

  if (options.method === "POST" || options.method === "PATCH") {
    headers["Prefer"] = "return=minimal";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Supabase request failed");
  }

  // For GET requests, we usually want the data back
  if (options.method === "GET" || !options.method) {
    return response.json();
  }

  return response;
}
