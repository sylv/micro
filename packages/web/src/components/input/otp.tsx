import type { FC } from "react";
import { Input } from "./input";
import { Spinner } from "../spinner";

interface OtpInputProps {
  loading: boolean;
  invalid?: boolean;
  onCode: (code: string) => void;
}

const TOTP_CODE_LENGTH = 6;
const RECOVERY_CODE_LENGTH = 19;
const NUMBER_REGEX = /^\d+$/u;

export const OtpInput: FC<OtpInputProps> = ({ loading, invalid, onCode }) => {
  return (
    <div className="relative w-full">
      <Input
        isError={invalid}
        placeholder="123456"
        onChange={(event) => {
          if (loading || !event.currentTarget.value) return;
          if (
            (event.currentTarget.value.length === TOTP_CODE_LENGTH &&
              NUMBER_REGEX.test(event.currentTarget.value)) ||
            event.currentTarget.value.length === RECOVERY_CODE_LENGTH
          ) {
            onCode(event.currentTarget.value);
          }
        }}
        onKeyDown={(event) => {
          if (loading || !event.currentTarget.value) return;
          if (event.key === "Enter") {
            onCode(event.currentTarget.value);
          }
        }}
      />
      {loading && (
        <div className="absolute right-3 top-0 bottom-0 flex items-center justify-center">
          <Spinner size="small" />
        </div>
      )}
    </div>
  );
};
