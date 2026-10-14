import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { vavite } from "vavite";
import ssr from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "custom",
  builder: {
    async buildApp(builder) {
      await builder.build(builder.environments.client!);
      await builder.build(builder.environments.ssr!);
    },
  },
  ssr: { noExternal: ["qrcode.react"] },
  plugins: [
    react(),
    tailwindcss(),
    ssr(),
    vavite({ entries: [{ entry: "/src/server/index.ts", order: "post" }] }),
  ],
});
