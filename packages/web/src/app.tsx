import React, { FC, Fragment } from 'react';
import { Header } from './components/header/header';
import { Title } from './components/title';
import './styles/globals.css';
import { ToastProvider } from './components/toast';
import { Helmet } from 'react-helmet-async';

interface AppProps {
  children: React.ReactNode;
}

declare module 'react' {
  export type SVGAttributes<T extends EventTarget> = import('preact').JSX.SVGAttributes<T>;
}

export const App: FC<AppProps> = ({ children }) => (
  <Fragment>
    <Title>Home</Title>
    <Helmet>
      <meta property="og:site_name" content="micro" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    </Helmet>
    <ToastProvider>
      <Header />
      <div className="py-4 md:py-16">{children}</div>
    </ToastProvider>
  </Fragment>
);
