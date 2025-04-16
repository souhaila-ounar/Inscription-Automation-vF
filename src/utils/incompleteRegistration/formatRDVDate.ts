import moment from "moment-timezone";

export function convertDate(inputDate: string): string {
  const fromFormat = "DD-MM-YYYY HH:mm:ss";
  const toFormat = "YYYY-MM-DDTHH:mm:ssZ";
  const fromTimezone = "EST5EDT";
  const parsedDate = moment.tz(inputDate, fromFormat, fromTimezone);
  const convertedDate = parsedDate.clone().tz(fromTimezone);
  return convertedDate.format(toFormat);
}
