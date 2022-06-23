import { StatusCodes } from 'http-status-codes';
import Error from './_error';

export default function InternalServerError() {
  return <Error status={StatusCodes.INTERNAL_SERVER_ERROR} />;
}
