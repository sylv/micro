import languages from "../data/languages.json";

export function getLanguage(fileName: string) {
  const extIndex = fileName.lastIndexOf(".");
  if (extIndex !== -1) {
    const ext = fileName.substr(extIndex + 1);
    for (const language of languages) {
      if (language.extensions?.includes(ext)) return language;
      if (language.filenames?.includes(fileName)) return language;
      if (language.key === ext) return language;
    }
  }

  return languages.find((language) => language.key === fileName);
}
