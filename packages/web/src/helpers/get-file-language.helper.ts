import languages from "../data/languages.json";

export type Language = typeof languages[number];

export function getFileLanguage(fileName?: string): Language | undefined {
  if (!fileName) return;
  const extensionIndex = fileName.lastIndexOf(".");
  if (extensionIndex !== -1) {
    const extension = fileName.slice(extensionIndex + 1);
    for (const language of languages) {
      if (language.extensions.includes(extension)) return language;
      if (language.filenames?.includes(fileName)) return language;
      if (language.key === extension) return language;
    }
  }

  return languages.find((language) => language.key === fileName);
}
