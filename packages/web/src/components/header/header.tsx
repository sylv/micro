import classNames from 'classnames';
import { memo } from 'react';
import { Crop } from 'react-feather';
import { usePaths } from '../../hooks/use-paths.helper';
import { useUser } from '../../hooks/use-user.helper';
import { Button } from '../button/button';
import { Container } from '../container';
import { Link } from '../link';
import { HeaderUser } from './header-user';

export const Header = memo(() => {
  const user = useUser();
  const paths = usePaths();
  const classes = classNames(
    'relative z-10 flex items-center justify-between h-16 my-auto transition',
    paths.loading && 'pointer-events-none invisible'
  );

  return (
    <Container>
      <nav className={classes}>
        <div className="flex items-center">
          <Link href={paths.home} className="flex">
            <Crop className="mr-2 text-brand" /> micro
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/paste" className="mr-2 text-gray-500 transition hover:text-gray-400">
            Paste
          </Link>
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
  );
});
