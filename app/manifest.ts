import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "THE RETURN - Daily Ledger",
    short_name: "THE RETURN",
    description: "A private discipline ledger that tells the truth at 9 PM.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
