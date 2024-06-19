import react from "@vitejs/plugin-react";
import { vavite } from "vavite";
import ssr from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  buildSteps: [
    {
      name: "client",
    },
    {
      name: "server",
      config: {
        build: { ssr: true },
      },
    },
  ],
  ssr: {
    noExternal: ["qrcode.react"],
  },
  plugins: [
    react(),
    ssr({ disableAutoFullBuild: true }),
    vavite({
      handlerEntry: "/src/server/index.ts",
      serveClientAssetsInDev: true,
      clientAssetsDir: "dist/client",
    }),
  ],
});
