import classNames from 'classnames';
import { Fragment, memo, useRef, useState } from 'react';
import { Crop } from 'react-feather';
import { http } from '../../helpers/http.helper';
import { useAsync } from '../../hooks/use-async';
import { useConfig } from '../../hooks/use-config.hook';
import { useOnClickOutside } from '../../hooks/use-on-click-outside.helper';
import { usePaths } from '../../hooks/use-paths.helper';
import { useUser } from '../../hooks/use-user.helper';
import { Button } from '../button/button';
import { Container } from '../container';
import { Input } from '../input/input';
import { Link } from '../link';
import { HeaderUser } from './header-user';

export const Header = memo(() => {
  const user = useUser();
  const paths = usePaths();
  const config = useConfig();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const emailInputRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [resent, setResent] = useState(false);
  const classes = classNames(
    'relative z-10 flex items-center justify-between h-16 my-auto transition',
    paths.loading && 'pointer-events-none invisible'
  );

  useOnClickOutside(emailInputRef, () => {
    if (email) return;
    setShowEmailInput(false);
  });

  const [resendVerification, sendingVerification] = useAsync(async () => {
    if (!user.data) return;
    if (!user.data.email && !email) {
      setShowEmailInput(true);
      return;
    }

    const body = !user.data.email && email ? { email } : {};
    await http(`user/${user.data.id}/verify`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setShowEmailInput(false);
    setResent(true);
  });

  return (
    <Fragment>
      {user.data && !user.data.verifiedEmail && config.data?.email && (
        <div className="bg-purple-500 py-2 text-white shadow-2xl">
          <Container>
            <span className="relative">
              You must verify your email before you can upload files.{' '}
              <button type="button" className="underline" onClick={resendVerification} disabled={sendingVerification}>
                {resent ? 'Verification email sent' : 'Resend verification email'}
              </button>
              {showEmailInput && (
                <div
                  className="absolute bg-dark-100 top-full mt-2 p-3 rounded max-w-md z-20 md:right-0 border border-dark-400"
                  ref={emailInputRef}
                >
                  <h4 className="font-medium leading-6">Missing Email</h4>
                  <p className="text-gray-500 text-sm">
                    Your account was created before this instance required emails. To verify your account, please enter
                    the email you would like your account to be attached to and hit submit.
                  </p>
                  <div className="mt-3 flex gap-2 items-center">
                    <Input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="flex-grow"
                      placeholder="Email"
                      disabled={sendingVerification}
                    />
                    <Button primary onClick={resendVerification} className="w-auto">
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </span>
          </Container>
        </div>
      )}
      <Container>
        <nav className={classes}>
          <div className="flex items-center">
            <Link href={paths.home} className="flex">
              <Crop className="mr-2 text-brand" /> micro
            </Link>
          </div>
          <div className="flex items-center">
            {user.data ? (
              <HeaderUser userId={user.data.id} username={user.data.username} />
            ) : (
              <Button href={paths.login} className="bg-dark-500 hover:bg-dark-900">
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </Container>
    </Fragment>
  );
});
