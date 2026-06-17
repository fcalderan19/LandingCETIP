/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Browser MIME-sniff protections.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block embedding the site in frames from other origins (anti-clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Don't leak full URL on cross-origin requests.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict powerful browser APIs.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Force HTTPS for two years incl. subdomains.
  // Active in production only — Vercel terminates TLS upstream.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Vercel Blob (las imágenes que subís en /admin/media).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  transpilePackages: ["@sanity/visual-editing", "@sanity/ui", "sanity"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // Don't expose framework version to attackers fingerprinting.
  poweredByHeader: false,
};
export default nextConfig;
