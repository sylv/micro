import { Sun, Moon } from "@geist-ui/react-icons";
import { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../../pages/_app";

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5em;
  cursor: pointer;
  padding: 5px;
  transition: all 150ms;
  opacity: 0.5;
  :hover {
    opacity: 1;
  }
  svg {
    height: 1.25em;
  }
`;

export function MenuThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const Icon = theme === "light" ? Sun : Moon;

  return (
    <ToggleContainer onClick={toggleTheme}>
      <Icon />
    </ToggleContainer>
  );
}
