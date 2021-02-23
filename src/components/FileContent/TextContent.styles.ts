import styled from "styled-components";

export const TextContentContainer = styled.div`
  height: 100%;
  pre {
    margin: 0;
    max-height: var(--micro-preview-max-height);
    min-height: var(--micro-preview-min-height);
    overflow: scroll;
    border-radius: 0;
    border-color: transparent;
    border-bottom-color: var(--accents-2) !important;
  }
`;

export const Wrapper = styled.div`
  font-family: sans-serif;
  text-align: center;
`;

export const Pre = styled.pre`
  text-align: left;
  margin: 1em 0;
  padding: 0.5em;
  overflow: scroll;
  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }
`;

export const Line = styled.div`
  display: table-row;
`;

export const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`;

export const LineContent = styled.span`
  display: table-cell;
`;

export const TextContentCopy = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin: 0.5em;
  opacity: 0.35;
  transition: opacity 250ms;
  :hover {
    opacity: 1;
  }
`;
