import type { Options } from "tsup";
export const tsup: Options = {
  splitting: false,
  sourcemap: true,
  minify: true,
  dts: false,
  clean: true,
  ignoreWatch: ["**/{.next,example,data}/**", "next-env.d.ts"],
  outDir: ".next/api",
  entryPoints: ["src/main.ts"],
};
