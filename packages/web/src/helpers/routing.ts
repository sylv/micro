export const navigate = (url: string, options?: { overwriteLastHistoryEntry: boolean }) => {
  window.location.href = url;
};

export const reload = () => {
  window.location.reload();
};

export const prefetch = (url: string) => {
  // todo: no-op from client routing days,
  // left because it might be useful in the future.
};
