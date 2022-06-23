export const replaceUsername = (host: string, username: string) => {
  return host.replace('{{username}}', username);
};
