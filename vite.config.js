import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"], // plus any static logos
      manifest: {
        name: "AfroScanner",
        short_name: "AfroScan",
        description: "Scan and manage event tickets",
        start_url: "/",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#000000",
        scope: "/",          // optional but good to add
        lang: "en",          // optional metadata
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          // maskable icon helps Android adapt shape
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
});
