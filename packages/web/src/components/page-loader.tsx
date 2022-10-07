import { Container, Spinner } from '@ryanke/pandora';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Title } from './title';

export const PageLoader: FC<{ title?: string }> = ({ title }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <Container center>
      {title && <Title>{title}</Title>}
      <Spinner size="large" />
    </Container>
  );
};
