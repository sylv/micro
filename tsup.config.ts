import { esbuildDecorators } from "@anatine/esbuild-decorators";
import type { Options } from "tsup";

const TSCONFIG_NAME = "./tsconfig.server.json";
const TSCONFIG = require(TSCONFIG_NAME);

export const tsup: Options = {
  sourcemap: true,
  minify: false,
  dts: false,
  clean: true,
  ignoreWatch: ["**/{.next,example,data}/**", "**/*.tsx", "next-env.d.ts"],
  outDir: TSCONFIG.compilerOptions.outDir,
  entryPoints: ["src/main.ts"],
  esbuildPlugins: [
    esbuildDecorators({
      tsconfig: TSCONFIG_NAME,
    }),
  ],
};
