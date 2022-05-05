import { Menu } from "@headlessui/react";
import { Language } from "prism-react-renderer";
import { FC } from "react";
import { ChevronDown } from "react-feather";
import languages from "../../data/languages.json";
import { useToasts } from "../../hooks/use-toasts.helper";

export interface SyntaxHighlighterControls {
  onLanguageChange: (language: Language) => void;
  language: Language;
  content: string;
}

export const SyntaxHighlighterControls: FC<SyntaxHighlighterControls> = ({ language, content, onLanguageChange }) => {
  const setToast = useToasts();
  const copyContent = () => {
    navigator.clipboard.writeText(content);
    setToast({ text: "Copied file content to clipboard." });
  };

  return (
    <div className="absolute right-0 top-0 flex items-center gap-2">
      <Menu as="div" className="relative">
        <Menu.Button className="text-xs flex items-center gap-1 text-gray-500 hover:text-white transition pt-2 ">
          {language} <ChevronDown className="h-4 w-4" />
        </Menu.Button>
        <Menu.Items className="absolute top-full mt-3 bg-gray-900 text-sm max-h-44 overflow-y-scroll text-xs right-0 rounded">
          {languages.map((language) => (
            <Menu.Item
              as="div"
              key={language.name}
              className="text-gray-400 hover:text-white transition cursor-pointer truncate px-3 py-1 hover:bg-gray-800"
              onClick={() => {
                onLanguageChange(language.key as Language);
              }}
            >
              {language.name}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
      <button className="text-xs text-gray-500 hover:text-white transition pr-3 pt-2" onClick={copyContent}>
        Copy
      </button>
    </div>
  );
};
