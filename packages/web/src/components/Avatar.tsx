import * as avatar from "generate-avatar";
import styled from "styled-components";

export interface AvatarProps {
  id: string;
  size?: string;
  className?: string;
}

const AvatarContainer = styled.div<{ height: string; width: string }>`
  user-select: none;
  svg {
    height: ${(props) => props.height};
    width: ${(props) => props.width};
    border-radius: 50%;
  }
`;

export function Avatar(props: AvatarProps) {
  const svg = avatar.generateFromString(props.id);
  return (
    <AvatarContainer
      height={props.size}
      width={props.size}
      className={props.className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
