import type { Language } from "prism-react-renderer";
import { FiChevronDown } from "react-icons/fi";
import languages from "../../data/languages.json";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createToast } from "../toast/store";
import type { FC } from "react";

interface SyntaxHighlighterControlsProps {
  onLanguageChange: (language: Language) => void;
  language: Language;
  content: string;
}

export const SyntaxHighlighterControls: FC<SyntaxHighlighterControlsProps> = ({
  language,
  content,
  onLanguageChange,
}) => {
  const copyContent = () => {
    navigator.clipboard.writeText(content);
    createToast({ message: "Copied file content to clipboard." });
  };

  return (
    <div className="absolute right-0 top-0 flex items-center gap-2 z-10 bg-black bg-opacity-75 hover:bg-opacity-100 rounded-bl-lg pl-2 pb-2">
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger className="text-xs flex items-center gap-1 text-gray-500 hover:text-white transition pt-2 outline-none">
          {language} <FiChevronDown className="h-4 w-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="absolute top-full mt-3 bg-gray-900 max-h-44 overflow-y-scroll text-xs right-0 rounded">
          {languages.map((language) => (
            <DropdownMenu.Item
              key={language.name}
              className="text-gray-400 hover:text-white transition cursor-pointer truncate px-3 py-1 hover:bg-gray-800 outline-none"
              onClick={() => {
                onLanguageChange(language.key as Language);
              }}
            >
              {language.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <button
        type="button"
        className="text-xs text-gray-500 hover:text-white transition pr-3 pt-2"
        onClick={copyContent}
      >
        Copy
      </button>
    </div>
  );
};
