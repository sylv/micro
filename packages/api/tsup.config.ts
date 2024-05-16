import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts", "src/orm.config.ts", "src/migrations/*"],
  outDir: "dist",
  target: "node20",
  format: "esm",
  sourcemap: true,
  clean: true,
  define: {
    "import.meta.vitest": "undefined",
  },
});
