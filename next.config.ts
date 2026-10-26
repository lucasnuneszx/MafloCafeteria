import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Clerk's frontend API lives on a per-instance *.clerk.accounts.dev domain
// (or a custom domain in production); its bot-check widget uses Cloudflare.
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://challenges.cloudflare.com${
    isDev ? " 'unsafe-eval'" : ""
  }`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://img.clerk.com https://*.clerk.accounts.dev",
  "font-src 'self' data:",
  "connect-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "frame-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com https://maps.google.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 90],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Keep the admin CRM out of search engine indexes.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
