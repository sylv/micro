import { Themes } from "@geist-ui/react";

export const GEIST_THEME = Themes.createFromDark({
  type: "micro",
  palette: {
    accents_1: "var(--accents-1)",
    accents_2: "var(--accents-2)",
    accents_3: "var(--accents-3)",
    accents_4: "var(--accents-4)",
    accents_5: "var(--accents-5)",
    accents_6: "var(--accents-6)",
    accents_7: "var(--accents-7)",
    accents_8: "var(--accents-8)",
    background: "var(--micro-background)",
    foreground: "var(--micro-foreground)",
    selection: "var(--micro-selection)",
    secondary: "var(--micro-secondary)",
    code: "var(--micro-code)",
    border: "var(--accents-2)",
    link: "var(--micro-link-color)",
  },
  expressiveness: {
    dropdownBoxShadow: "var(--dropdown-box-shadow)",
    shadowSmall: "var(--shadow-small)",
    shadowMedium: "var(--shadow-medium)",
    shadowLarge: "var(--shadow-large)",
    portalOpacity: ("var(--portal-opacity)" as unknown) as number,
  },
  font: {
    mono: "var(--font-mono)",
    sans: "var(--font-sans)",
  },
  layout: {
    radius: "var(--micro-radius)",
  },
});