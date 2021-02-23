import moment from "moment";

export function formatDate(time: Date | string) {
  // todo: https://i.imgur.com/eLPfjdE.png moment is huge
  return moment(time).fromNow();
}
