import type { PrismTheme } from "prism-react-renderer";

export const theme: PrismTheme = {
  plain: {
    backgroundColor: "black",
    color: "white",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata", "punctuation"],
      style: {
        color: "#6c6783",
      },
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ["tag", "operator", "number"],
      style: {
        color: "#ff0080",
      },
    },
    {
      types: ["function", "parameter", "string"],
      style: {
        color: "var(--atlas-foreground)",
      },
    },
    {
      types: ["tag-id", "selector", "atrule-id"],
      style: {
        color: "#eeebff",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "#c4b9fe",
      },
    },
    {
      types: [
        "boolean",
        "entity",
        "url",
        "attr-value",
        "keyword",
        "control",
        "directive",
        "unit",
        "statement",
        "regex",
        "at-rule",
        "placeholder",
        "variable",
        "property",
      ],
      style: {
        color: "#f079e6",
      },
    },
    {
      types: ["deleted"],
      style: {
        textDecorationLine: "line-through",
      },
    },
    {
      types: ["inserted"],
      style: {
        textDecorationLine: "underline",
      },
    },
    {
      types: ["italic"],
      style: {
        fontStyle: "italic",
      },
    },
    {
      types: ["important", "bold"],
      style: {
        fontWeight: "bold",
      },
    },
    {
      types: ["important"],
      style: {
        color: "#c4b9fe",
      },
    },
  ],
};
