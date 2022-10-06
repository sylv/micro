import { Spinner } from '@ryanke/pandora';
import type { FC } from 'react';
import { Input } from './input';

export interface TotpInputProps {
  loading: boolean;
  invalid?: boolean;
  onCode: (code: string) => void;
}

const TOTP_CODE_LENGTH = 6;
const RECOVERY_CODE_LENGTH = 19;
const NUMBER_REGEX = /^\d+$/u;

export const OtpInput: FC<TotpInputProps> = ({ loading, invalid, onCode }) => {
  return (
    <div className="relative w-full">
      <Input
        isError={invalid}
        placeholder="123456"
        onChange={(event) => {
          if (loading || !event.target.value) return;
          if (
            (event.target.value.length === TOTP_CODE_LENGTH && NUMBER_REGEX.test(event.target.value)) ||
            event.target.value.length === RECOVERY_CODE_LENGTH
          ) {
            onCode(event.target.value);
          }
        }}
        onKeyDown={(event) => {
          if (loading || !event.currentTarget.value) return;
          if (event.key === 'Enter') {
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
