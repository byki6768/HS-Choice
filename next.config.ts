import type { NextConfig } from "next";

function supabaseImagePattern() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return [];
  }

  try {
    const { hostname, protocol } = new URL(supabaseUrl);

    return [
      {
        protocol: (protocol.replace(":", "") || "https") as "http" | "https",
        hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...supabaseImagePattern(),
    ],
  },
};

export default nextConfig;
