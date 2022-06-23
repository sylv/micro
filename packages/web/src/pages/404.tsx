import { StatusCodes } from 'http-status-codes';
import Error from './_error';

export default function NotFound() {
  return <Error status={StatusCodes.NOT_FOUND} message="This ain't it chief." />;
}
