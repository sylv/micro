export class HTTPError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}
