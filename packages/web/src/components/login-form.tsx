import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { Fragment, useRef, useState } from 'react';
import { useToasts } from '../hooks/use-toasts.helper';
import { Button } from './button/button';
import { Input } from './input/input';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginProps {
  loading: boolean;
  buttonText: string;
  onContinue: (user: LoginData) => void;
}

export const LoginForm: FC<LoginProps> = (props) => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const setToast = useToasts();
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const disabled = !username || !password || props.loading;
  const onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value.toLowerCase());
  };
  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const onContinue = () => {
    if (props.loading) return;
    if (!username) {
      // focus username if missing on enter
      // only show toast if username is already focused
      if (document.activeElement === usernameRef.current) {
        setToast({
          text: 'Username is required.',
          error: true,
        });
      } else {
        usernameRef.current?.focus();
      }

      return;
    }

    if (!password) {
      // same as username above
      if (document.activeElement === passwordRef.current) {
        setToast({
          text: 'Password is required.',
          error: true,
        });
      } else {
        passwordRef.current?.focus();
      }

      return;
    }

    if (disabled) return;
    props.onContinue({ username, password });
  };

  const onKeyDown = (event: KeyboardEvent<unknown>) => {
    if (event.key !== 'Enter') return;
    onContinue();
  };

  return (
    <Fragment>
      <Input placeholder="Username" onKeyDown={onKeyDown} onChange={onUsernameChange} autoFocus ref={usernameRef} />
      <Input
        className="mt-2"
        type="password"
        placeholder="Password"
        ref={passwordRef}
        onKeyDown={onKeyDown}
        onChange={onPasswordChange}
      />
      <Button className="mt-4" onClick={onContinue} onKeyDown={onKeyDown} disabled={disabled} primary>
        {props.buttonText}
      </Button>
    </Fragment>
  );
};
