import DATE_RANGE_OPTIONS from "../constants/DateRangeOptions";

export function convertDateRange(selectedDateRange) {
  /* grab the values from the DATE_RANGE_OPTIONS obj,
  create a new obj of just display text keys and query text values */
  const dateRangeMap = Object.values(DATE_RANGE_OPTIONS).reduce(
    (dateMap, value) => {
      dateMap[value.displayText] = value.queryText;
      return dateMap;
    },
    {}
  );
  return dateRangeMap[selectedDateRange];
}

export const dateRangeDisplayText = Object.values(DATE_RANGE_OPTIONS).map(
  (dateInfo) => {
    return dateInfo.displayText;
  }
);
