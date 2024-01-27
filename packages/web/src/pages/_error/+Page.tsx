import { Error, Lenny } from '../../components/error';

// is404 doesn't appear to actually be set, so...
export default function ErrorPage({ is404 }: { is404: boolean }) {
  return <Error lenny={Lenny.Angry} message="This page doesn't exist, or something went wrong rendering it." />;
}
