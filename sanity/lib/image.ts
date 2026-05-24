import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = client ? imageUrlBuilder(client) : null;

export function urlFor(source: unknown): string {
  if (!builder || !source) return "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder.image(source as any).auto("format").fit("max").url();
}
