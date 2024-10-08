import DATE_RANGE_OPTIONS from '$lib/constants/DateRangeOptions';
import type { AirnoteReading } from '$lib/services/AirReadingModel';
import { isAfter, subDays } from 'date-fns';

interface DateRangeOption {
  [key: string]: number;
}

export function convertDateRange(selectedDateRange: string) {
  /* grab the values from the DATE_RANGE_OPTIONS obj,
  create a new obj of just display text keys and daysPrior values */
  const dateRangeMap: DateRangeOption = Object.values(
    DATE_RANGE_OPTIONS
  ).reduce((dateMap: DateRangeOption, value) => {
    dateMap[value.displayText] = value.daysPrior;
    return dateMap;
  }, {});
  return dateRangeMap[selectedDateRange];
}

export const dateRangeDisplayText = Object.values(DATE_RANGE_OPTIONS).map(
  (dateInfo) => {
    return dateInfo.displayText;
  }
);

export function filterEventsByDate(
  events: AirnoteReading[],
  daysPrior: number
) {
  const startingDate = subDays(new Date(), daysPrior);
  // Filter out any events that occurred before the starting date
  return events.filter((event) => isAfter(event.captured * 1000, startingDate));
}

function convertToSeconds(millisecondsTimestamp: number) {
  return Math.floor(millisecondsTimestamp / 1000);
}

export function convertTimeframeToSeconds(timeframe: number) {
  const endDateMs = new Date().getTime();
  const endDateSecs = convertToSeconds(endDateMs);
  const startDateMs = new Date(
    endDateMs - timeframe * 24 * 60 * 60 * 1000
  ).getTime();
  const startDateSecs = convertToSeconds(startDateMs);

  return {
    endDateSecs,
    startDateSecs
  };
}
