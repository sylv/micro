import ErrorPage, { Lenny } from './_error';

export default function InternalServerError() {
  return <ErrorPage message="Internal Server Error" lenny={Lenny.Shrug} />;
}
