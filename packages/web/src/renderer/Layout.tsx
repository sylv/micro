import type { ReactNode } from "react";
import { StrictMode } from "react";
import { Header } from "../components/header/header";
import { ToastProvider } from "../components/toast/toast-provider";
import "../styles/globals.css";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <StrictMode>
      <Header />
      <div className="py-4 md:py-16">{children}</div>
      <ToastProvider />
    </StrictMode>
  );
};
