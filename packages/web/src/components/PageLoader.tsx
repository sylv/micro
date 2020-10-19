import { Loading } from "@geist-ui/react";
import styled from "styled-components";

const PageLoaderContainer = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export function PageLoader() {
  return (
    <PageLoaderContainer>
      <Loading size="large" />
    </PageLoaderContainer>
  );
}
