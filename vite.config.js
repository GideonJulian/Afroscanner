import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";   // keep Tailwind
import { VitePWA } from "vite-plugin-pwa";     // add PWA

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),         // tailwind plugin
    VitePWA({
      manifest: {
        name: "AfroScanner",
        short_name: "AfroScan",
        description: "Scan and manage event tickets",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any"
          }
        ]
      }
    })

  ],
});
