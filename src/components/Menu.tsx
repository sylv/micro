import { Button } from "@geist-ui/react";
import { Crop } from "@geist-ui/react-icons";
import Link from "next/link";
import styled from "styled-components";
import { useUser } from "../hooks/useUser";
import { Container } from "./Container";
import { ThemeSwitcher } from "./ThemeSwitcher";

const MenuNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  position: relative;
  margin: 0 auto;
  height: 60px;
`;

const MenuBrand = styled.a`
  display: flex;
  align-items: center;
  color: inherit;
  svg {
    margin-right: 0.5em;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
`;

export function Menu() {
  const user = useUser();
  const buttonHref = user.data ? "/dashboard" : "/login";
  const buttonText = user.data ? "Enter" : "Sign in";

  return (
    <Container>
      <MenuNav>
        <Link href="/" passHref>
          <MenuBrand>
            <Crop /> micro
          </MenuBrand>
        </Link>
        <MenuContainer>
          <ThemeSwitcher />
          <Link href={buttonHref} passHref>
            <a>
              <Button auto style={{ marginLeft: "var(--micro-gap-half)" }} type="success" size="small">
                {buttonText}
              </Button>
            </a>
          </Link>
        </MenuContainer>
      </MenuNav>
    </Container>
  );
}
