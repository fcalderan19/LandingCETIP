/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "cdn.sanity.io" }
    ]
  },
  transpilePackages: ["@sanity/visual-editing", "@sanity/ui", "sanity"]
};
export default nextConfig;
