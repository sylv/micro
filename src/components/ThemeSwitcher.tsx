import { ButtonDropdown } from "@geist-ui/react";
import { Monitor, Moon, Sun } from "@geist-ui/react-icons";
import { useEffect, useState } from "react";
import styled from "styled-components";

enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

const ThemeSwitcherContainer = styled.div`
  svg {
    height: 1rem;
  }
  * {
    border-color: var(--accents-1) !important;
  }
`;

export const ThemeSwitcher = () => {
  const persistedTheme = typeof localStorage !== "undefined" ? localStorage.theme : undefined;
  const prefersDark = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : true;
  const [theme, setTheme] = useState<Theme | undefined>(persistedTheme);
  const updateTheme = (theme?: Theme) => {
    switch (theme) {
      case Theme.DARK:
        document.documentElement.classList.add(Theme.DARK);
        localStorage.theme = theme;
        break;
      case Theme.LIGHT:
        document.documentElement.classList.remove(Theme.DARK);
        localStorage.theme = theme;
        break;
      case undefined: {
        if (prefersDark) document.documentElement.classList.add(Theme.DARK);
        else document.documentElement.classList.remove(Theme.DARK);
        localStorage.removeItem("theme");
        break;
      }
    }

    setTheme(theme);
  };

  useEffect(() => {
    setTheme(localStorage.theme);
  }, []);

  return (
    <ThemeSwitcherContainer>
      <ButtonDropdown auto size="mini">
        <ButtonDropdown.Item main={theme === Theme.LIGHT} onClick={() => updateTheme(Theme.LIGHT)}>
          <Sun /> Light
        </ButtonDropdown.Item>
        <ButtonDropdown.Item main={theme === Theme.DARK} onClick={() => updateTheme(Theme.DARK)}>
          <Moon /> Dark
        </ButtonDropdown.Item>
        <ButtonDropdown.Item main={!theme} onClick={() => updateTheme()}>
          <Monitor /> System
        </ButtonDropdown.Item>
      </ButtonDropdown>
    </ThemeSwitcherContainer>
  );
};
