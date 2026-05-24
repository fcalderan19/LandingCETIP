import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isConfigured, projectId } from "../env";

export const client: SanityClient | null = isConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published"
    })
  : null;

/** Safe fetch: returns fallback if Sanity is not configured or call fails. */
export async function sanityFetch<T>(opts: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  fallback: T;
}): Promise<T> {
  if (!client) return opts.fallback;
  try {
    const data = await client.fetch<T>(opts.query, opts.params ?? {}, {
      next: { revalidate: 60, tags: opts.tags }
    });
    if (data == null) return opts.fallback;
    if (Array.isArray(data) && data.length === 0) return opts.fallback;
    return data;
  } catch (e) {
    console.error("[sanityFetch] error", e);
    return opts.fallback;
  }
}
