import { Dot, Text } from "@geist-ui/react";

export interface ErrorProps {
  message?: string;
  error?:
    | string
    | {
        status?: number;
        message: string;
      };
}

function getErrorMessage(props: ErrorProps) {
  if (props.message) return props.message;
  if (props.error) {
    if (typeof props.error === "string") return props.error;
    if (props.error.status) return `${props.error.message} (${props.error.status})`;
    return props.error.message;
  }
}

export function ErrorMessage(props: ErrorProps) {
  const message = getErrorMessage(props);
  if (!message) return <></>;
  return (
    <Dot type="error">
      <Text type="error">{message}</Text>
    </Dot>
  );
}
