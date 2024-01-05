import { formatInTimeZone } from "date-fns-tz";

export const dateFormat = (date, format, region) => {
  return formatInTimeZone(
    date,
    region ? region : "America/New_York",
    format ? format : "MMMM d, yyyy"
  );
};
