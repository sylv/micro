import { Language } from "prism-react-renderer";

const EXT_LANGUAGE_MAP = new Map<string, Language | string>();
EXT_LANGUAGE_MAP.set("ejs", "html");
EXT_LANGUAGE_MAP.set("html", "html");
EXT_LANGUAGE_MAP.set("md", "markdown");
EXT_LANGUAGE_MAP.set("js", "javascript");
EXT_LANGUAGE_MAP.set("ts", "typescript");
EXT_LANGUAGE_MAP.set("jsx", "jsx");
EXT_LANGUAGE_MAP.set("tsx", "tsx");
EXT_LANGUAGE_MAP.set("py", "python");
EXT_LANGUAGE_MAP.set("json", "json");
EXT_LANGUAGE_MAP.set("yaml", "yaml");
EXT_LANGUAGE_MAP.set("yml", "yaml");
EXT_LANGUAGE_MAP.set("css", "css");
EXT_LANGUAGE_MAP.set("sass", "sass");
EXT_LANGUAGE_MAP.set("scss", "scss");
EXT_LANGUAGE_MAP.set("sql", "sql");
EXT_LANGUAGE_MAP.set("sh", "bash");
EXT_LANGUAGE_MAP.set("wasm", "wasm");
EXT_LANGUAGE_MAP.set("makefile", "makefile");
EXT_LANGUAGE_MAP.set("less", "less");
EXT_LANGUAGE_MAP.set("gql", "graphql");
EXT_LANGUAGE_MAP.set("go", "go");
EXT_LANGUAGE_MAP.set("h", "c");
EXT_LANGUAGE_MAP.set("coffee", "coffeescript");

export function getLanguage(fileName: string): any {
  const ext = fileName.split(".").pop();
  if (ext) return EXT_LANGUAGE_MAP.get(ext);
}
