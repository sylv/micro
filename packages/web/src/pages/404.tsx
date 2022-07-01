import ErrorPage, { Lenny } from './_error';

export default function NotFound() {
  return <ErrorPage message="This ain't it chief" lenny={Lenny.Shrug} />;
}
