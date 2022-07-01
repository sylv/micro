import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { Fragment, useRef, useState } from 'react';
import { useToasts } from '../hooks/useToasts';
import { Button } from './button';
import { Input } from './input/input';

export interface LoginData {
  email?: string;
  username: string;
  password: string;
}

export interface LoginProps {
  loading: boolean;
  buttonText: string;
  emailPrompt: boolean;
  onContinue: (user: LoginData) => void;
}

export const LoginForm: FC<LoginProps> = ({ loading, buttonText, emailPrompt, onContinue }) => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const createToast = useToasts();
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const disabled = !username || !password || loading;
  const onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value.toLowerCase());
  };

  const onSubmit = () => {
    if (loading) return;
    if (!username) {
      // focus username if missing on enter
      // only show toast if username is already focused
      if (document.activeElement === usernameRef.current) {
        createToast({
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
        createToast({
          text: 'Password is required.',
          error: true,
        });
      } else {
        passwordRef.current?.focus();
      }

      return;
    }

    if (disabled) return;
    onContinue({ username, password, email: email || undefined });
  };

  const onKeyDown = (event: KeyboardEvent<unknown>) => {
    if (event.key !== 'Enter') return;
    onSubmit();
  };

  return (
    <Fragment>
      {emailPrompt && (
        <Input
          placeholder="Email"
          className="mb-2"
          type="email"
          onKeyDown={onKeyDown}
          autoFocus
          ref={usernameRef}
          onChange={(event) => setEmail(event.target.value)}
        />
      )}
      <Input
        placeholder="Username"
        type="username"
        onKeyDown={onKeyDown}
        onChange={onUsernameChange}
        autoFocus
        ref={usernameRef}
      />
      <Input
        className="mt-2"
        type="password"
        placeholder="Password"
        ref={passwordRef}
        onKeyDown={onKeyDown}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button className="mt-4" onClick={onSubmit} onKeyDown={onKeyDown} disabled={disabled} primary>
        {buttonText}
      </Button>
    </Fragment>
  );
};
