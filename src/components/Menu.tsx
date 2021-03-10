import { Button } from "@geist-ui/react";
import { Crop } from "@geist-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { Endpoints } from "../constants";
import { useUser } from "../hooks/useUser";
import { GetServerConfigData } from "../types";
import { Container } from "./Container";
import { ThemeSwitcher } from "./ThemeSwitcher";

const MenuNav = styled.nav<{ visible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  position: relative;
  margin: 0 auto;
  height: 60px;
  transition: opacity 150ms;
  pointer-events: ${(props) => !props.visible && "none"};
  opacity: ${(props) => !props.visible && "0"};
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
  const server = useSWR<GetServerConfigData>(Endpoints.CONFIG);
  const windowHost = typeof window === "undefined" ? "" : window.location.host;
  const base = server.data && server.data.host !== windowHost ? `//${server.data.host}/` : "/";
  const buttonHref = base + (user.data ? "dashboard" : "login");
  const buttonText = user.data ? "Enter" : "Sign in";

  return (
    <Container>
      <MenuNav visible={!!server.data}>
        <MenuContainer>
          <Link href={base} passHref>
            <MenuBrand>
              <Crop /> micro
            </MenuBrand>
          </Link>
        </MenuContainer>
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
